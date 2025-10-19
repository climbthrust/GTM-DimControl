#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

mod db;

fn main() {
    tauri::Builder::default()
         .setup(|app| {
            // ✅ aktueller Methodenname:
            let window = app.get_webview_window("main").unwrap();
            window.maximize().unwrap();
            window.set_focus().unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            db::get_first_product,
            db::get_dimensions_for_product,
            db::load_all_measurement_tools
        ])
        .run(tauri::generate_context!())
        .expect("Fehler beim Starten der App");
}