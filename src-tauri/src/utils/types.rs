use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;


#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, TS, Copy)]
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
