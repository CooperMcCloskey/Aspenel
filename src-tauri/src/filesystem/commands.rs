use std::fs::{self};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

use crate::error_handling::command_errors::Error;
use crate::filesystem::types::{CategoryData, FileData, ProjectData};
use crate::filesystem::utils::{create_dir, create_file, write_file};

#[tauri::command]
pub fn create_category(app: AppHandle, path: PathBuf) -> Result<FileData, Error> {
  let (name, path) = create_dir(app.clone(), &path, "New Category")?;
  let (file, _) = create_file(app, &path, "meta.json")?;

  let data = FileData::Category(CategoryData::new(&name, path));
  write_file(file, &data)?;
  return Ok(data);
}

#[tauri::command]
pub fn create_project(app: AppHandle, path: PathBuf) -> Result<FileData, Error> {
  let (name, path) = create_dir(app.clone(), &path, "New Project")?;
  let (file, _) = create_file(app, &path, "meta.json")?;

  let data = FileData::Project(ProjectData::new(&name, path));
  write_file(file, &data)?;
  return Ok(data);
}

#[tauri::command]
pub fn read_file(app: AppHandle, path: PathBuf) -> Result<FileData, Error> {
  let base_path = app.path().app_data_dir()?;
  let path = base_path.join(path);
  println!("{path:?}");
  let json = fs::read_to_string(path)?;
  let file: FileData = serde_json::from_str(&json)?;

  return Ok(file);
}

#[tauri::command]
pub fn read_dir(app: AppHandle, path: PathBuf) -> Result<Vec<FileData>, Error> {
  let base_path = app.path().app_data_dir()?;
  let path = base_path.join(path);

  let files = fs::read_dir(path)?;
  let mut file_data: Vec<FileData> = Vec::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      file_data.push(read_file(app.clone(), file.path().join("meta.json"))?);
    }
  }

  return Ok(file_data);
}
