use serde::{Deserialize, Serialize};
use specta::Type;
use ulid::Ulid;

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Copy, Type)]
pub struct Id(Ulid);

impl Id {
  pub fn new() -> Self {
    Self(Ulid::new())
  }
}
