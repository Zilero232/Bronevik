use std::fs;

use chrono::{Local, TimeZone};

use super::*;
use crate::detect::fixtures::lesta_client;

fn at(second: u32) -> chrono::DateTime<Local> {
    Local.with_ymd_and_hms(2026, 9, 27, 21, 47, second).unwrap()
}

#[test]
fn snapshots_the_mod_folders_and_restores_them() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let configs = configs_dir(&client.path);

    fs::write(client.mods_dir.join("ours.mtmod"), "ours").unwrap();
    fs::write(client.mods_dir.join("foreign.mtmod"), "foreign").unwrap();
    fs::create_dir_all(&configs).unwrap();
    fs::write(configs.join("config.json"), "{}").unwrap();

    let snapshot = create(CreateInput { client_dir: &client_dir, client: &client, now: at(5) }).unwrap();

    fs::remove_file(client.mods_dir.join("foreign.mtmod")).unwrap();
    fs::write(client.mods_dir.join("new.mtmod"), "new").unwrap();
    fs::create_dir_all(&client.res_mods_dir).unwrap();

    restore(&client_dir, &snapshot.id).unwrap();

    assert_eq!(snapshot.id, "20260927-214705");
    assert!(client.mods_dir.join("foreign.mtmod").exists());
    assert!(!client.mods_dir.join("new.mtmod").exists());
    assert!(!client.res_mods_dir.exists());
    assert_eq!(fs::read_to_string(configs.join("config.json")).unwrap(), "{}");
}

#[test]
fn records_parts_in_the_installer_layout() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let snapshot = create(CreateInput { client_dir: &client_dir, client: &client, now: at(0) }).unwrap();
    let ini = crate::ini_file::read(&backups_dir(&client_dir).join(&snapshot.id).join(SNAPSHOT_INI)).unwrap().unwrap();

    assert_eq!(crate::ini_file::get(&ini, SECTION, "mods_exists"), Some("1"));
    assert_eq!(crate::ini_file::get(&ini, SECTION, "res_mods_exists"), Some("0"));
    assert_eq!(snapshot.parts.len(), 3);
}

#[test]
fn lists_newest_first_and_prunes_the_oldest() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");

    for second in 0..4 {
        create(CreateInput { client_dir: &client_dir, client: &client, now: at(second) }).unwrap();
    }

    let removed = prune(&client_dir, KEEP_SNAPSHOTS).unwrap();
    let ids: Vec<String> = list(&client_dir).into_iter().map(|snapshot| snapshot.id).collect();

    assert_eq!(removed, vec!["20260927-214700"]);
    assert_eq!(ids, vec!["20260927-214703", "20260927-214702", "20260927-214701"]);
}

#[test]
fn never_overwrites_a_snapshot_taken_the_same_second() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let first = create(CreateInput { client_dir: &client_dir, client: &client, now: at(1) }).unwrap();
    let second = create(CreateInput { client_dir: &client_dir, client: &client, now: at(1) }).unwrap();

    assert_ne!(first.id, second.id);
}

#[test]
fn refuses_unknown_or_escaping_snapshot_ids() {
    let root = tempfile::tempdir().unwrap();

    assert!(restore(root.path(), "..").is_err());
    assert!(delete(root.path(), "20260101-000000").is_err());
}
