use serde::{Deserialize, Serialize};
use specta::Type;

use crate::data::modules::{branch_views::types::BranchView, text::types::TextModule};

#[derive(Serialize, Deserialize, Type)]
pub struct Module {
  pub grid_area: GridArea,
  #[serde(flatten)]
  pub category: ModuleCategory,
}

#[derive(Serialize, Deserialize, Type)]
pub struct GridArea {
  pub row: i32,
  pub column: i32,
  pub width: i32,
  pub height: i32,
}

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "category")]
pub enum ModuleCategory {
  BranchView(BranchView),
  Text(TextModule),
}
