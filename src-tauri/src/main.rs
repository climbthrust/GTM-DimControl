#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod db;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // ✅ aktueller Methodenname für Tauri 2.x:
            if let Some(window) = app.webview_windows().get("main") {
                window.maximize().unwrap();
                window.set_focus().unwrap();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            db::get_dimensions_for_product,
            db::load_all_measurement_tools,
            db::get_product_by_serial,
            db::update_dimension_tool // ✅ neue Funktion eingebunden
        ])
        .run(tauri::generate_context!())
        .expect("Fehler beim Starten der App");
}
