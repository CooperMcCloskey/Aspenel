use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, Type)]
pub struct NumberSchema {
  id: Id,
  name: String,
  #[specta(type = specta_typescript::Number)]
  #[specta(optional)]
  min: Option<f64>,
  #[specta(type = specta_typescript::Number)]
  #[specta(optional)]
  max: Option<f64>,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, Type)]
pub struct TextSchema {
  id: Id,
  name: String,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, Type)]
enum DateFormat {
  Relative,
  Text,
  MDY,
  DMY,
  YMD,
}

#[derive(Serialize, Deserialize, Type)]
enum TimeFormat {
  H24,
  H12,
}

#[derive(Serialize, Deserialize, Type)]
pub struct DateSchema {
  id: Id,
  name: String,
  date_format: DateFormat,
  time_format: TimeFormat,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, Type)]
struct SelectOption {
  name: String,
  id: Id,
  color: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct SelectSchema {
  id: Id,
  name: String,
  options: HashMap<Id, SelectOption>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct MultiSelectSchema {
  id: Id,
  name: String,
  options: HashMap<Id, SelectOption>,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type")]
pub enum PropertySchema {
  Number(NumberSchema),
  Text(TextSchema),
  Date(DateSchema),
  MultiSelect(MultiSelectSchema),
  Select(SelectSchema),
}
