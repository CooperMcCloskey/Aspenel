use std::path::PathBuf;

use tauri::AppHandle;

use crate::error_handling::command_errors::Error;
use crate::filesystem::commands::read_document;

pub fn get_color(app: AppHandle, path: PathBuf) -> Result<Option<String>, Error> {
  let test_document = read_document(app.clone(), path)?.get_document();
  return Ok(test_document.get_color());
}