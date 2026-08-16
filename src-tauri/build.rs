use std::{collections::BTreeSet, env, fs, path::Path};

use serde_json::Value;

fn main() {
    let theme_path = "../src/lib/styling/systemTheme.json";

    let raw = fs::read_to_string(theme_path).expect("Failed to read theme");
    let theme: Value = serde_json::from_str(&raw).expect("Failed to read theme");

    let colors = theme.get("colors").and_then(Value::as_object).expect("Theme does not contain colors");
    let light_colors = colors.get("light").and_then(Value::as_object).expect("Theme does not contain light colors");
    let dark_colors = colors.get("dark").and_then(Value::as_object).expect("Theme does not contain dark colors");

    let light_keys: BTreeSet<&str> = light_colors.keys().map(String::as_str).collect();
    let dark_keys: BTreeSet<&str> = dark_colors.keys().map(String::as_str).collect();
    if light_keys != dark_keys {
        panic!("Light and dark color keys differ")
    }

    let keys: Vec<&str> = light_colors.keys().map(String::as_str).collect();
    
    let mut system_color_variable_struct_fields = String::new();

    for key in &keys {
        system_color_variable_struct_fields.push_str(&format!("    pub {key}: ColorVariable,\n"));
    }

        let generated = format!(
    r#"#[derive(Serialize, Deserialize, Type)]
pub struct SystemColorVariables {{
{system_color_variable_struct_fields}}}
"#
        );

    let out_dir = env::var("OUT_DIR").unwrap();
    fs::write(Path::new(&out_dir).join("default_theme.rs"), generated).unwrap();

}