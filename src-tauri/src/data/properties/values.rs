use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "value")]
pub enum PropertyValue {
  Number(f64),
  Text(String),
  Date(DateTime<Utc>),
  MultiSelect(Vec<Id>),
  Select(Id),
}