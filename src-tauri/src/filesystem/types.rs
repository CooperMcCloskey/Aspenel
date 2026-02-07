use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
#[serde(tag = "type")]
pub enum FileData {
  Category(CategoryData),
  Project(ProjectData),
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
pub struct FileBase {
  #[ts(type = "string")]
  id: Ulid,
  name: String,
  path: PathBuf,
}

impl FileBase {
  pub fn new(name: &str, path: PathBuf) -> FileBase {
    FileBase {
      id: Ulid::new(),
      path: path,
      name: name.to_string(),
    }
  }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes/")]
pub struct CategoryData {
  file: FileBase,
  color: String
}

impl CategoryData {
  pub fn new(name: &str, path: PathBuf) -> CategoryData {
    CategoryData {
      file: FileBase::new(name, path),
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
  pub fn new(name: &str, path: PathBuf) -> ProjectData {
    ProjectData {
      file: FileBase::new(name, path),
    }
  }
}
