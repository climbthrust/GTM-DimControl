use base64::Engine;
use lazy_static::lazy_static;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::fs;
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
    pub part_number: String,
    pub image_base64: Option<String>,
}

#[tauri::command]
pub fn get_first_product() -> Result<Product, String> {
    let conn = DB_CONN.lock().unwrap();

    let mut stmt = conn
        .prepare("SELECT id, name, part_number, image_path FROM products ORDER BY id ASC LIMIT 1")
        .map_err(|e| e.to_string())?;

    let mut rows = stmt
        .query_map([], |row| {
            let id: i32 = row.get(0)?;
            let name: String = row.get(1)?;
            let part_number: String = row.get(2)?;
            let file_name: String = row.get(3)?;

            let mut img_path = std::env::current_dir().unwrap();
            if img_path.ends_with("src-tauri") {
                img_path.pop();
            }
            img_path.push("data");
            img_path.push("product_images");
            img_path.push(&part_number);
            img_path.push(&file_name);
println!("📸 image_path = {:?}", img_path);


            // Datei einlesen → base64
            let img_bytes = fs::read(img_path).unwrap_or_default();
            let img_base64 = if !img_bytes.is_empty() {
                Some(format!(
                    "data:image/jpeg;base64,{}",
                    base64::engine::general_purpose::STANDARD.encode(img_bytes)
                ))
            } else {
                None
            };

            Ok(Product {
                id,
                name,
                part_number,
                image_base64: img_base64,
            })
        })
        .map_err(|e| e.to_string())?;

    if let Some(result) = rows.next() {
        result.map_err(|e| e.to_string())
    } else {
        Err("Keine Produkte gefunden".to_string())
    }
}
