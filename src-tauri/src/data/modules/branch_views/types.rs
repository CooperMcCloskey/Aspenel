use serde::{Deserialize, Serialize};
use specta::Type;

use crate::utils::types::Id;

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type")]
pub enum BranchView {
  Icon(IconBranchViewData),
  Table(TableBranchViewData),
}

#[derive(Serialize, Deserialize, Type)]
pub struct IconBranchViewData {
  pub(super) visible_property_ids: Vec<Id>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct TableBranchViewData {
  pub(super) hidden_property_ids: Vec<Id>,
}
