use tauri::Manager;

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
      
      filesystem::read::load_branch,
      filesystem::read::load_dir,
      filesystem::read::delete_file,
      
      filesystem::path_utils::join_path,
      filesystem::path_utils::get_path_components,
      filesystem::path_utils::get_path_separator,

      filesystem::write::rename_file,
      filesystem::write::create_home_branch,
      filesystem::write::create_branch,
      filesystem::write::save_branch,

      data::branches::commands::find_color,
      data::branches::commands::check_color,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
