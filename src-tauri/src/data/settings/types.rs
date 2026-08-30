use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, Type, Default)]
pub struct Settings {
  selected_scheme: Scheme,
  theme: Theme,
  additional_color_variables: HashMap<Id, ColorVariable>,
}

#[derive(Serialize, Deserialize, Type, Default)]
pub struct Theme {
  #[serde(default)]
  system_color_variables: SystemColorVariables,
}

#[derive(Serialize, Deserialize, Type)]
pub enum Scheme {
  Light,
  Dark,
  System,
}

impl Default for Scheme {
  fn default() -> Self {
    Scheme::System
  }
}

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "value")]
pub enum ColorVariable {
  Single(String),
  Split(SplitColorVariable),
}

#[derive(Serialize, Deserialize, Type)]
pub struct SplitColorVariable {
  light: String,
  dark: String,
}

include!(concat!(env!("OUT_DIR"), "/default_theme.rs"));
