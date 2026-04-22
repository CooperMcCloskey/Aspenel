use std::ffi::OsString;
use std::fs::{self, File};
use std::path::{Path, PathBuf};
use std::io::Write;

use serde::Serialize;
use tauri::{AppHandle};

use crate::error_handling::command_errors::Error;

use crate::data::branch_data::views::{BranchViewData, IconViewData};
use crate::filesystem::path_utils::{get_sys_path, join_path, unique_path_name};
use crate::{data::branches::types::{Branch, FsBranch}};

#[tauri::command]
pub fn create_home_branch(app: AppHandle) -> Result<(), Error> {
  let default_view = BranchViewData::Icon(IconViewData::new_icon_view("Icon View"));

  let branch =
    Branch::new_branch()
      .set_color("var(--red)")
      .add_child_view(default_view);
  
  create_dir(app.clone(), Path::new(""), "Home", true)?;
  write_branch(app, &PathBuf::from("Home"), branch)
}

#[tauri::command]
pub fn create_branch(app: AppHandle, path: PathBuf) -> Result<FsBranch, Error> {
  let branch = Branch::new_branch();
  let fs_branch = write_new_branch(app, &path, "New Branch", branch)?;
  Ok(fs_branch)
}

#[tauri::command]
pub fn save_branch(app: AppHandle, branch: Branch, path: &Path) -> Result<(), Error> {
  write_branch(app, path, branch)?;
  Ok(())
}

fn create_dir(app: AppHandle, path: &Path, name: &str, strict_name: bool) -> Result<(OsString, PathBuf), Error> {
  let sys_path = get_sys_path(app.clone(), path)?;

  let filename = if strict_name { join_path(sys_path.clone(), name.into()).into_os_string() } else { unique_path_name(&sys_path, name) };
  let path = path.join(&filename);

  fs::create_dir_all(sys_path.join(&filename))?;

  Ok((filename, path))
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

pub fn write_new_branch(
  app: AppHandle,
  path: &PathBuf,
  name: &str,
  branch: Branch,
) -> Result<FsBranch, Error> {
  let (filename, path) = create_dir(app.clone(), path, name, false)?;
  let file = create_metadata_file(app, &path)?;
  write_file(file, &branch)?;
  Ok(FsBranch::new(branch, filename))
}

pub fn write_branch(
  app: AppHandle,
  path: &Path,
  branch: Branch,
) -> Result<(), Error>{
  let temp_path = join_path(get_sys_path(app.clone(), path)?, "temp.json".into());

  let json = serde_json::to_vec(&branch)?;

  let mut file = File::create(&temp_path)?;
  file.write_all(&json)?;
  file.sync_all()?;

  rename_file(app, temp_path, "metadata.json")?;
  Ok(())
}

fn create_metadata_file(app: AppHandle, path: &PathBuf) -> Result<File, Error> {
  let sys_path = get_sys_path(app, path)?;
  let file = fs::File::create(sys_path.join("metadata.json"))?;
  return Ok(file);
}


fn write_file<T: Serialize>(mut file: File, data: &T) -> Result<(), Error> {
  let json = serde_json::to_vec(data)?;
  file.write_all(&json)?;
  Ok(())
}