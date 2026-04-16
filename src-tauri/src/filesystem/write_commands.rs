use std::path::PathBuf;

use tauri::AppHandle;

use crate::error_handling::command_errors::Error;

use crate::data::branch_data::views::{BranchViewData, IconViewData};
use crate::{data::branches::types::{Branch, FsBranch}, filesystem::utils::write_branch};

#[tauri::command]
pub fn create_home_branch(app: AppHandle) -> Result<FsBranch, Error> {
  let default_view = BranchViewData::Icon(IconViewData::new_icon_view("Icon View"));

  let branch =
    Branch::new_branch()
      .set_color("var(--red)")
      .add_child_view(default_view);
    
  let fs_branch = write_branch(app, &PathBuf::from(""), "Home", branch)?;
  Ok(fs_branch)
}

#[tauri::command]
pub fn create_branch(app: AppHandle, path: std::path::PathBuf) -> Result<FsBranch, Error> {
  let branch = Branch::new_branch();
  let fs_branch = write_branch(app, &path, "New Branch", branch)?;
  Ok(fs_branch)
}

