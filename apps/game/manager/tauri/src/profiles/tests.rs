use std::fs;
use std::path::Path;

use serde_json::{json, Value};

use super::*;

fn store(root: &Path) -> ProfileStore {
    let configs = root.join("Мир танков").join("mods").join("configs").join("otmetki");

    fs::create_dir_all(&configs).unwrap();
    fs::write(
        configs.join(CONFIG_JSON),
        json!({ "enabled": true, "server_url": "https://api.triotmetki.ru", "bind_code": "X", "battle_damage_log": false }).to_string(),
    )
    .unwrap();
    fs::write(configs.join(COMPONENTS_JSON), json!({ "damage_log": { "x": 10, "y": 20 } }).to_string()).unwrap();

    ProfileStore::new(configs, root.join("Roaming").join("TriOtmetki"))
}

fn read(path: &Path) -> Value {
    serde_json::from_str(&fs::read_to_string(path).unwrap()).unwrap()
}

#[test]
fn saves_the_current_settings_without_secrets_in_the_game_format() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let profile = store.save_current("  Мой   профиль ").unwrap();
    let written = read(&store.configs_dir.join(FILE_NAME));

    assert_eq!(profile.name, "Мой профиль");
    assert_eq!(written["version"], 1);
    assert_eq!(written["active"], profile.id.as_str());
    assert_eq!(written["profiles"][0]["data"]["config"], json!({ "enabled": true, "battle_damage_log": false }));
    assert_eq!(written["profiles"][0]["data"]["components"]["damage_log"]["x"], 10);
    assert!(written["profiles"][0]["created"].is_f64());
}

#[test]
fn mirrors_profiles_into_the_shared_durable_folder() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());

    store.save_current("A").unwrap();

    assert_eq!(read(&store.durable_dir.join(FILE_NAME))["profiles"][0]["name"], "A");
    assert!(read(&store.durable_dir.join(crate::durable::STAMPS_NAME))["files"][FILE_NAME].is_f64());
}

#[test]
fn keeps_a_durable_copy_and_restores_from_it() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());

    store.save_current("A").unwrap();
    fs::remove_file(store.configs_dir.join(FILE_NAME)).unwrap();

    let restored = store.load().unwrap();

    assert_eq!(restored.profiles.len(), 1);
    assert!(store.configs_dir.join(FILE_NAME).exists());
}

#[test]
fn applies_a_profile_by_merging_config_and_component_sections() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let profile = store.save_current("A").unwrap();

    fs::write(store.configs_dir.join(CONFIG_JSON), json!({ "enabled": false, "server_url": "http://localhost:4000" }).to_string()).unwrap();
    fs::write(store.configs_dir.join(COMPONENTS_JSON), json!({ "damage_log": { "x": 99, "font": 14 } }).to_string()).unwrap();
    store.activate(&profile.id).unwrap();

    let config = read(&store.configs_dir.join(CONFIG_JSON));
    let components = read(&store.configs_dir.join(COMPONENTS_JSON));

    assert_eq!(config["enabled"], true);
    assert_eq!(config["server_url"], "http://localhost:4000");
    assert_eq!(components["damage_log"], json!({ "x": 10, "y": 20, "font": 14 }));
}

#[test]
fn caps_the_number_of_profiles() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());

    for index in 0..MAX_PROFILES {
        store.save_current(&format!("P{index}")).unwrap();
    }

    assert_eq!(store.save_current("one more").unwrap_err().code(), ErrorCode::ProfileLimit);
}

#[test]
fn refuses_a_blank_name() {
    assert_eq!(normalize_name(" \t ").unwrap_err().code(), ErrorCode::ProfileName);
    assert_eq!(normalize_name(&"я".repeat(60)).unwrap().chars().count(), NAME_MAX_LENGTH);
}

#[test]
fn renames_and_deletes_the_active_profile() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let profile = store.save_current("A").unwrap();

    store.rename(&profile.id, "B").unwrap();
    assert_eq!(store.load().unwrap().profiles[0].name, "B");

    store.delete(&profile.id).unwrap();

    let file = store.load().unwrap();

    assert!(file.profiles.is_empty());
    assert_eq!(file.active, None);
    assert_eq!(store.delete(&profile.id).unwrap_err().code(), ErrorCode::ProfileMissing);
}

#[test]
fn round_trips_a_profile_code() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let profile = store.save_current("Стрим").unwrap();
    let code = store.export(&profile.id).unwrap();
    let imported = store.import(&code, None).unwrap();

    assert!(code.starts_with(CODE_PREFIX));
    assert_eq!(imported.name, "Стрим");
    assert_eq!(imported.data, profile.data);
    assert_ne!(imported.id, profile.id);
}

#[test]
fn decodes_a_padded_code_and_rejects_garbage() {
    let data = ProfileData::default();
    let code = encode("x", &data).unwrap();
    let padding = "=".repeat((4 - (code.len() - CODE_PREFIX.len()) % 4) % 4);

    assert_eq!(decode(&format!("{code}{padding}")).unwrap(), ("x".to_owned(), data));
    assert_eq!(decode("TM1.!!!").unwrap_err().code(), ErrorCode::ProfileCode);
    assert_eq!(decode("TM2.abc").unwrap_err().code(), ErrorCode::ProfileCode);
}

#[test]
fn skips_malformed_profiles_and_keeps_unknown_fields() {
    let file = ProfilesFile::from_value(&json!({
        "version": 1,
        "active": "gone",
        "profiles": [
            { "id": "a", "name": "A", "data": {}, "note": "kept" },
            { "id": 5, "name": "broken", "data": {} },
            { "id": "b", "name": "B" }
        ]
    }));

    assert_eq!(file.profiles.len(), 1);
    assert_eq!(file.active, None);
    assert_eq!(file.profiles[0].extra["note"], "kept");
}
