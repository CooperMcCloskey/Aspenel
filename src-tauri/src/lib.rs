// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod data_handling;
mod error_handling;
mod filesystem;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      filesystem::commands::read_document,
      filesystem::commands::read_dir,
      filesystem::commands::rename_file,
      filesystem::commands::delete_file,
      filesystem::commands::join_path,
      filesystem::commands::get_path_components,
      filesystem::commands::get_path_separator,

      data_handling::commands::find_color,
      data_handling::commands::check_color,
      data_handling::commands::create_home_branch,
      data_handling::commands::create_branch,
      data_handling::commands::create_leaf,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
