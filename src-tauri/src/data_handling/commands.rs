use std::path::PathBuf;

use tauri::AppHandle;

use crate::error_handling::command_errors::Error;
use crate::filesystem::commands::read_document;

#[tauri::command]
pub fn get_color(app: AppHandle, mut path: PathBuf) -> Result<String, Error> {
  loop {
    let test_document = read_document(app.clone(), path.clone())?.get_document();
    if let Some(color) = test_document.get_color() {
      return Ok(color);
    }
    path = path
      .parent()
      .ok_or(Error::from("Couldn't find color"))?
      .to_path_buf();
  }
}
