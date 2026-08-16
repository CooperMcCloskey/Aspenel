use std::path::{Path, PathBuf};

use tauri::{AppHandle, Manager};

use crate::error_handling::command_errors::Error;

pub fn unique_path_name(app: AppHandle, path: &Path) -> Result<PathBuf, Error> {
  let sys_path = get_sys_path(app.clone(), path)?;
  if !sys_path.exists() {
    return Ok(path.to_path_buf());
  }

  let mut counter = 1;
  let ext = path.extension().map(|e| e.to_string_lossy());
  let stem = path.file_stem().unwrap().to_string_lossy();

  loop {
    let test_name = match &ext {
      Some(ext) => format!("{stem} ({counter}).{ext}"),
      None => format!("{stem} ({counter})"),
    };

    let test_path = path.parent().unwrap().join(test_name);
    let test_sys_path = get_sys_path(app.clone(), &test_path)?;

    if !test_sys_path.exists() {
      return Ok(test_path);
    }
    counter += 1;
  }
}

pub fn get_sys_path(app: AppHandle, path: &Path) -> Result<PathBuf, Error> {
  let app_data_path = app.path().app_data_dir()?;
  Ok(app_data_path.join(path))
}
