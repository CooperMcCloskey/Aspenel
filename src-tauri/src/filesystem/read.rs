use std::fs::{self};
use std::path::{Path, PathBuf};
use serde::Deserialize;
use tauri::{AppHandle};
use crate::data::branches::types::Branch;
use crate::error_handling::command_errors::Error;
use crate::filesystem::path_utils::get_sys_path;

pub fn read_file<T>(app: AppHandle, path: &Path) -> Result<T, Error>
where
    T: for<'a> Deserialize<'a>, 
{
  let sys_path = get_sys_path(app.clone(), path)?;
  let json = fs::read_to_string(&sys_path)?;
  let data: T = serde_json::from_str(&json)?;

  Ok(data)
}

pub fn check_color(app: AppHandle, path: PathBuf, parent_color: String) -> Result<String, Error> {
  let branch = read_file::<Branch>(app.clone(), &path)?;
  let color = branch.color.unwrap_or(parent_color);
  Ok(color)
}

pub fn find_color(app: AppHandle, mut path: PathBuf) -> Result<String, Error> {
  loop {
    let branch = read_file::<Branch>(app.clone(), &path)?;
    if let Some(color) = branch.color {
      return Ok(color);
    }
    path = path
      .parent()
      .ok_or(Error::from("Couldn't find color"))?
      .to_path_buf();
  }
}
