
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod error_handling;
mod filesystem;
mod utils;
mod table_data;
mod branch_data;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      filesystem::commands::read_branch,
      filesystem::commands::read_dir,
      filesystem::commands::rename_file,
      filesystem::commands::delete_file,
      filesystem::commands::join_path,
      filesystem::commands::get_path_components,
      filesystem::commands::get_path_separator,

      branch_data::commands::find_color,
      branch_data::commands::check_color,
      branch_data::commands::create_home_branch,
      branch_data::commands::create_branch,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
