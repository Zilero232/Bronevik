use std::fs;

use super::fixtures::{catalog, catalog_json};
use super::*;

#[test]
fn parses_the_setupkit_components_json() {
    let parsed = parse(&catalog_json().to_string()).unwrap();

    assert_eq!(parsed, catalog());
    assert_eq!(parsed.components.len(), 5);
}

#[test]
fn closes_over_dependencies_transitively() {
    let ids = catalog().with_dependencies(["hit_log"]);

    assert_eq!(ids, BTreeSet::from(["companion", "core", "damage_log", "hit_log"].map(String::from)));
}

#[test]
fn closes_over_dependents_transitively() {
    let ids = catalog().with_dependents("damage_log");

    assert_eq!(ids, BTreeSet::from(["damage_log", "hit_log"].map(String::from)));
}

#[test]
fn drops_unknown_ids_from_the_closure() {
    assert!(catalog().with_dependencies(["nope"]).is_empty());
}

#[test]
fn recognises_our_packages_by_mask() {
    let catalog = catalog();

    assert!(catalog.is_owned_file("net.triotmetki.core_0.1.0.mtmod"));
    assert!(catalog.is_owned_file("OTMETKI.companion_0.2.0.MTMOD"));
    assert!(!catalog.is_owned_file("izeberg.modssettingsapi_1.6.0.mtmod"));
}

#[test]
fn finds_the_component_of_any_version_of_its_file() {
    let catalog = catalog();

    assert_eq!(catalog.component_for_file("net.triotmetki.marks_panel_0.0.9.mtmod").map(|c| c.id.as_str()), Some("marks_panel"));
    assert_eq!(catalog.component_for_file("net.triotmetki.marks_panel_0.0.9.wotmod"), None);
    assert_eq!(catalog.component_for_file("otmetki.0.1.0.mtmod"), None);
}

#[test]
fn matches_wildcards_like_inno() {
    assert!(wildcard_match("net.triotmetki.*.mtmod", "net.triotmetki.a_1.mtmod"));
    assert!(wildcard_match("*", ""));
    assert!(wildcard_match("a?c", "abc"));
    assert!(!wildcard_match("a*d", "abc"));
}

#[test]
fn prefers_the_newer_of_the_downloaded_and_bundled_catalogs() {
    let dir = tempfile::tempdir().unwrap();
    let cache = dir.path().join("cache.json");
    let bundled = dir.path().join("bundled.json");
    let mut newer = catalog_json();

    newer["modpackVersion"] = "0.2.0".into();
    fs::write(&cache, catalog_json().to_string()).unwrap();
    fs::write(&bundled, newer.to_string()).unwrap();

    let loaded = load(LoadInput { cache: &cache, bundled: Some(&bundled) }).unwrap();

    assert_eq!(loaded.source, CatalogSource::Bundled);
    assert_eq!(loaded.catalog.modpack_version, "0.2.0");
}

#[test]
fn falls_back_to_the_bundled_catalog_without_a_download() {
    let dir = tempfile::tempdir().unwrap();
    let bundled = dir.path().join("bundled.json");

    fs::write(&bundled, catalog_json().to_string()).unwrap();

    let loaded = load(LoadInput { cache: &dir.path().join("absent.json"), bundled: Some(&bundled) }).unwrap();

    assert_eq!(loaded.source, CatalogSource::Bundled);
}

#[test]
fn has_no_catalog_when_nothing_parses() {
    let dir = tempfile::tempdir().unwrap();
    let broken = dir.path().join("broken.json");

    fs::write(&broken, "{").unwrap();

    assert!(load(LoadInput { cache: &broken, bundled: None }).is_none());
}
