use std::ffi::OsString;
use std::path::PathBuf;

use serde::Serializer;
use tauri::AppHandle;

use crate::error_handling::command_errors::Error;
use crate::filesystem::read::{read_branch};

pub fn get_color(app: AppHandle, path: PathBuf) -> Result<Option<String>, Error> {
  let test_branch = read_branch(app.clone(), path)?;
  return Ok(test_branch.get_color());
}

pub fn serialize_os_string<S>(value: &OsString, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_str(&value.to_string_lossy())
}