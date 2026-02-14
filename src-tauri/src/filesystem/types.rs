use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
#[serde(tag = "type")]
pub enum Filedata {
  Category(CategoryData),
  Project(ProjectData),
}
impl Filedata {
  pub fn rename(&mut self, name: &str){
    match self {
      Filedata::Category(f) => f.file.rename(name),
      Filedata::Project(f) => f.file.rename(name),
    }
  }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
pub struct FileBase {
  #[ts(type = "string")]
  id: Ulid,
  name: String,
}
impl FileBase {
  pub fn new(name: &str) -> FileBase {
    FileBase {
      id: Ulid::new(),
      name: name.to_string(),
    }
  }
  pub fn rename(&mut self, name: &str){
    self.name = name.to_string();
  }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
pub struct CategoryData {
  file: FileBase,
  color: String
}

impl CategoryData {
  pub fn new(name: &str) -> CategoryData {
    CategoryData {
      file: FileBase::new(name),
      color: "var(--red)".to_string()
    }
  }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
pub struct ProjectData {
  file: FileBase,
}

impl ProjectData {
  pub fn new(name: &str) -> ProjectData {
    ProjectData {
      file: FileBase::new(name),
    }
  }
}
