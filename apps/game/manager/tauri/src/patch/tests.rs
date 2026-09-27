use std::collections::BTreeSet;
use std::fs;

use super::*;
use crate::catalog::fixtures::catalog;
use crate::components::{read_installation, sync_manifest, ClientContext, ComponentState};
use crate::detect::fixtures::{lesta_client, patch_client};
use crate::releases::fixtures::{latest, release};
use crate::releases::{sha256_hex, ReleasePackage};
use crate::state::{disabled_dir, Manifest};

fn version(text: &str) -> GameVersion {
    GameVersion::parse(text).unwrap()
}

fn plan_for(recorded: &str, current: &str, installed: &str, response: Option<&LatestRelease>) -> PatchAction {
    plan(PlanInput { recorded_game: Some(version(recorded)), current_game: version(current), installed_modpack: Some(installed), latest: response })
}

#[test]
fn migrates_when_the_installed_release_supports_the_new_client() {
    let response = latest("1.46.0.0", Some(release("0.1.0")));

    assert_eq!(plan_for("1.45.0.0", "1.46.0.0", "0.1.0", Some(&response)), PatchAction::Migrate);
}

#[test]
fn installs_a_newer_release_after_a_patch() {
    let response = latest("1.46.0.0", Some(release("0.2.0")));

    assert_eq!(plan_for("1.45.0.0", "1.46.0.0", "0.1.0", Some(&response)), PatchAction::Install(release("0.2.0")));
}

#[test]
fn waits_when_no_release_supports_the_new_client() {
    let response = latest("1.46.0.0", None);

    assert_eq!(plan_for("1.45.0.0", "1.46.0.0", "0.1.0", Some(&response)), PatchAction::Wait);
}

#[test]
fn only_offers_a_newer_release_without_a_patch() {
    let response = latest("1.45.0.0", Some(release("0.2.0")));

    assert_eq!(plan_for("1.45.0.0", "1.45.0.0", "0.1.0", Some(&response)), PatchAction::Offer(release("0.2.0")));
}

#[test]
fn does_nothing_when_everything_is_current() {
    let response = latest("1.45.0.0", Some(release("0.1.0")));

    assert_eq!(plan_for("1.45.0.0", "1.45.0.0", "0.1.0", Some(&response)), PatchAction::Nothing);
    assert_eq!(plan_for("1.45.0.0", "1.45.0.0", "0.1.0", None), PatchAction::Nothing);
}

#[test]
fn reports_offline_only_after_a_patch() {
    assert_eq!(plan_for("1.45.0.0", "1.46.0.0", "0.1.0", None), PatchAction::Offline);
}

#[test]
fn compares_modpack_versions_semantically() {
    assert!(is_newer("0.10.0", Some("0.9.0")));
    assert!(!is_newer("0.1.0", Some("0.1.0")));
    assert!(is_newer("0.1.0", None));
}

#[test]
fn copies_our_packages_into_the_new_mods_folder_only() {
    let root = tempfile::tempdir().unwrap();
    let old = lesta_client(root.path(), "1.45.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();

    fs::write(old.mods_dir.join("net.triotmetki.core_0.1.0.mtmod"), "core").unwrap();
    fs::write(old.mods_dir.join("otmetki.companion_0.1.0.mtmod"), "companion").unwrap();
    fs::write(old.mods_dir.join("izeberg.modssettingsapi_1.6.0.mtmod"), "foreign").unwrap();
    sync_manifest(ClientContext { client_dir: &client_dir, client: &old, catalog: &catalog }).unwrap();

    let patched = patch_client(&old.path, "1.46.0.0");
    let context = ClientContext { client_dir: &client_dir, client: &patched, catalog: &catalog };
    let copied = migrate(MigrateInput { context, from_mods_dir: &old.mods_dir }).unwrap();
    let manifest = Manifest::read(&client_dir).unwrap().unwrap();

    assert_eq!(copied.len(), 2);
    assert!(!patched.mods_dir.join("izeberg.modssettingsapi_1.6.0.mtmod").exists());
    assert!(old.mods_dir.join("net.triotmetki.core_0.1.0.mtmod").exists());
    assert_eq!(manifest.version, "1.46.0.0");
    assert_eq!(manifest.mods_dir, patched.mods_dir);
    assert!(!read_installation(context).unwrap().needs_migration);
}

fn fetched(id: &str, file: &str) -> FetchedPackage {
    FetchedPackage {
        package: ReleasePackage {
            id: id.to_owned(),
            file: file.to_owned(),
            url: format!("https://cdn.triotmetki.ru/{file}"),
            sha256: sha256_hex(file.as_bytes()),
            size: file.len() as u64,
        },
        bytes: file.as_bytes().to_vec(),
    }
}

#[test]
fn installs_a_release_keeping_parked_components_parked() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.46.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };

    fs::write(client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod"), "old").unwrap();
    fs::write(client.mods_dir.join("otmetki.companion_0.1.0.mtmod"), "old").unwrap();
    fs::create_dir_all(disabled_dir(&client_dir)).unwrap();
    fs::write(disabled_dir(&client_dir).join("net.triotmetki.damage_log_0.1.0.mtmod"), "old").unwrap();

    let (enabled, disabled) = install_targets(context, &[]).unwrap();
    let packages = [
        fetched("core", "net.triotmetki.core_0.2.0.mtmod"),
        fetched("companion", "otmetki.companion_0.2.0.mtmod"),
        fetched("damage_log", "net.triotmetki.damage_log_0.2.0.mtmod"),
    ];

    apply_packages(ApplyInput { context, modpack_version: "0.2.0", packages: &packages, disabled: &disabled }).unwrap();

    let installation = read_installation(context).unwrap();

    assert_eq!(enabled, BTreeSet::from(["companion".to_owned(), "core".to_owned()]));
    assert!(client.mods_dir.join("net.triotmetki.core_0.2.0.mtmod").exists());
    assert!(!client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod").exists());
    assert!(disabled_dir(&client_dir).join("net.triotmetki.damage_log_0.2.0.mtmod").exists());
    assert!(!disabled_dir(&client_dir).join("net.triotmetki.damage_log_0.1.0.mtmod").exists());
    assert_eq!(installation.modpack_version.as_deref(), Some("0.2.0"));
    assert!(installation.components.iter().all(|component| component.state != ComponentState::Missing));
}

#[test]
fn a_tampered_package_leaves_the_install_untouched() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.46.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };
    let mut tampered = fetched("core", "net.triotmetki.core_0.2.0.mtmod");

    tampered.bytes = b"evil".to_vec();

    let result = apply_packages(ApplyInput { context, modpack_version: "0.2.0", packages: &[tampered], disabled: &BTreeSet::new() });

    assert!(result.is_err());
    assert!(!client.mods_dir.join("net.triotmetki.core_0.2.0.mtmod").exists());
}

#[test]
fn a_requested_component_is_enabled_with_its_dependencies() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.46.0.0");
    let client_dir = root.path().join("state");
    let catalog = catalog();
    let context = ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog };

    fs::create_dir_all(disabled_dir(&client_dir)).unwrap();
    fs::write(disabled_dir(&client_dir).join("net.triotmetki.damage_log_0.1.0.mtmod"), "old").unwrap();

    let (enabled, disabled) = install_targets(context, &["hit_log".to_owned()]).unwrap();

    assert!(enabled.contains("hit_log"));
    assert!(enabled.contains("damage_log"));
    assert!(disabled.is_empty());
}

#[test]
fn serialises_the_status_for_the_ui() {
    let status = PatchStatus::Waiting { game_version: "1.46.0.0".into(), from: "1.45.0.0".into() };

    assert_eq!(serde_json::to_value(&status).unwrap(), serde_json::json!({ "kind": "waiting", "gameVersion": "1.46.0.0", "from": "1.45.0.0" }));
    assert_eq!(status.kind(), "waiting");
}
