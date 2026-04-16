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
      filesystem::file_commands::read_branch,
      filesystem::file_commands::read_dir,
      filesystem::file_commands::rename_file,
      filesystem::file_commands::delete_file,
      
      filesystem::path_commands::join_path,
      filesystem::path_commands::get_path_components,
      filesystem::path_commands::get_path_separator,

      filesystem::write_commands::create_home_branch,
      filesystem::write_commands::create_branch,

      data::branches::commands::find_color,
      data::branches::commands::check_color,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
