use std::fs;

use chrono::{Local, TimeZone};
use serde_json::Value;

use super::*;
use crate::catalog::fixtures::catalog;
use crate::detect::fixtures::{lesta_client, patch_client};
use crate::durable::{stamp_of, STAMPS_NAME};

fn at(second: u32) -> chrono::DateTime<Local> {
    Local.with_ymd_and_hms(2026, 9, 27, 21, 47, second).unwrap()
}

fn snapshot_input<'a>(context: ClientContext<'a>, kind: SnapshotKind, now: chrono::DateTime<Local>) -> CreateInput<'a> {
    CreateInput { context, kind, removed: &[], now }
}

#[test]
fn snapshots_our_files_and_configs_but_not_foreign_mods() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let durable = root.path().join("Roaming");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let configs = configs_dir(&client.path);

    fs::write(client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod"), "core").unwrap();
    fs::write(client.mods_dir.join("foreign.mtmod"), "foreign").unwrap();
    fs::create_dir_all(client.res_mods_dir.join("sounds")).unwrap();
    fs::write(client.res_mods_dir.join("sounds").join("big.bank"), "sound").unwrap();
    fs::create_dir_all(&configs).unwrap();
    fs::write(configs.join("config.json"), "{}").unwrap();

    let snapshot = create(snapshot_input(context, SnapshotKind::Manual, at(5))).unwrap();
    let dir = backups_dir(&client_dir).join(&snapshot.id);

    assert!(dir.join(MODPACK_PART).join("net.triotmetki.core_0.1.0.mtmod").exists());
    assert!(!dir.join(MODPACK_PART).join("foreign.mtmod").exists());
    assert!(!dir.join(RES_MODS_PART).exists());
    assert_eq!(snapshot.kind, SnapshotKind::Manual);

    fs::remove_file(client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod")).unwrap();
    fs::write(client.mods_dir.join("net.triotmetki.core_0.2.0.mtmod"), "new core").unwrap();
    fs::write(client.mods_dir.join("added_later.mtmod"), "foreign").unwrap();
    fs::write(configs.join("config.json"), r#"{"broken":true}"#).unwrap();

    restore(RestoreInput { context, durable_dir: &durable, id: &snapshot.id }).unwrap();

    assert_eq!(snapshot.id, "20260927-214705");
    assert!(client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod").exists());
    assert!(!client.mods_dir.join("net.triotmetki.core_0.2.0.mtmod").exists());
    assert!(client.mods_dir.join("foreign.mtmod").exists());
    assert!(client.mods_dir.join("added_later.mtmod").exists());
    assert!(client.res_mods_dir.join("sounds").join("big.bank").exists());
    assert_eq!(fs::read_to_string(configs.join("config.json")).unwrap(), "{}");
}

#[test]
fn a_restored_config_wins_over_the_newer_durable_copy() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let durable = root.path().join("Roaming");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let configs = configs_dir(&client.path);
    let mirrored = crate::durable::MirroredFile::new("config.json", &configs, &durable);

    fs::create_dir_all(&configs).unwrap();
    mirrored.write(&serde_json::json!({ "hud": "good" })).unwrap();

    let snapshot = create(snapshot_input(context, SnapshotKind::Manual, at(1))).unwrap();

    mirrored.write(&serde_json::json!({ "hud": "broken" })).unwrap();
    restore(RestoreInput { context, durable_dir: &durable, id: &snapshot.id }).unwrap();

    let durable_copy: Value = serde_json::from_str(&fs::read_to_string(durable.join("config.json")).unwrap()).unwrap();

    assert_eq!(mirrored.read(), Some(serde_json::json!({ "hud": "good" })));
    assert_eq!(durable_copy["hud"], "good");
    assert!(stamp_of(&configs, "config.json") >= stamp_of(&durable, "config.json") - crate::durable::STAMP_TOLERANCE_S);
    assert!(configs.join(STAMPS_NAME).exists());
}

#[test]
fn restores_into_the_current_client_folder_after_a_patch() {
    let root = tempfile::tempdir().unwrap();
    let old = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let durable = root.path().join("Roaming");
    let catalog = catalog();

    fs::write(old.mods_dir.join("net.triotmetki.core_0.1.0.mtmod"), "core").unwrap();

    let snapshot =
        create(snapshot_input(ClientContext { client_dir: &client_dir, client: &old, catalog: &catalog }, SnapshotKind::Auto, at(2))).unwrap();
    let patched = patch_client(&old.path, "1.46.0.0");

    fs::write(patched.mods_dir.join("foreign.mtmod"), "foreign").unwrap();
    restore(RestoreInput {
        context: ClientContext { client_dir: &client_dir, client: &patched, catalog: &catalog },
        durable_dir: &durable,
        id: &snapshot.id,
    })
    .unwrap();

    assert!(patched.mods_dir.join("net.triotmetki.core_0.1.0.mtmod").exists());
    assert!(patched.mods_dir.join("foreign.mtmod").exists());
}

#[test]
fn a_legacy_snapshot_never_deletes_foreign_mods() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let durable = root.path().join("Roaming");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let dir = backups_dir(&client_dir).join("20260101-000000");
    let mut ini = Ini::new();

    fs::create_dir_all(dir.join(MODS_PART)).unwrap();
    fs::write(dir.join(MODS_PART).join("otmetki.companion_0.0.9.mtmod"), "old").unwrap();
    fs::write(dir.join(MODS_PART).join("removed_by_installer.mtmod"), "foreign").unwrap();
    ini.with_section(Some(SECTION))
        .set("date", "2026-01-01 00:00:00")
        .set(MODS_PART, r"D:\Old\mods\1.40.0.0")
        .set("mods_exists", "1")
        .set(RES_MODS_PART, r"D:\Old\res_mods\1.40.0.0")
        .set("res_mods_exists", "0");
    ini_file::write(&dir.join(SNAPSHOT_INI), &ini).unwrap();
    fs::write(client.mods_dir.join("mine.mtmod"), "foreign").unwrap();
    fs::create_dir_all(&client.res_mods_dir).unwrap();

    let restored = restore(RestoreInput { context, durable_dir: &durable, id: "20260101-000000" }).unwrap();

    assert_eq!(restored.kind, SnapshotKind::Auto);
    assert!(client.mods_dir.join("mine.mtmod").exists());
    assert!(client.mods_dir.join("removed_by_installer.mtmod").exists());
    assert!(client.mods_dir.join("otmetki.companion_0.0.9.mtmod").exists());
    assert!(client.res_mods_dir.exists());
}

#[test]
fn brings_back_the_other_mods_an_install_removed() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let durable = root.path().join("Roaming");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let foreign = client.res_mods_dir.join("gui");

    fs::create_dir_all(&foreign).unwrap();
    fs::write(foreign.join("skin.dds"), "skin").unwrap();

    let removed = [foreign.clone()];
    let snapshot = create(CreateInput { context, kind: SnapshotKind::Auto, removed: &removed, now: at(3) }).unwrap();

    fs::remove_dir_all(&foreign).unwrap();
    restore(RestoreInput { context, durable_dir: &durable, id: &snapshot.id }).unwrap();

    assert_eq!(fs::read_to_string(foreign.join("skin.dds")).unwrap(), "skin");
}

#[test]
fn prunes_automatic_snapshots_without_touching_manual_ones() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };

    create(snapshot_input(context, SnapshotKind::Manual, at(0))).unwrap();

    for second in 1..6 {
        create_and_prune(snapshot_input(context, SnapshotKind::Auto, at(second))).unwrap();
    }

    let ids: Vec<(String, SnapshotKind)> = list(&client_dir).into_iter().map(|snapshot| (snapshot.id, snapshot.kind)).collect();

    assert_eq!(
        ids,
        vec![
            ("20260927-214705".to_owned(), SnapshotKind::Auto),
            ("20260927-214704".to_owned(), SnapshotKind::Auto),
            ("20260927-214703".to_owned(), SnapshotKind::Auto),
            ("20260927-214700".to_owned(), SnapshotKind::Manual),
        ]
    );
}

#[test]
fn records_the_kind_and_the_parts() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let snapshot = create(snapshot_input(context, SnapshotKind::Auto, at(0))).unwrap();
    let ini = crate::ini_file::read(&backups_dir(&client_dir).join(&snapshot.id).join(SNAPSHOT_INI)).unwrap().unwrap();

    assert_eq!(crate::ini_file::get(&ini, SECTION, "kind"), Some("auto"));
    assert_eq!(crate::ini_file::get(&ini, SECTION, "modpack_exists"), Some("1"));
    assert_eq!(crate::ini_file::get(&ini, SECTION, "configs_exists"), Some("0"));
    assert!(required_space(&snapshot_input(context, SnapshotKind::Auto, at(0))) < SPACE_MARGIN_BYTES);
}

#[test]
fn never_overwrites_a_snapshot_taken_the_same_second() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let first = create(snapshot_input(context, SnapshotKind::Manual, at(1))).unwrap();
    let second = create(snapshot_input(context, SnapshotKind::Manual, at(1))).unwrap();

    assert_ne!(first.id, second.id);
}

#[test]
fn a_failed_copy_leaves_no_partial_snapshot() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };

    fs::write(client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod"), "core").unwrap();
    crate::fsx::faults::fail_after(0, std::io::ErrorKind::StorageFull);

    let result = create(snapshot_input(context, SnapshotKind::Auto, at(4)));

    crate::fsx::faults::clear();

    assert_eq!(result.unwrap_err().code(), ErrorCode::SnapshotFailed);
    assert!(list(&client_dir).is_empty());
}

#[test]
fn refuses_unknown_or_escaping_snapshot_ids() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let catalog = catalog();
    let context = ClientContext { client_dir: root.path(), client: &client, catalog: &catalog };

    assert!(restore(RestoreInput { context, durable_dir: root.path(), id: ".." }).is_err());
    assert!(delete(root.path(), "20260101-000000").is_err());
}
