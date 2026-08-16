use std::{collections::HashMap};

use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, Type)]
pub struct SettingsData {
  theme: ThemeOption,
  additional_color_variables: HashMap<Id, ColorVariable>
}

#[derive(Serialize, Deserialize, Type)]
pub struct ResolvedSettingsData{
  theme: Theme,
  additional_color_variables: HashMap<Id, ColorVariable>
}

impl SettingsData {
  pub fn default() -> SettingsData {
    SettingsData { theme: ThemeOption::Default, additional_color_variables: HashMap::new() }
  }
}

#[derive(Serialize, Deserialize, Type)]
enum ThemeOption {
    #[serde(rename = "default")]
    Default,
    #[serde(untagged)]
    Theme(Theme),
}

#[derive(Serialize, Deserialize, Type)]
pub struct Theme {
  system_color_variables: SystemColorVariables,
}

#[derive(Serialize, Deserialize, Type)]
#[serde(untagged)]
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

