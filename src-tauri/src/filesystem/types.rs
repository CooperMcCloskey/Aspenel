use std::{path::PathBuf};

use ulid::Ulid;
use serde::{Serialize, Deserialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes.ts")]
pub struct FileData{
  #[ts(type = "string")]
  id: Ulid,
  name: String,
  path: PathBuf,
}

impl FileData{
  pub fn new(file_type: &str, path: &PathBuf) -> FileData{
    let name = format!("New {}", file_type);
    FileData {
      id: Ulid::new(),
      path: path.join(&name),
      name: name
    }
  }
}

#[derive(Debug, Serialize, Deserialize, TS, Clone)]
#[ts(export, export_to = "../src/lib/types/rustTypes.ts")]
pub struct CategoryData{
  base: FileData,
  color: String,
}

impl CategoryData{
  pub fn new(file_type: &str, path: &PathBuf) -> CategoryData{
    CategoryData {
      base: FileData::new(&file_type, &path),
      color: "var(--Red)".to_string()
    }
  }
}