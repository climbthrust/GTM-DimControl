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

#[tauri::command]
pub fn get_first_product() -> Result<Product, String> {
    let conn = DB_CONN.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, name, series, product_type, image_file_name FROM products ORDER BY id ASC LIMIT 1")
        .map_err(|e| e.to_string())?;

    let mut rows = stmt
        .query_map([], |row| {
            let id: i32 = row.get(0)?;
            let name: String = row.get(1)?;
            let series: String = row.get(2)?;
            let product_type: String = row.get(3)?;
            let image_file_name: String = row.get(4)?;           

            Ok(Product {
                id,
                name,
                series,
                product_type,
                image_file_name,
            })
        })
        .map_err(|e| e.to_string())?;

    if let Some(result) = rows.next() {
        result.map_err(|e| e.to_string())
    } else {
        Err("Keine Produkte gefunden".to_string())
    }
}
