use std::ffi::OsString;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{data::branch_data::{properties::{Property, PropertyValue}, views::BranchViewData}, utils::types::Id};

//helper function fro serialization
fn osstring_to_string<S>(os: &OsString, s: S) -> Result<S::Ok, S::Error>
where S: serde::Serializer, { s.serialize_str(&os.to_string_lossy()) }

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/branches")]
pub struct FsBranch {
  branch: Branch,
  #[ts(type = "string")]
  #[serde(serialize_with = "osstring_to_string")]
  pub filename: OsString,
}

impl FsBranch {
  pub fn new(branch: Branch, filename: OsString) -> FsBranch {
    FsBranch { branch: branch, filename }
  }

  pub fn get_filename(self) -> OsString {
    self.filename
  }
  pub fn get_branch(self) -> Branch {
    self.branch
  }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/branches")]
pub struct Branch {
  #[ts(type = "string")]
  id: Id,
  color: Option<String>,
  child_view_data: Vec<BranchViewData>,
  property_values: Vec<PropertyValue>,
  child_properties: Vec<Property>
}

impl Branch {
  pub fn new_branch() -> Branch {
    Branch {
      id: Id::new(),
      color: None,
      child_view_data: vec![],
      property_values: vec![],
      child_properties: vec![]
    }
  }

  pub fn set_color<S: Into<String>>(mut self, color: S) -> Self {
    self.color = Some(color.into());
    self
  }

  pub fn add_child_view(mut self, view: BranchViewData) -> Self {
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
