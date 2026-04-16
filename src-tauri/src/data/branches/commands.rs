use std::path::PathBuf;

use tauri::AppHandle;

use crate::data::branches::utils::get_color;
use crate::error_handling::command_errors::Error;

#[tauri::command]
pub fn check_color(app: AppHandle, path: PathBuf, parent_color: String) -> Result<String, Error>{
  let color = get_color(app, path)?.unwrap_or(parent_color);
  Ok(color)
}

#[tauri::command]
pub fn find_color(app: AppHandle, mut path: PathBuf) -> Result<String, Error> {
  loop {
    if let Some(color) = get_color(app.clone(), path.clone())? {
      return Ok(color);
    }
    path = path
      .parent()
      .ok_or(Error::from("Couldn't find color"))?
      .to_path_buf();
  }
}

