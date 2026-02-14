// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod error_handling;
mod filesystem;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      filesystem::commands::create_category,
      filesystem::commands::create_project,
      filesystem::commands::read_file,
      filesystem::commands::read_dir,
      filesystem::commands::rename_file,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
