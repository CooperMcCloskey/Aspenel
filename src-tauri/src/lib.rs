mod error_handling;
mod filesystem;
mod utils;
mod data;

use tauri_specta::{collect_commands, Builder};

fn specta_builder() -> Builder<tauri::Wry> {
  Builder::<tauri::Wry>::new()
    .commands(collect_commands![
      filesystem::commands::load_branch,
      filesystem::commands::load_root_branch,
      filesystem::commands::load_dir,
      filesystem::commands::create_branch,
      filesystem::commands::create_root_branch,
      filesystem::commands::create_home_branch,
      filesystem::commands::write_branch,
      filesystem::commands::rename_file,
      filesystem::commands::delete_file,
    ])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let specta_builder = specta_builder();

  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(specta_builder.invoke_handler())
    .setup(move |app| {
      specta_builder.mount_events(app);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod specta_export {
  use super::specta_builder;
  use specta_typescript::Typescript;

  #[test]
  fn export_bindings() {
    specta_builder()
      .export(Typescript::default(), "../src/lib/bindings.ts")
      .expect("Failed to export typescript bindings");

    Typescript::default()
      .export_to(
        "../src/lib/types.ts",
        &specta::collect(),
        specta_serde::Format,
      )
      .expect("Failed to export types");
  }
}