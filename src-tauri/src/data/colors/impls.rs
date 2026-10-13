use crate::data::colors::types::{ColorValue, SYSTEM_COLORS_ACCENTS};

impl ColorValue {
  pub fn random() -> Self {
    ColorValue::SystemColor(
      SYSTEM_COLORS_ACCENTS[rand::random_range(0..SYSTEM_COLORS_ACCENTS.len())],
    )
  }
}
