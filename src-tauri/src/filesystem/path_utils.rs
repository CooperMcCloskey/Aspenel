use std::{ffi::OsString, path::{MAIN_SEPARATOR, Path, PathBuf}};

use tauri::{AppHandle, Manager};

use crate::error_handling::command_errors::Error;

#[tauri::command]
pub fn join_path(base: PathBuf, part: PathBuf) -> PathBuf{
  base.join(part)
}

#[tauri::command]
pub fn get_path_components(path: PathBuf) -> Vec<String>{
  path.components()
    .map(|c| c.as_os_str().to_string_lossy().into_owned())
    .collect()
}

#[tauri::command]
pub fn get_path_separator() -> char{
  return MAIN_SEPARATOR
}

pub fn unique_path_name(parent_path: &PathBuf, name: &str) -> OsString {
  let path = parent_path.join(name);
  if !path.exists() {
    return OsString::from(name);
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
      return OsString::from(test_name);
    }
    counter += 1;
  }
}

pub fn get_sys_path(app: AppHandle, path: &Path) -> Result<PathBuf, Error> {
  let app_data_path = app.path().app_data_dir()?;
  Ok(app_data_path.join(&path))
}