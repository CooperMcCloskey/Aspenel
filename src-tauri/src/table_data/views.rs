use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::utils::types::Identity;

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
#[serde(tag = "type")]
pub enum BranchViewData{
  Icon(IconViewData),
  Table(TableViewData)
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct IconViewData{
  identifier: Identity
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct TableViewData{
  identifier: Identity
}