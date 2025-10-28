use lazy_static::lazy_static;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;

lazy_static! {
    static ref DB_CONN: Mutex<Connection> = {
        let path = get_db_path();
        let conn = Connection::open(path).expect("DB öffnen fehlgeschlagen");
        Mutex::new(conn)
    };
}

fn get_db_path() -> PathBuf {
    let mut base = std::env::current_dir().unwrap();
    if base.ends_with("src-tauri") {
        base.pop();
    }
    base.push("data");
    base.push("DimControlDB.sqlite");
    base
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub series: Option<String>,
    pub product_type: Option<String>,
    pub image_file_name: Option<String>,
    pub notes: Option<String>,
    pub serial_number: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Dimension {
    pub id: i32,
    pub product_id: i32,
    pub name: String,
    pub nominal: f64,
    pub tol_plus: f64,
    pub tol_minus: f64,
    pub unit: String,
    pub measurement_tool_id: Option<i32>,
    pub admin_note: Option<String>,
    pub user_note: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MeasurementTool {
    pub id: i32,
    pub name: String,
    pub bluetooth_id: Option<String>,
    pub device_type: Option<String>,
    pub calibration_date: Option<String>,
    pub valid_until: Option<String>,
    pub notes: Option<String>,
    pub image_file_name: Option<String>,
}

#[tauri::command]
pub fn get_dimensions_for_product(product_id: i32) -> Result<Vec<Dimension>, String> {
    let conn = DB_CONN.lock().unwrap();

    let mut stmt = conn
        .prepare(
            "SELECT 
                id,
                product_id,
                name,
                nominal,
                tol_plus,
                tol_minus,
                unit,
                measurement_tool_id,
                admin_note,
                user_note,
                created_at,
                updated_at
             FROM dimensions
             WHERE product_id = ?1
             ORDER BY id ASC",
        )
        .map_err(|e| e.to_string())?;

    let dimension_iter = stmt
        .query_map([product_id], |row| {
            Ok(Dimension {
                id: row.get(0)?,
                product_id: row.get(1)?,
                name: row.get(2)?,
                nominal: row.get(3)?,
                tol_plus: row.get(4)?,
                tol_minus: row.get(5)?,
                unit: row.get(6)?,
                measurement_tool_id: row.get(7).ok(),
                admin_note: row.get(8).ok(),
                user_note: row.get(9).ok(),
                created_at: row.get(10).ok(),
                updated_at: row.get(11).ok(),
            })
        })
        .map_err(|e| e.to_string())?;

    let mut dimensions = Vec::new();
    for dim in dimension_iter {
        dimensions.push(dim.map_err(|e| e.to_string())?);
    }

    if dimensions.is_empty() {
        Err(format!(
            "Keine Messpunkte für Produkt-ID {} gefunden",
            product_id
        ))
    } else {
        Ok(dimensions)
    }
}

#[tauri::command]
pub fn load_all_measurement_tools() -> Result<Vec<MeasurementTool>, String> {
    let conn = DB_CONN.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, name, bluetooth_id, device_type, calibration_date, valid_until, notes, image_file_name FROM measurement_tools ORDER BY name ASC;")
        .map_err(|e| e.to_string())?;

    let iter = stmt
        .query_map([], |row| {
            Ok(MeasurementTool {
                id: row.get(0)?,
                name: row.get(1)?,
                bluetooth_id: row.get(2)?,
                device_type: row.get(3)?,
                calibration_date: row.get(4)?,
                valid_until: row.get(5)?,
                notes: row.get(6)?,
                image_file_name: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tools = Vec::new();
    for t in iter {
        tools.push(t.map_err(|e| e.to_string())?);
    }

    Ok(tools)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SerialNumber {
    pub id: i32,
    pub serial_number: String,
    pub product_id: i32,
    pub created_at: Option<String>,
}

#[tauri::command]
pub fn get_product_by_serial(serial_number: String) -> Result<Product, String> {
    let conn = DB_CONN.lock().unwrap();

    // Produkt + Seriennummer in einem JOIN laden
    let mut stmt = conn
        .prepare(
            "SELECT 
                p.id,
                p.name,
                p.series,
                p.product_type,
                p.image_file_name,
                p.notes,
                s.serial_number
             FROM serial_numbers s
             JOIN products p ON s.product_id = p.id
             WHERE s.serial_number = ?1",
        )
        .map_err(|e| e.to_string())?;

    let product = stmt
        .query_row([serial_number.trim()], |row| {
            Ok(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                series: row.get(2)?,
                product_type: row.get(3)?,
                image_file_name: row.get(4)?,
                notes: row.get(5)?,
                serial_number: row.get(6)?,
            })
        })
        .map_err(|e| match e {
            rusqlite::Error::QueryReturnedNoRows => "Seriennummer nicht gefunden".to_string(),
            _ => format!("Fehler beim Laden des Produkts: {e}"),
        })?;

    Ok(product)
}
