use std::{
  ffi::OsString,
  fs::{self, File},
  io::Write,
  path::PathBuf,
};

use serde::Serialize;
use tauri::{AppHandle, Manager};

use crate::{
  branch_data::types::{Branch, FsBranch},
  error_handling::command_errors::Error,
};

pub fn get_sys_path(app: AppHandle, path: &PathBuf) -> Result<PathBuf, Error> {
  let app_data_path = app.path().app_data_dir()?;
  Ok(app_data_path.join(&path))
}

pub fn write_branch(
  app: AppHandle,
  path: &PathBuf,
  name: &str,
  branch: Branch,
) -> Result<FsBranch, Error> {
  let (filename, path) = create_dir(app.clone(), path, name)?;
  let file = create_metadata_file(app, &path)?;
  write_file(file, &branch)?;
  Ok(FsBranch::new(branch, filename))
}

fn create_dir(app: AppHandle, path: &PathBuf, name: &str) -> Result<(OsString, PathBuf), Error> {
  let sys_path = get_sys_path(app.clone(), path)?;

  let filename = unique_path_name(&sys_path, name);
  let path = path.join(&filename);

  fs::create_dir_all(sys_path.join(&filename))?;

  Ok((filename, path))
}

fn create_metadata_file(app: AppHandle, path: &PathBuf) -> Result<File, Error> {
  let sys_path = get_sys_path(app, path)?;
  let file = fs::File::create(sys_path.join("meta.json"))?;
  return Ok(file);
}

pub fn write_file<T: Serialize>(mut file: File, data: &T) -> Result<(), Error> {
  let json = serde_json::to_vec(data)?;
  file.write_all(&json)?;
  Ok(())
}

fn unique_path_name(parent_path: &PathBuf, name: &str) -> OsString {
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
