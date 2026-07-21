// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod error_handling;
mod filesystem;
mod utils;
mod data;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      error_handling::log::log,

      filesystem::commands::load_branch,
      filesystem::commands::load_root_branch,
      filesystem::commands::load_dir,
      filesystem::commands::create_branch,
      filesystem::commands::create_root_branch,
      filesystem::commands::create_home_branch,
      filesystem::commands::rename_file,
      filesystem::commands::delete_file,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
