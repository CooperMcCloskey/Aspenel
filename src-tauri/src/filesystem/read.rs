use std::fs::{self};
use std::path::{PathBuf};
use tauri::{AppHandle, Manager};

use crate::data::branches::types::{Branch, FsBranch};
use crate::error_handling::command_errors::Error;
use crate::filesystem::path_utils::get_sys_path;

#[tauri::command]
pub fn read_branch(app: AppHandle, path: PathBuf) -> Result<FsBranch, Error> {
  let metadata_path = path.join("metadata.json");
  let metadata_sys_path = get_sys_path(app, &metadata_path)?;

  let json = fs::read_to_string(&metadata_sys_path)?;
  let branch: Branch = serde_json::from_str(&json)?;
  let filename: std::ffi::OsString = path
    .file_name()
    .ok_or(Error::from("Reading illegal file"))?
    .to_os_string();
  Ok(FsBranch::new(branch, filename))
}

// TODO: add checks for illegal os characters
// TODO: sanatize user generated names in Rust and TS
#[tauri::command]
pub fn read_dir(app: AppHandle, path: PathBuf) -> Result<Vec<FsBranch>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(path);

  println!("reading dir: {:?}", sys_path);

  let files = fs::read_dir(sys_path)?;
  let mut file_data: Vec<FsBranch> = Vec::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      file_data.push(read_branch(app.clone(), file.path())?);
    }
  }

  Ok(file_data)
}

#[tauri::command]
pub fn delete_file(app: AppHandle, path: PathBuf) -> Result<(), Error> {
  let sys_path = get_sys_path(app, &path)?;
  //TODO: Move to trash instead of full delete
  fs::remove_dir_all(sys_path)?;
  Ok(())
}

