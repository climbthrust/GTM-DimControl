#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![db::get_first_product])
        .run(tauri::generate_context!())
        .expect("Fehler beim Starten der App");
}