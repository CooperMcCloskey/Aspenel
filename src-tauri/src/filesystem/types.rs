use ulid::Ulid;
use serde::{Serialize, Deserialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../src/lib/types/rustTypes.ts")]
pub struct File{
  #[ts(type = "string")]
  id: Ulid,
  name: String,
  color: String,
}