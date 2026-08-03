use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "value")]
pub enum PropertyValue {
  #[specta(type = specta_typescript::Number)] //Prevents the f64 from becoming number | null and hurting ergonomics since this value cannot be null or number anyways.
  Number(f64),
  Text(String),
  Date(DateTime<Utc>),
  MultiSelect(Vec<Id>),
  Select(Id),
}