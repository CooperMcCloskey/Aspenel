use std::ffi::OsString;

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;

fn osstring_to_string<S>(os: &OsString, s: S) -> Result<S::Ok, S::Error> where S: serde::Serializer {
    s.serialize_str(&os.to_string_lossy())
}
#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
pub struct FsDocument {
  document: Document,
  #[ts(type = "string")] 
  #[serde(serialize_with = "osstring_to_string")]
  pub filename: OsString
}
 
impl FsDocument {
  pub fn new(document: Document, filename: OsString) -> FsDocument{
    FsDocument { document, filename }
  }

  pub fn get_filename(self) -> OsString{
    self.filename
  }
  pub fn get_document(self) -> Document{
    self.document
  }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
//Either a branch or a leaf
pub struct Document {
  #[ts(type = "string")] id: Ulid,
  color: Option<String>,
  has_children: bool,
}
impl Document {
  fn new_document(has_children: bool) -> Document{
    Document { id: Ulid::new(), color: None, has_children }
  }

  pub fn new_leaf() -> Document{
    Document::new_document(false)
  }
  pub fn new_branch() -> Document{
    Document::new_document(true)
  }
  
  pub fn set_color<S: Into<String>>(mut self, color: S) ->  Self{
    self.color = Some(color.into());
    self
  }
  pub fn to_branch(mut self) -> Self{
    self.has_children = true;
    self
  }
  pub fn to_leaf(mut self) -> Self{
    //TODO: Ensure children do not exist.
    self.has_children = false;
    self
  }

  pub fn get_id(self) -> Ulid{
    self.id
  }
  pub fn get_color(self) -> Option<String>{
    self.color
  }
}


