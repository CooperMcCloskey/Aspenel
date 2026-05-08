use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::utils::types::{Id, Identifier};

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(tag = "type")]
pub enum BranchView{
  Icon(IconViewData),
  Table(TableViewData)
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct IconViewData{
  identifier: Identifier
}

impl IconViewData {
    pub fn new_icon_view(name: &str) -> IconViewData {
      IconViewData { 
        identifier: Identifier::new_identity(name)
      }
    }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct TableViewData{
  identifier: Identifier,
  visible_property_ids: Vec<Id>
}