use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use specta::Type;

use crate::{data::colors::types::ColorValue, utils::types::Id};

#[derive(Serialize, Deserialize, Type)]
pub struct NumberSchema {
  id: Id,
  name: String,
  min: Option<f64>,
  max: Option<f64>,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, Type)]
pub struct TextSchema {
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
  name: String,
  date_format: DateFormat,
  time_format: TimeFormat,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, Type)]
struct SelectOption {
  name: String,
  color: ColorValue,
}

#[derive(Serialize, Deserialize, Type)]
pub struct SelectSchema {
  name: String,
  options: HashMap<Id, SelectOption>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct MultiSelectSchema {
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
