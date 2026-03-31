use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use ts_rs::TS;
use ulid::Ulid;

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct SelectOption{
  #[ts(type = "string")]
  color: String,
  category: Option<i32>
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct MultiSelect{
  options: Vec<SelectOption>,
  #[ts(type = "string")]
  selected: Vec<Ulid>
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct Select{
  options: Vec<SelectOption>,
  #[ts(type = "string")]
  selected: Ulid
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub enum Property{
  Number(f32),
  Text(String),
  Date(DateTime<Utc>),
  MultiSelect(MultiSelect),
  Select(Select),
}
