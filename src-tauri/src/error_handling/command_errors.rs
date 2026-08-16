use serde::Serialize;
use specta::Type;

#[derive(Debug, Serialize, Type)]
#[serde(transparent)]
pub struct Error(String);

impl Error {
  pub fn msg(s: impl Into<String>) -> Self {
    Error(s.into())
  }
}

impl<E> From<E> for Error
where
  E: std::error::Error,
{
  fn from(e: E) -> Self {
    Error(e.to_string())
  }
}
