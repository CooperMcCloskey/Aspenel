use std::{
  collections::HashMap,
  fs,
  path::{Path, PathBuf},
};

use tauri::{AppHandle, Manager};

use crate::{
  data::branches::{
    impls::{Loadable, Writeable},
    types::{Branch, LoadedBranch, LoadedRootBranch, RootBranch, RootFields},
  },
  error_handling::command_errors::Error,
  filesystem::{path_utils::get_sys_path, read::read_file, write::create_dir},
  utils::types::Id,
};

#[tauri::command]
pub fn load_branch(app: AppHandle, path: PathBuf) -> Result<LoadedBranch, Error> {
  let branch = read_file::<Branch>(app.clone(), &path)?;
  branch.load(app, &path)
}

#[tauri::command]
pub fn load_root_branch(app: AppHandle, path: PathBuf) -> Result<LoadedRootBranch, Error> {
  let branch = read_file::<Branch>(app.clone(), &path)?;
  let root_data = read_file::<RootFields>(app.clone(), &path)?;
  let root_branch = RootBranch { branch, root_data };
  root_branch.load(app, &path)
}

#[tauri::command]
pub fn load_dir(app: AppHandle, dir_path: PathBuf) -> Result<HashMap<Id, LoadedBranch>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(dir_path);

  println!("reading dir: {:?}", sys_path);

  let files = fs::read_dir(sys_path)?;
  let mut result: HashMap<Id, LoadedBranch> = HashMap::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      let path = file.path();
      let branch = read_file::<Branch>(app.clone(), &path)?;
      let lb = branch.load(app.clone(), &path)?;
      result.insert(lb.branch.id, lb);
    }
  }

  Ok(result)
}

#[tauri::command]
pub fn create_branch(app: AppHandle, path: &Path) -> Result<LoadedBranch, Error> {
  let branch = Branch::new();
  create_dir(app.clone(), path.to_path_buf(), false)?;
  branch.write(app.clone(), path)?;
  branch.load(app, path)
}

#[tauri::command]
pub fn create_root_branch(app: AppHandle, path: &Path) -> Result<LoadedRootBranch, Error> {
  let root_branch = RootBranch::new();
  create_dir(app.clone(), path.to_path_buf(), false)?;
  root_branch.write(app.clone(), path)?;
  root_branch.load(app, path)
}

#[tauri::command]
pub fn create_home_branch(app: AppHandle) -> Result<(), Error> {
  let home_branch = RootBranch::new_home_branch();
  create_dir(app.clone(), "Home".into(), true)?;
  home_branch.write(app, Path::new("Home"))
}

#[tauri::command]
pub fn rename_file(app: AppHandle, old_path: PathBuf, new_name: &str) -> Result<(), Error> {
  let parent_path = old_path.parent().unwrap();
  let new_path = parent_path.join(new_name);

  let old_sys_path = get_sys_path(app.clone(), &old_path)?;
  let new_sys_path = get_sys_path(app.clone(), &new_path)?;

  fs::rename(&old_sys_path, &new_sys_path)?;
  Ok(())
}

#[tauri::command]
pub fn delete_file(app: AppHandle, path: PathBuf) -> Result<(), Error> {
  let sys_path = get_sys_path(app, &path)?;
  //TODO: Move to trash instead of full delete
  fs::remove_dir_all(sys_path)?;
  Ok(())
}
