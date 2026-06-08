use std::fs::{self};
use std::path::{PathBuf};
use tauri::{AppHandle, Manager};

use crate::data::branches::types::{Branch, LoadedBranch};
use crate::error_handling::command_errors::Error;
use crate::filesystem::path_utils::get_sys_path;

#[tauri::command]
pub fn read_branch(app: AppHandle, path: PathBuf) -> Result<Branch, Error> {
  let metadata_path = path.join("metadata.json");
  let metadata_sys_path = get_sys_path(app.clone(), &metadata_path)?;

  let json = fs::read_to_string(&metadata_sys_path)?;
  let branch: Branch = serde_json::from_str(&json)?;

  Ok(branch)
}

#[tauri::command]
pub fn load_branch(app: AppHandle, path: PathBuf) -> Result<LoadedBranch, Error> {
  let branch = read_branch(app.clone(), path.clone())?;
  let filename: std::ffi::OsString = path
    .file_name()
    .ok_or(Error::from("Reading illegal file"))?
    .to_os_string();
  Ok(LoadedBranch::new(app, branch, filename, path)?)
}

// TODO: See if you can simplify the common behavior of read and load dir
#[tauri::command]
pub fn read_dir(app: AppHandle, path: PathBuf) -> Result<Vec<Branch>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(path);

  println!("reading dir: {:?}", sys_path);

  let files = fs::read_dir(sys_path)?;
  let mut file_data: Vec<Branch> = Vec::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      file_data.push(read_branch(app.clone(), file.path())?);
    }
  }

  Ok(file_data)
}

// TODO: add checks for illegal os characters
// TODO: sanatize user generated names in Rust and TS
#[tauri::command]
pub fn load_dir(app: AppHandle, path: PathBuf) -> Result<Vec<LoadedBranch>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(&path);

  println!("reading dir: {:?}", sys_path);

  let files = fs::read_dir(sys_path)?;
  let mut file_data: Vec<LoadedBranch> = Vec::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      let filename = file.file_name();
      let path = path.join(filename);
      file_data.push(load_branch(app.clone(), path)?);
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

