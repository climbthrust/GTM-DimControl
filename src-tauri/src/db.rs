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
    pub series: String,
    pub product_type: String,
    pub image_file_name: String,
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
    pub inspection_tool: Option<String>,
    pub admin_note: Option<String>,
    pub user_note: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[tauri::command]
pub fn get_first_product() -> Result<Product, String> {
    let conn = DB_CONN.lock().unwrap();

    let mut stmt = conn
        .prepare(
            "SELECT id, name, series, product_type, image_file_name 
             FROM products 
             ORDER BY id ASC LIMIT 1",
        )
        .map_err(|e| e.to_string())?;

    let mut rows = stmt
        .query_map([], |row| {
            Ok(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                series: row.get(2)?,
                product_type: row.get(3)?,
                image_file_name: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    if let Some(result) = rows.next() {
        result.map_err(|e| e.to_string())
    } else {
        Err("Keine Produkte gefunden".to_string())
    }
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
                inspection_tool,
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
                inspection_tool: row.get(7).ok(),
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
