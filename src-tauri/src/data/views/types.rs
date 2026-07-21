use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::utils::types::{Id};

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(tag = "type")]
//TODO: generalize into UiComponent
pub enum ChildView{
  Icon(IconViewData),
  Table(TableViewData)
}

impl ChildView {
  pub fn id(&self) -> Id {
    match self {
      ChildView::Icon(data)=>data.id,
      ChildView::Table(data)=>data.id
    }
  }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct IconViewData{
  id: Id,
  name: String,
  visible_property_ids: Vec<Id>
}

impl IconViewData {
  //this function is necessary because the default home branch needs an icon view.
  //ensure that this constructor for the iconView lines up with the one in the frontend.
    pub fn new_icon_view(name: &str) -> IconViewData {
      IconViewData { 
        id: Id::new(),
        name: name.to_string(),
        visible_property_ids: vec![]
      }
    }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct TableViewData{
  id: Id,
  name: String,
  hidden_property_ids: Vec<Id>
}