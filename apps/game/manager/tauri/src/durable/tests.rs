use std::fs;

use serde_json::json;

use super::*;

fn dirs() -> (tempfile::TempDir, PathBuf, PathBuf) {
    let root = tempfile::tempdir().unwrap();
    let game = root.path().join("Мир танков").join("mods").join("configs").join("otmetki");
    let durable = root.path().join("Roaming").join("TriOtmetki");

    fs::create_dir_all(&game).unwrap();

    (root, game, durable)
}

#[test]
fn writes_both_copies_with_one_stamp() {
    let (_root, game, durable) = dirs();
    let file = MirroredFile::new("profiles.json", &game, &durable);

    file.write(&json!({ "version": 1 })).unwrap();

    let game_stamps = read_json(&game.join(STAMPS_NAME)).unwrap();
    let durable_stamps = read_json(&durable.join(STAMPS_NAME)).unwrap();

    assert_eq!(game_stamps["version"], 1);
    assert_eq!(game_stamps["files"]["profiles.json"], durable_stamps["files"]["profiles.json"]);
    assert_eq!(read_json(&durable.join("profiles.json")), Some(json!({ "version": 1 })));
}

#[test]
fn keeps_the_other_entries_of_saved_at() {
    let (_root, game, durable) = dirs();

    fs::write(game.join(STAMPS_NAME), r#"{"version":1,"files":{"config.json":12.5}}"#).unwrap();
    MirroredFile::new("profiles.json", &game, &durable).write(&json!({})).unwrap();

    assert_eq!(read_json(&game.join(STAMPS_NAME)).unwrap()["files"]["config.json"], 12.5);
}

#[test]
fn restores_a_missing_game_copy_from_the_durable_one() {
    let (_root, game, durable) = dirs();
    let file = MirroredFile::new("config.json", &game, &durable);

    file.write(&json!({ "enabled": true })).unwrap();
    fs::remove_file(game.join("config.json")).unwrap();

    assert_eq!(file.read(), Some(json!({ "enabled": true })));
    assert!(game.join("config.json").exists());
}

#[test]
fn the_newer_copy_wins() {
    let (_root, game, durable) = dirs();
    let file = MirroredFile::new("config.json", &game, &durable);

    fs::create_dir_all(&durable).unwrap();
    fs::write(game.join("config.json"), r#"{"side":"game"}"#).unwrap();
    fs::write(durable.join("config.json"), r#"{"side":"durable"}"#).unwrap();
    fs::write(game.join(STAMPS_NAME), r#"{"version":1,"files":{"config.json":1.0}}"#).unwrap();
    fs::write(durable.join(STAMPS_NAME), format!(r#"{{"version":1,"files":{{"config.json":{}}}}}"#, now_seconds() + 60.0)).unwrap();

    assert_eq!(file.read(), Some(json!({ "side": "durable" })));
    assert_eq!(read_json(&game.join("config.json")), Some(json!({ "side": "durable" })));
}

#[test]
fn nothing_to_read_without_either_copy() {
    let (_root, game, durable) = dirs();

    assert_eq!(MirroredFile::new("config.json", &game, &durable).read(), None);
}

#[test]
fn a_newer_game_copy_refreshes_the_durable_one_and_sets_the_mtime() {
    let (_root, game, durable) = dirs();
    let file = MirroredFile::new("config.json", &game, &durable);

    file.write(&json!({ "v": 1 })).unwrap();
    fs::write(game.join(STAMPS_NAME), format!(r#"{{"version":1,"files":{{"config.json":{}}}}}"#, now_seconds() + 60.0)).unwrap();
    fs::write(game.join("config.json"), r#"{"v":2}"#).unwrap();

    assert_eq!(file.read(), Some(json!({ "v": 2 })));
    assert_eq!(read_json(&durable.join("config.json")), Some(json!({ "v": 2 })));
    assert!((mtime(&durable.join("config.json")).unwrap() - stamp_entry(&durable, "config.json").unwrap()).abs() < 1.0);
}

#[test]
fn removes_only_the_mirrored_copies() {
    let (_root, game, durable) = dirs();

    MirroredFile::new("credentials.json", &game, &durable).write(&json!({ "secret": "s" })).unwrap();
    fs::create_dir_all(durable.join("manager")).unwrap();
    fs::write(durable.join("manager").join("settings.json"), "{}").unwrap();

    let removed = remove_durable_copies(&durable).unwrap();

    assert_eq!(removed, vec![durable.join("credentials.json")]);
    assert!(durable.join("manager").join("settings.json").exists());
    assert!(stamp_entry(&durable, "credentials.json").is_none());
}
