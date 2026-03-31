use std::path::PathBuf;

use tauri::AppHandle;

use crate::error_handling::command_errors::Error;
use crate::filesystem::commands::read_branch;

pub fn get_color(app: AppHandle, path: PathBuf) -> Result<Option<String>, Error> {
  let test_branch = read_branch(app.clone(), path)?.get_branch();
  return Ok(test_branch.get_color());
}