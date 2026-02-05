use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use std::io::prelude::*;

use crate::filesystem::types::FileData;
use crate::error_handling::command_errors::Error;

#[tauri::command]
pub fn create_file(app: AppHandle, path: PathBuf, file_type: &str) -> Result<(), Error>{
    let file_data = FileData::new(file_type, &path);

    let base_path = app.path().app_data_dir()?;
    let path = base_path.join(path);

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut file = fs::File::create(path)?;
    let json = serde_json::to_vec(&file_data)?;
    file.write_all(&json)?;
    Ok(())
}

#[tauri::command]
pub fn read_file(app: AppHandle, path: PathBuf) -> Result<FileData, Error>{
    let base_path = app.path().app_data_dir()?;
    let path = base_path.join(path);

    let json = fs::read_to_string(path)?;
    let file: FileData = serde_json::from_str(&json)?;

    return Ok(file);
}

#[tauri::command]
pub fn read_dir(app: AppHandle, path: PathBuf) -> Result<Vec<FileData>, Error>{
    let base_path = app.path().app_data_dir()?;
    let path = base_path.join(path);

    let files = fs::read_dir(path)?;
    let mut file_data: Vec<FileData> = Vec::new();

    for file in files{
        let file = file?;
        if file.file_type()?.is_dir() {
            file_data.push(read_file(app.clone(), file.path().join("meta.json"))?);
        }
    }

    return Ok(file_data);
}