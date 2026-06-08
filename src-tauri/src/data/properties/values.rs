use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PropertyValue {
  Number(#[ts(type = "Number")] f64),
  Text(#[ts(type = "String")] String),
  Date(#[ts(type = "String")] DateTime<Utc>),
  MultiSelect(Vec<Id>),
  Select(Id),
}
