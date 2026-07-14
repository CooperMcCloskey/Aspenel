use std::{collections::HashMap, ffi::OsString, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use ts_rs::TS;

use crate::{
  data::{
    branches::{
      commands::find_color,
      utils::serialize_os_string,
    },
    properties::{schemas::PropertySchema, values::PropertyValue},
    views::types::ChildView,
  },
  error_handling::command_errors::Error,
  utils::types::Id,
};


#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Branch {
  #[ts(type = "string")]
  id: Id,
  color: Option<String>, //If unset, it will inherit from a parent
  child_views: HashMap<Id, ChildView>,
  properties: HashMap<Id, PropertySchema>,
  property_values: HashMap<Id, PropertyValue>,
}

impl Branch {
  pub fn new_branch() -> Branch {
    Branch {
      id: Id::new(),
      color: None,
      child_views: HashMap::new(),
      property_values: HashMap::new(),
      properties: HashMap::new(),
    }
  }

  pub fn set_color<S: Into<String>>(mut self, color: S) -> Self {
    self.color = Some(color.into());
    self
  }

  pub fn add_child_view(mut self, view: ChildView) -> Self {
    self.child_views.insert(view.get_id(), view);
    self
  }

  pub fn get_id(self) -> Id {
    self.id
  }
  pub fn get_color(self) -> Option<String> {
    self.color
  }
}


#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct LoadedBranch {
  filedata: Branch,
  #[ts(type = "string")]
  #[serde(serialize_with = "serialize_os_string")]
  filename: OsString,
  path: PathBuf,
  color: String, //Branch also contains a color but it is optional
}

impl LoadedBranch {
  pub fn new(
    app: AppHandle,
    branch: Branch,
    filename: OsString,
    path: PathBuf,
  ) -> Result<LoadedBranch, Error> {
    println!("{path:?}");
    let color = branch
      .color
      .clone()
      .unwrap_or(find_color(app, path.clone())?);
    Ok(LoadedBranch {
      filedata: branch,
      filename,
      path,
      color,
    })
  }

  pub fn get_filename(&self) -> &OsString {
    &self.filename
  }
  pub fn get_branch(self) -> Branch {
    self.filedata
  }
}

