use std::{collections::HashMap, path::PathBuf};

use serde::{Deserialize, Serialize};
use specta::Type;

use crate::{
  data::{
    components::types::ChildView,
    properties::{schemas::PropertySchema, values::PropertyValue},
  },
  utils::types::Id,
};

#[derive(Serialize, Deserialize, Type)]
pub struct LoadedFields {
  pub filename: String,
  pub path: PathBuf,
  pub computed_color: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct RootFields {
  pub properties: HashMap<Id, PropertySchema>,
  pub ui_components: HashMap<Id, ChildView>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct Branch {
  pub id: Id,
  pub color: Option<String>, //If unset, it will inherit from a parent
  pub property_values: HashMap<Id, PropertyValue>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct LoadedBranch {
  #[serde(flatten)]
  pub branch: Branch,
  #[serde(flatten)]
  pub load_data: LoadedFields,
}

#[derive(Serialize, Deserialize, Type)]
pub struct RootBranch {
  #[serde(flatten)]
  pub branch: Branch,
  #[serde(flatten)]
  pub root_data: RootFields,
}

#[derive(Serialize, Deserialize, Type)]
pub struct LoadedRootBranch {
  #[serde(flatten)]
  pub branch: Branch,
  #[serde(flatten)]
  pub load_data: LoadedFields,
  #[serde(flatten)]
  pub root_data: RootFields,
}

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type")]
pub enum UnloadedBranchVariant {
  Branch(Branch),
  RootBranch(RootBranch),
}

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type")]
pub enum LoadedBranchVariant {
  LoadedBranch(LoadedBranch),
  LoadedRootBranch(LoadedRootBranch),
}
