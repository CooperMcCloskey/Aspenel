use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/utils")]
pub struct Identifier {
  name: String,
  #[ts(type = "string")]
  id: Id
}

#[derive(Serialize, Deserialize, TS)]
#[ts(type = "string")]
pub struct Id(Ulid);

impl Id {
  pub fn new() -> Self {
      Self(Ulid::new())
  }
  pub fn as_ulid(&self) -> &Ulid {
      &self.0
  }
}

impl Identifier {
  pub fn new_identity(name: &str) -> Identifier {
    Identifier { 
      name: name.to_string(),
      id: Id::new(),
    }
  }
}