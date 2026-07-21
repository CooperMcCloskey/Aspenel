use std::{collections::HashMap, path::PathBuf};

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
  data::{
    properties::{schemas::PropertySchema, values::PropertyValue},
    views::types::ChildView,
  },
  utils::types::Id,
};

#[derive(Serialize, Deserialize, TS)]
pub struct RootFields {
  pub properties: HashMap<Id, PropertySchema>,
  pub ui_components: HashMap<Id, ChildView>,
}

#[derive(Serialize, Deserialize, TS)]
pub struct LoadedFields {
  pub filename: String,
  pub path: PathBuf,
  pub color: String,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Branch {
  #[ts(type = "string")]
  pub id: Id,
  pub color: Option<String>, //If unset, it will inherit from a parent
  pub property_values: HashMap<Id, PropertyValue>,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct LoadedBranch {
  #[serde(flatten)]
  #[ts(flatten)]
  pub branch: Branch,
  #[serde(flatten)]
  #[ts(flatten)]
  pub load_data: LoadedFields,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct RootBranch {
  #[serde(flatten)]
  #[ts(flatten)]
  pub branch: Branch,
  #[serde(flatten)]
  #[ts(flatten)]
  pub root_data: RootFields,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct LoadedRootBranch {
  #[serde(flatten)]
  #[ts(flatten)]
  pub branch: Branch,
  #[serde(flatten)]
  #[ts(flatten)]
  pub load_data: LoadedFields,
  #[serde(flatten)]
  #[ts(flatten)]
  pub root_data: RootFields,
}
