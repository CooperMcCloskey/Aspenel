use std::{
  collections::HashMap, fs, path::{Path, PathBuf},
};

use tauri::{AppHandle, Manager};

use crate::{
  data::branches::{
    impls::{Loadable, Writeable}, types::{Branch, LoadedBranch, LoadedBranchVariant, LoadedRootBranch, RootBranch},
  }, error_handling::command_errors::Error, filesystem::{path_utils::get_sys_path, write::create_dir}, utils::types::Id,
};

#[tauri::command]
#[specta::specta]
pub fn load_branch(app: AppHandle, path: PathBuf) -> Result<LoadedBranch, Error> {
  let branch = Branch::read(app.clone(), &path)?;
  branch.load(app, &path)
}

#[tauri::command]
#[specta::specta]
pub fn load_root_branch(app: AppHandle, path: PathBuf) -> Result<LoadedBranchVariant, Error> {
  let branch = RootBranch::read(app.clone(), &path)?;
  branch.load(app, &path)
}

#[tauri::command]
#[specta::specta]
pub fn write_branch(app: AppHandle, data: LoadedBranchVariant, path: PathBuf) -> Result<(), Error>{
  data.write(app, &path)
}

#[tauri::command]
#[specta::specta]
pub fn load_dir(app: AppHandle, dir_path: PathBuf) -> Result<HashMap<Id, LoadedBranch>, Error> {
  let app_data_path = app.path().app_data_dir()?;
  let sys_path = app_data_path.join(&dir_path);

  println!("reading dir: {:?}", sys_path);

  let files = fs::read_dir(sys_path)?;
  let mut result: HashMap<Id, LoadedBranch> = HashMap::new();

  for file in files {
    let file = file?;
    if file.file_type()?.is_dir() {
      let name = file.file_name();
      let path = &dir_path.join(name);
      let branch = Branch::read(app.clone(), &path)?;
      let lb = branch.load(app.clone(), &path)?;
      result.insert(lb.branch.id, lb);
    }
  }

  Ok(result)
}

#[tauri::command]
#[specta::specta]
pub fn create_branch(app: AppHandle, path: &Path) -> Result<LoadedBranch, Error> {
  let branch = Branch::new();
  let unique_path = create_dir(app.clone(), path.to_path_buf(), false)?;
  branch.write(app.clone(), &unique_path)?;
  branch.load(app, &unique_path)
}

#[tauri::command]
#[specta::specta]
pub fn create_root_branch(app: AppHandle, path: &Path) -> Result<LoadedRootBranch, Error> {
  let root_branch = RootBranch::new();
  create_dir(app.clone(), path.to_path_buf(), false)?;
  root_branch.write(app.clone(), path)?;
  root_branch.load(app, path)
}

#[tauri::command]
#[specta::specta]
pub fn create_home_branch(app: AppHandle) -> Result<(), Error> {
  let home_branch = RootBranch::new_home_branch();
  create_dir(app.clone(), "Home".into(), true)?;
  home_branch.write(app, Path::new("Home"))
}

#[tauri::command]
#[specta::specta]
pub fn rename_file(app: AppHandle, old_path: PathBuf, new_name: &str) -> Result<(), Error> {
  let parent_path = old_path.parent().unwrap();
  let new_path = parent_path.join(new_name);

  let old_sys_path = get_sys_path(app.clone(), &old_path)?;
  let new_sys_path = get_sys_path(app.clone(), &new_path)?;

  fs::rename(&old_sys_path, &new_sys_path)?;
  Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn delete_file(app: AppHandle, path: PathBuf) -> Result<(), Error> {
  let sys_path = get_sys_path(app, &path)?;
  //TODO: Move to trash instead of full delete
  fs::remove_dir_all(sys_path)?;
  Ok(())
}
