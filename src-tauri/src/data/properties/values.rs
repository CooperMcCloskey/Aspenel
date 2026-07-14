use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, TS)]
#[serde(tag = "type", content = "value")]
#[ts(export)]
pub enum PropertyValue {
  Number(f64),
  Text(String),
  Date(DateTime<Utc>),
  MultiSelect(Vec<Id>),
  Select(Id),
}