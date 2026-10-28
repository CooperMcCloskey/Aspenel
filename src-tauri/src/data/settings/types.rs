use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use specta::Type;

use crate::{data::colors::types::HexColor, utils::types::Id};

#[derive(Serialize, Deserialize, Type, Default)]
pub struct Settings {
  selected_scheme: SelectedScheme,
  theme: Theme,
  added_color_variables: HashMap<Id, ColorVariable>,
}

#[derive(Serialize, Deserialize, Type, Default)]
pub struct Theme {
  #[serde(default)]
  system_color_variables: SystemColorVariables,
}

#[derive(Serialize, Deserialize, Type)]
#[serde(rename_all = "lowercase")]
pub enum Scheme {
  Light,
  Dark,
}

#[derive(Serialize, Deserialize, Type)]
#[serde(rename_all = "lowercase")]
pub enum SelectedScheme {
  Light,
  Dark,
  System,
}

impl Default for SelectedScheme {
  fn default() -> Self {
    SelectedScheme::System
  }
}

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "value")]
pub enum ColorVariable {
  Single(HexColor),
  Split(SplitColorVariable),
}

#[derive(Serialize, Deserialize, Type)]
pub struct SplitColorVariable {
  light: HexColor,
  dark: HexColor,
}

include!(concat!(env!("OUT_DIR"), "/default_theme.rs"));
