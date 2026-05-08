use std::{collections::HashMap, ffi::OsString, path::{PathBuf}};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle};
use ts_rs::TS;

use crate::{data::{branch_data::{properties::{Property, PropertyValue}, views::BranchView}, branches::commands::{check_color, find_color}}, error_handling::command_errors::Error, utils::types::Id};

//helper function fro serialization
fn osstring_to_string<S>(os: &OsString, s: S) -> Result<S::Ok, S::Error>
where S: serde::Serializer, { s.serialize_str(&os.to_string_lossy()) }

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
//TODO: Make this also return path to simplify some frontend logic.
pub struct LoadedBranch {
  branch: Branch,
  #[ts(type = "string")]
  #[serde(serialize_with = "osstring_to_string")]
  filename: OsString, //TODO: add back pub if this breaks
  path: PathBuf,
  color: String, //Branch also contains a color but it is optional
}

impl LoadedBranch {
  pub fn new(app: AppHandle, branch: Branch, filename: OsString, path: PathBuf) -> Result<LoadedBranch, Error> {
    println!("{path:?}");
    let color = branch.color.clone().unwrap_or(find_color(app, path.clone())?);
    Ok(LoadedBranch { branch, filename, path, color })
  }

  pub fn get_filename(&self) -> &OsString {
    &self.filename
  }
  pub fn get_branch(self) -> Branch {
    self.branch
  }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Branch {
  #[ts(type = "string")]
  id: Id,
  color: Option<String>, //If unset, it will inherit from a parent
  child_view_data: Vec<BranchView>,
  property_values: HashMap<Id, PropertyValue>,
  child_properties: Vec<Property>
}

impl Branch {
  pub fn new_branch() -> Branch {
    Branch {
      id: Id::new(),
      color: None,
      child_view_data: vec![],
      property_values: HashMap::new(),
      child_properties: vec![]
    }
  }

  pub fn set_color<S: Into<String>>(mut self, color: S) -> Self {
    self.color = Some(color.into());
    self
  }

  pub fn add_child_view(mut self, view: BranchView) -> Self {
    self.child_view_data.push(view);
    self
  }

  pub fn get_id(self) -> Id {
    self.id
  }
  pub fn get_color(self) -> Option<String> {
    self.color
  }
}
