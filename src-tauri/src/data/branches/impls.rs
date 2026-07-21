use std::{collections::HashMap, path::Path};

use tauri::AppHandle;

use crate::{
  data::{
    branches::types::{Branch, LoadedBranch, LoadedFields, LoadedRootBranch, RootBranch, RootFields}, views::types::{ChildView, IconViewData},
  }, error_handling::command_errors::Error, filesystem::{
    constants::{BRANCH_PATH, ROOT_DATA_PATH}, read::find_color, write::write_file,
  }, utils::types::Id,
};

impl Branch {
  pub fn new() -> Branch {
    Branch {
      id: Id::new(),
      property_values: HashMap::new(),
      color: None,
    }
  }
}

impl RootBranch {
  pub fn new() -> RootBranch {
    RootBranch {
      branch: Branch::new(),
      root_data: RootFields {
        properties: HashMap::new(),
        ui_components: HashMap::new(),
      },
    }
  }

  pub fn new_home_branch() -> RootBranch {
    let default_view = ChildView::Icon(IconViewData::new_icon_view("Icon View"));

    RootBranch {
      branch: Branch {
        id: Id::new(),
        color: Some("var(--red)".to_string()),
        property_values: HashMap::new(),
      },
      root_data: RootFields {
        properties: HashMap::new(),
        ui_components: HashMap::from([(default_view.id(), default_view)]),
      },
    }
  }
}

impl LoadedFields {
  pub fn from(app: AppHandle, path: &Path, color: Option<String>) -> Result<LoadedFields, Error> {
    Ok(LoadedFields {
      filename: path.file_name().unwrap().to_string_lossy().into(),
      path: path.into(),
      color: color.unwrap_or(find_color(app, path.into())?),
    })
  }
}

pub trait Loadable {
  type Loaded;
  fn load(self, app: AppHandle, path: &Path) -> Result<Self::Loaded, Error>;
}

impl Loadable for Branch {
  type Loaded = LoadedBranch;
  fn load(self, app: AppHandle, path: &Path) -> Result<Self::Loaded, Error> {
    let color = self.color.clone();
    Ok(LoadedBranch {
      branch: self,
      load_data: LoadedFields::from(app, path, color)?,
    })
  }
}

impl Loadable for RootBranch {
  type Loaded = LoadedRootBranch;
  fn load(self, app: AppHandle, path: &Path) -> Result<Self::Loaded, Error> {
    let color = self.branch.color.clone();
    Ok(LoadedRootBranch {
      branch: self.branch,
      root_data: self.root_data,
      load_data: LoadedFields::from(app, path, color)?,
    })
  }
}

pub trait Writeable {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error>;
}

impl Writeable for Branch {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    write_file(app, &path.join(BRANCH_PATH), self)
  }
}

impl Writeable for RootBranch {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    write_file(app.clone(), &path.join(BRANCH_PATH), &self.branch)?;
    write_file(app.clone(), &path.join(ROOT_DATA_PATH), &self.root_data)
  }
}
