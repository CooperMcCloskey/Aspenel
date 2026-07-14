#[derive(Debug, thiserror::Error)]
pub enum Error {
  #[error(transparent)]
  Io(std::io::Error),

  #[error(transparent)]
  Tauri(#[from] tauri::Error),

  #[error(transparent)]
  SerdeJson(#[from] serde_json::Error),

  #[error("{0}")]
  Message(String),
}

impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    eprintln!("\x1b[31mERROR: {}\x1b[m", self);
    serializer.serialize_str(self.to_string().as_ref())
  }
}

impl From<std::io::Error> for Error {
    #[track_caller]
    fn from(value: std::io::Error) -> Self {
        let loc = std::panic::Location::caller();
        eprintln!("\x1b[33mIO ERROR at {}:{} -> {}\x1b[m", loc.file(), loc.line(), value);
        Error::Io(value)
    }
}

impl From<&str> for Error {
  fn from(value: &str) -> Self {
    Error::Message(value.to_string())
  }
}
