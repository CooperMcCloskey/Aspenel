use std::fs::{self};
use std::io::Write;
use std::path::{PathBuf};
use tauri::{AppHandle, Manager};

use crate::error_handling::command_errors::Error;
use crate::filesystem::types::{CategoryData, Filedata, ProjectData};
use crate::filesystem::utils::{create_dir, create_file, get_sys_path, write_file};

#[tauri::command]
pub fn create_category(app: AppHandle, path: PathBuf) -> Result<Filedata, Error> {
  println!("{path:?}");
  let (name, path) = create_dir(app.clone(), &path, "New Category")?;
  let (file, _) = create_file(app, &path, "meta.json")?;

  let data = Filedata::Category(CategoryData::new(&name));
  write_file(file, &data)?;
  return Ok(data);
}

#[tauri::command]
pub fn create_project(app: AppHandle, path: PathBuf) -> Result<Filedata, Error> {
  let (name, path) = create_dir(app.clone(), &path, "New Project")?;
  let (file, _path) = create_file(app, &path, "meta.json")?;

  let data = Filedata::Project(ProjectData::new(&name));
  write_file(file, &data)?;
  return Ok(data);
}

#[tauri::command]
pub fn read_file(app: AppHandle, path: PathBuf) -> Result<Filedata, Error> {
  let sys_path = get_sys_path(app, &path)?;
  println!("{sys_path:?}");
  let json = fs::read_to_string(sys_path)?;
  let file: Filedata = serde_json::from_str(&json)?;

  return Ok(file);
}

// TODO: add checks for illegal os characters
// TODO: sanatize user generated names in Rust and TS
#[tauri::command]
pub fn read_dir(app: AppHandle, path: PathBuf) -> Result<Vec<Filedata>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(path);

  let files = fs::read_dir(sys_path)?;
  let mut file_data: Vec<Filedata> = Vec::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      file_data.push(read_file(app.clone(), file.path().join("meta.json"))?);
    }
  }

  return Ok(file_data);
}

#[tauri::command]
pub fn rename_file(app: AppHandle, old_path: PathBuf, new_name: &str) -> Result<PathBuf, Error>{
  let parent_path = old_path.parent().unwrap();
  let new_path = parent_path.join(new_name);
  let metadata_path = old_path.join("meta.json");

  let old_sys_path = get_sys_path(app.clone(), &old_path)?;
  let new_sys_path = get_sys_path(app.clone(), &new_path)?;
  let metadata_sys_path = get_sys_path(app.clone(), &metadata_path)?;
  
  let mut filedata = read_file(app, metadata_path.clone())?;
  filedata.rename(new_name);
  let json = serde_json::to_vec(&filedata)?;
  fs::write(metadata_sys_path, json)?;

  fs::rename(&old_sys_path, &new_sys_path)?;
    
  Ok(new_path)
}