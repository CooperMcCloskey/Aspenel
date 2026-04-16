use std::path::{MAIN_SEPARATOR, PathBuf};

#[tauri::command]
pub fn join_path(base: PathBuf, part: PathBuf) -> PathBuf{
  base.join(part)
}

#[tauri::command]
pub fn get_path_components(path: PathBuf) -> Vec<String>{
  path.components()
    .map(|c| c.as_os_str().to_string_lossy().into_owned())
    .collect()
}

#[tauri::command]
pub fn get_path_separator() -> char{
  return MAIN_SEPARATOR
}