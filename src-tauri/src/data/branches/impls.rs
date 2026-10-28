use std::{collections::HashMap, path::Path};

use tauri::AppHandle;

use crate::{
  data::{
    branches::types::{
      Branch, LoadedBranch, LoadedBranchVariant, LoadedFields, LoadedRootBranch, RootBranch,
      RootFields, UnloadedBranchVariant,
    },
    colors::types::{ColorValue, SystemColor},
    modules::types::Module,
  },
  error_handling::command_errors::Error,
  filesystem::{
    constants::{BRANCH_PATH, ROOT_DATA_PATH},
    path_utils::get_sys_path,
    read::{find_color, read_file},
    write::write_file,
  },
  utils::types::Id,
};

impl Branch {
  pub fn new() -> Branch {
    Branch {
      id: Id::new(),
      property_values: HashMap::new(),
      color: None,
    }
  }
  pub fn read(app: AppHandle, path: &Path) -> Result<Branch, Error> {
    read_file::<Branch>(app, &path.join(BRANCH_PATH))
  }
}

impl RootBranch {
  pub fn new() -> RootBranch {
    RootBranch {
      branch: Branch::new(),
      root_data: RootFields {
        properties: HashMap::new(),
        modules: HashMap::new(),
      },
    }
  }

  pub fn new_home_branch() -> RootBranch {
    let default_modules = Module::defaults();

    RootBranch {
      branch: Branch {
        id: Id::new(),
        color: Some(ColorValue::SystemColor(SystemColor::Red)),
        property_values: HashMap::new(),
      },
      root_data: RootFields {
        properties: HashMap::new(),
        modules: default_modules,
      },
    }
  }

  pub fn read(app: AppHandle, path: &Path) -> Result<UnloadedBranchVariant, Error> {
    let branch = read_file::<Branch>(app.clone(), &path.join(BRANCH_PATH))?;
    let root_data_path = &path.join(ROOT_DATA_PATH);
    let root_data_sys_path = get_sys_path(app.clone(), root_data_path)?;

    if !root_data_sys_path.exists() {
      return Ok(UnloadedBranchVariant::Branch(branch));
    }
    let root_data = read_file::<RootFields>(app, root_data_path)?;
    Ok(UnloadedBranchVariant::RootBranch(RootBranch {
      branch,
      root_data,
    }))
  }
}

impl LoadedFields {
  pub fn from(
    app: AppHandle,
    path: &Path,
    color: Option<ColorValue>,
  ) -> Result<LoadedFields, Error> {
    Ok(LoadedFields {
      filename: path.file_name().unwrap().to_string_lossy().into(),
      path: path.into(),
      computed_color: color.unwrap_or(find_color(app, path.into())?),
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

impl Loadable for UnloadedBranchVariant {
  type Loaded = LoadedBranchVariant;
  fn load(self, app: AppHandle, path: &Path) -> Result<Self::Loaded, Error> {
    match self {
      UnloadedBranchVariant::Branch(b) => Ok(LoadedBranchVariant::LoadedBranch(b.load(app, path)?)),
      UnloadedBranchVariant::RootBranch(rb) => {
        Ok(LoadedBranchVariant::LoadedRootBranch(rb.load(app, path)?))
      }
    }
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

impl Writeable for RootFields {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    write_file(app, &path.join(ROOT_DATA_PATH), &self)
  }
}

impl Writeable for RootBranch {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    self.branch.write(app.clone(), path)?;
    self.root_data.write(app, path)
  }
}

impl Writeable for LoadedBranch {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    self.branch.write(app, path)
  }
}

impl Writeable for LoadedRootBranch {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    self.branch.write(app.clone(), path)?;
    self.root_data.write(app, path)
  }
}

impl Writeable for LoadedBranchVariant {
  fn write(&self, app: AppHandle, path: &Path) -> Result<(), Error> {
    match self {
      LoadedBranchVariant::LoadedBranch(lb) => lb.write(app, path),
      LoadedBranchVariant::LoadedRootBranch(lrb) => lrb.write(app, path),
    }
  }
}
