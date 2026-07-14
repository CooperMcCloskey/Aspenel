use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::utils::types::{Id};

#[derive(Serialize, Deserialize, TS)]
//TODO: add the option for forumlas instead of just numbers.
pub struct NumberSchema {
  id: Id,
  name: String,
  min: Option<f64>,
  max: Option<f64>,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, TS)]
pub struct TextSchema {
  id: Id,
  name: String,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, TS)]
enum DateFormat {
  Relative,
  Text,
  MDY,
  DMY,
  YMD,
}

#[derive(Serialize, Deserialize, TS)]
enum TimeFormat {
  H24,
  H12,
}

#[derive(Serialize, Deserialize, TS)]
pub struct DateSchema {
  id: Id,
  name: String,
  date_format: DateFormat,
  time_format: TimeFormat,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, TS)]
struct SelectOption {
  color: String,
  #[ts(type = "string")]
  category_id: Option<Id>,
}

#[derive(Serialize, Deserialize, TS)]
struct SelectCategory {
  id: Id,
  name: String,
  color: String,
}

#[derive(Serialize, Deserialize, TS)]
pub struct SelectSchema {
  id: Id,
  name: String,
  options: Vec<SelectOption>,
  categories: Vec<SelectCategory>,
}

#[derive(Serialize, Deserialize, TS)]
pub struct MultiSelectSchema {
  id: Id,
  name: String,
  options: Vec<SelectOption>,
  categories: Vec<SelectCategory>,
}

// ------------------------------------------------------

#[derive(Serialize, Deserialize, TS)]
#[serde(tag = "type")]
pub enum PropertySchema {
  Number(NumberSchema),
  Text(TextSchema),
  Date(DateSchema),
  MultiSelect(MultiSelectSchema),
  Select(SelectSchema),
}
