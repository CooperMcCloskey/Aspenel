use std::{fs::{self, File}, io::Write, path::PathBuf};

use serde::Serialize;
use tauri::{AppHandle, Manager};

use crate::{error_handling::command_errors::Error};

pub fn get_sys_path(app: AppHandle, path: &PathBuf) -> Result<PathBuf, Error>{
  let app_data_path = app.path().app_data_dir()?;
  Ok(app_data_path.join(&path))
}

pub fn create_dir(app: AppHandle, path: &PathBuf, name: &str) -> Result<(String, PathBuf), Error>{
  let sys_path = get_sys_path(app, path)?;

  let unique_name = unique_path_name(&sys_path, name);
  let path = path.join(&unique_name);
  
  fs::create_dir_all(sys_path.join(&unique_name))?;

  Ok((unique_name, path))
}
pub fn create_file(app: AppHandle, path: &PathBuf, name: &str) -> Result<(File, String), Error> {
  let sys_path = get_sys_path(app, path)?;
  let unique_name = unique_path_name(&sys_path, name);

  let file = fs::File::create(sys_path.join(&unique_name))?;
  return Ok((file, unique_name));
}
pub fn write_file<T: Serialize>(mut file: File, data: &T) -> Result<(), Error>{
  let json = serde_json::to_vec(data)?;
  file.write_all(&json)?;
  Ok(())
}

fn unique_path_name(parent_path: &PathBuf, name: &str) -> String {
  let path = parent_path.join(name);
  if !path.exists() {
    return name.to_string();
  }

  let mut counter = 1;
  let stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or(name);

  let ext = path.extension().and_then(|e| e.to_str());

  loop {
    let test_name = match ext {
      Some(ext) => format!("{stem} ({counter}).{ext}"),
      None => format!("{stem} ({counter})"),
    };

    let test_path = parent_path.join(&test_name);

    if !test_path.exists() {
      return test_name;
    }
    counter += 1;
  }
}
