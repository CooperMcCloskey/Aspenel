use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct HexColor(String);

impl HexColor {
  pub fn from(value: &str) -> Self {
    Self(String::from(value))
  }
}

#[derive(Clone, Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "value")]
pub enum ColorValue {
  SystemColor(SystemColor),
  HexColor(HexColor),
  AddedColorId(Id),
}

include!(concat!(env!("OUT_DIR"), "/system_colors.rs"));
