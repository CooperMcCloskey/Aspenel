use serde::Serialize;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::AppHandle;

use crate::error_handling::command_errors::Error;
use crate::filesystem::path_utils::{get_sys_path, unique_path_name};

pub fn create_dir(app: AppHandle, test_path: PathBuf, strict_name: bool) -> Result<PathBuf, Error> {
  let path = if strict_name {
    test_path.clone()
  } else {
    unique_path_name(app.clone(), &test_path)?
  };

  let sys_path = get_sys_path(app, &path)?;
  fs::create_dir_all(sys_path)?;

  Ok(path)
}

pub fn write_file(
  app: AppHandle,
  path: &Path,
  data: impl Serialize,
) -> Result<(), Error> {
  println!("Writing file at: {path:?}");
  let filename = path.file_name().unwrap().to_string_lossy().into_owned();
  let temp_filename = format!("temp_{filename}");

  let parent_path = path.parent().unwrap();
  let sys_path = get_sys_path(app.clone(), &parent_path.join(filename))?;
  let temp_sys_path = get_sys_path(app.clone(), &parent_path.join(temp_filename))?;

  let json = serde_json::to_vec(&data)?;
  let mut file = File::create(&temp_sys_path)?;
  file.write_all(&json)?;
  file.sync_all()?;
  fs::rename(temp_sys_path, sys_path)?;
  Ok(())
}

