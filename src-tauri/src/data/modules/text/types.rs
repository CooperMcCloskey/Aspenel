use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
#[serde(tag = "type")]
pub enum TextModule {
  BranchHeader,
}
