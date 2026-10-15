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
pub struct HSV {
  #[specta(type = specta_typescript::Number)] // TODO: add notes for why this is needed
  h: f64,
  #[specta(type = specta_typescript::Number)]
  s: f64,
  #[specta(type = specta_typescript::Number)]
  v: f64,
}

#[derive(Clone, Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "value")]
pub enum ColorValue {
  SystemColor(SystemColor),
  HexColor(HexColor),
  HSV(HSV),
  AddedColorId(Id),
}

include!(concat!(env!("OUT_DIR"), "/system_colors.rs"));
