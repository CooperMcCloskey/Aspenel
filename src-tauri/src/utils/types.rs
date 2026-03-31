use serde::{Deserialize, Serialize};
use ts_rs::TS;
use ulid::Ulid;

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/types/rustTypes/")]
pub struct Identity {
  name: String,
  #[ts(type = "string")]
  id: Ulid
}