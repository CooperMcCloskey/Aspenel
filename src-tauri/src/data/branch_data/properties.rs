use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use ts_rs::TS;

use crate::utils::types::{Id, Identifier};

#[derive(Serialize, Deserialize, TS)]
//TODO: add the option for forumlas instead of just numbers.
struct Number{
  min: Option<f64>,
  max: Option<f64>,
}

#[derive(Serialize, Deserialize, TS)]
enum DateFormat{
  Relative,
  Text,
  MDY,
  DMY,
  YMD,
}
#[derive(Serialize, Deserialize, TS)]
enum TimeFormat{
  H24,
  H12,
}
#[derive(Serialize, Deserialize, TS)]
struct Date{
  date_format: DateFormat,
  time_format: TimeFormat
}


#[derive(Serialize, Deserialize, TS)]
struct SelectOption{
  color: String,
  #[ts(type = "string")]
  category_id: Option<Id>
}
#[derive(Serialize, Deserialize, TS)]
struct SelectCategory{
  identifier: Identifier,
  color: String
}
#[derive(Serialize, Deserialize, TS)]
struct Select{
  options: Vec<SelectOption>,
  categories: Vec<SelectCategory>
}
#[derive(Serialize, Deserialize, TS)]
struct MultiSelect{
  options: Vec<SelectOption>,
  categories: Vec<SelectCategory>
}

#[derive(Serialize, Deserialize, TS)]
enum PropertyType{
  Number(Number),
  Text(String),
  Date(Date),
  MultiSelect(MultiSelect),
  Select(Select)
}
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum PropertyValue{
  Number(f64),
  Text(String),
  Date(DateTime<Utc>),
  MultiSelect(Vec<Id>),
  Select(Id),
}
#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Property{
  identifier: Identifier,
  property_type: PropertyType
}

