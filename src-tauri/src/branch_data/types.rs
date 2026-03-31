use std::ffi::OsString;

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;

use crate::table_data::views::BranchViewData;

//helper function fro serialization
fn osstring_to_string<S>(os: &OsString, s: S) -> Result<S::Ok, S::Error>
where S: serde::Serializer, { s.serialize_str(&os.to_string_lossy()) }

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
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
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct Branch {
  #[ts(type = "string")]
  id: Ulid,
  color: Option<String>,
  has_children: bool,
  child_view_data: Vec<BranchViewData>
}

impl Branch {
  pub fn new_branch() -> Branch {
    Branch {
      id: Ulid::new(),
      color: None,
      has_children: false,
      child_view_data: vec![]
    }
  }

  pub fn set_color<S: Into<String>>(mut self, color: S) -> Self {
    self.color = Some(color.into());
    self
  }

  pub fn get_id(self) -> Ulid {
    self.id
  }
  pub fn get_color(self) -> Option<String> {
    self.color
  }
}
