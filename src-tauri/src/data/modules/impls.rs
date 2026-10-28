use std::collections::HashMap;

use crate::{
  data::modules::{
    branch_views::types::BranchView,
    text::types::TextModule,
    types::{GridArea, Module, ModuleCategory},
  },
  utils::types::Id,
};

impl Module {
  pub fn defaults() -> HashMap<Id, Module> {
    let default_branch_header = Module {
      grid_area: GridArea {
        row: 2,
        column: 2,
        width: 10,
        height: 2,
      },
      category: ModuleCategory::Text(TextModule::BranchHeader),
    };

    let icon_view_grid_area = GridArea {
      row: 5,
      column: 2,
      width: 10,
      height: 10,
    };
    let default_icon_view = BranchView::new_icon_view(icon_view_grid_area);

    HashMap::from([
      (Id::new(), default_branch_header),
      (Id::new(), default_icon_view),
    ])
  }
}
