use std::fs::{self};
use std::path::{MAIN_SEPARATOR, PathBuf};
use tauri::{AppHandle, Manager};

use crate::data_handling::types::{Document, FsDocument};
use crate::error_handling::command_errors::Error;
use crate::filesystem::utils::{get_sys_path};

#[tauri::command]
pub fn read_document(app: AppHandle, path: PathBuf) -> Result<FsDocument, Error> {
  let metadata_path = path.join("meta.json");
  let metadata_sys_path = get_sys_path(app, &metadata_path)?;

  println!("reading document: {:?}", metadata_path);
  let json = fs::read_to_string(&metadata_sys_path)?;
  let document: Document = serde_json::from_str(&json)?;
  let filename: std::ffi::OsString = path
    .file_name()
    .ok_or(Error::from("Reading illegal file"))?
    .to_os_string();
  Ok(FsDocument::new(document, filename))
}

// TODO: add checks for illegal os characters
// TODO: sanatize user generated names in Rust and TS
#[tauri::command]
pub fn read_dir(app: AppHandle, path: PathBuf) -> Result<Vec<FsDocument>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(path);

  println!("reading dir: {:?}", sys_path);

  let files = fs::read_dir(sys_path)?;
  let mut file_data: Vec<FsDocument> = Vec::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      file_data.push(read_document(app.clone(), file.path())?);
    }
  }

  Ok(file_data)
}

#[tauri::command]
pub fn rename_file(app: AppHandle, old_path: PathBuf, new_name: &str) -> Result<PathBuf, Error> {
  let parent_path = old_path.parent().unwrap();
  let new_path = parent_path.join(new_name);

  let old_sys_path = get_sys_path(app.clone(), &old_path)?;
  let new_sys_path = get_sys_path(app.clone(), &new_path)?;

  fs::rename(&old_sys_path, &new_sys_path)?;

  Ok(new_path)
}

#[tauri::command]
pub fn delete_file(app: AppHandle, path: PathBuf) -> Result<(), Error> {
  let sys_path = get_sys_path(app, &path)?;
  //TODO: Move to trash instead of full delete
  fs::remove_dir_all(sys_path)?;
  Ok(())
}

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