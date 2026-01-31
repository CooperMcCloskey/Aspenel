use std::fs;
use tauri::{AppHandle, Manager};
use std::io::prelude::*;

use crate::filesystem::types::File;
use crate::error_handling::command_errors::Error;

#[tauri::command]
pub fn create_file(app: AppHandle, relative_path: &str, content: File) -> Result<(), Error>{
    let base_path = app.path().app_data_dir()?;
    let path = base_path.join(relative_path);
    let json = serde_json::to_string_pretty(&content)?;


    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut file = fs::File::create(path)?;
    file.write_all(json.as_bytes())?;
    Ok(())
}

#[tauri::command]
pub fn read_file(app: AppHandle, relative_path: &str) -> Result<(), Error>{
    let base_path = app.path().app_data_dir()?;
    let path = base_path.join(relative_path);

    let raw_json = fs::read_to_string(path)?;
    let file: File = serde_json::from_str(&raw_json)?;

    println!("{:#?}", file);
    Ok(())
}
