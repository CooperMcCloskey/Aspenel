use std::path::PathBuf;

use tauri::AppHandle;

use crate::branch_data::types::{Branch, FsBranch};
use crate::branch_data::utils::get_color;
use crate::error_handling::command_errors::Error;
use crate::filesystem::utils::write_branch;

#[tauri::command]
pub fn create_home_branch(app: AppHandle) -> Result<FsBranch, Error> {
  let branch = Branch::new_branch();
  let branch = branch.set_color("var(--red)");
  let fs_branch = write_branch(app, &PathBuf::from(""), "Home", branch)?;
  Ok(fs_branch)
}

#[tauri::command]
pub fn create_branch(app: AppHandle, path: PathBuf) -> Result<FsBranch, Error> {
  let branch = Branch::new_branch();
  let fs_branch = write_branch(app, &path, "New Branch", branch)?;
  Ok(fs_branch)
}

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

