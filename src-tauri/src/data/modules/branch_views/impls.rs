use crate::data::modules::{
  branch_views::types::{BranchView, IconBranchViewData},
  types::{GridArea, Module, ModuleCategory},
};

impl BranchView {
  //this function is necessary because the default home branch needs an icon view.
  //ensure that this constructor for the iconView lines up roughly with the one in the frontend.
  pub fn new_icon_view(grid_area: GridArea) -> Module {
    Module {
      grid_area,
      category: ModuleCategory::BranchView(BranchView::Icon(IconBranchViewData {
        visible_property_ids: vec![],
      })),
    }
  }
}
