use crate::data::branches::types::Branch;
use crate::data::colors::types::ColorValue;
use crate::error_handling::command_errors::Error;
use crate::filesystem::constants::BRANCH_PATH;
use crate::filesystem::path_utils::get_sys_path;
use serde::Deserialize;
use std::fs::{self};
use std::path::{Path, PathBuf};
use tauri::AppHandle;

pub fn read_file<T>(app: AppHandle, path: &Path) -> Result<T, Error>
where
  T: for<'a> Deserialize<'a>,
{
  let sys_path = get_sys_path(app.clone(), path)?;
  println!("Reading: {sys_path:?}"); //TODO: Remove
  let raw = fs::read_to_string(&sys_path)?;
  let data: T = serde_json::from_str(&raw)?;

  Ok(data)
}

pub fn find_color(app: AppHandle, mut path: PathBuf) -> Result<ColorValue, Error> {
  loop {
    let branch = read_file::<Branch>(app.clone(), &path.join(BRANCH_PATH))?;
    if let Some(color) = branch.color {
      return Ok(color);
    }
    path = path
      .parent()
      .ok_or(Error::msg("Couldn't find color"))? //TODO: make this more useful
      .to_path_buf();
  }
}
