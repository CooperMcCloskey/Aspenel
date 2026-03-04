use std::fs::{self};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

use crate::data_handling::types::{Document, FsDocument};
use crate::error_handling::command_errors::Error;
use crate::filesystem::utils::{get_sys_path, write_document};

#[tauri::command]
pub fn create_home_branch(app: AppHandle) -> Result<FsDocument, Error> {
  let branch = Document::new_branch();
  let branch = branch.set_color("var(--red)");
  let fs_document = write_document(app, &PathBuf::from(""), "Home", branch)?;
  Ok(fs_document)
}

#[tauri::command]
pub fn create_branch(app: AppHandle, path: PathBuf) -> Result<FsDocument, Error> {
  let branch = Document::new_branch();
  let fs_document = write_document(app, &path, "New Branch", branch)?;
  Ok(fs_document)
}

#[tauri::command]
pub fn create_leaf(app: AppHandle, path: PathBuf) -> Result<FsDocument, Error> {
  let leaf = Document::new_leaf();
  let fs_document = write_document(app, &path, "New Leaf", leaf)?;
  Ok(fs_document)
}

#[tauri::command]
pub fn read_document(app: AppHandle, path: PathBuf) -> Result<FsDocument, Error> {
  let metadata_path = path.join("meta.json");
  let metadata_sys_path = get_sys_path(app, &metadata_path)?;

  println!("{:?}", metadata_sys_path);
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
  println!("${sys_path:?}");
  //TODO: Move to trash instead of full delete
  fs::remove_dir_all(sys_path)?;
  Ok(())
}
