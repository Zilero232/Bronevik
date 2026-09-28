use serde_json::json;
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

#[test]
fn refuses_a_catalog_that_claims_foreign_packages() {
    let mut foreign = catalog_json();

    foreign["components"][0]["packageId"] = json!("izeberg");
    foreign["components"][0]["file"] = json!("izeberg_1.0.mtmod");

    let mut wide = catalog_json();

    wide["ownedPatterns"] = json!(["*", "*.mtmod", "net.triotmetki.*.mtmod"]);

    assert!(parse(&foreign.to_string()).is_err());
    assert_eq!(parse(&wide.to_string()).unwrap().owned_patterns, vec!["net.triotmetki.*.mtmod"]);
}

#[test]
fn splits_the_dependency_components_from_our_packages() {
    let parsed = parse(&catalog_json().to_string()).unwrap();
    let gameface = parsed.dependency("openwg_gameface").unwrap();

    assert_eq!(parsed.dependencies.len(), 2);
    assert!(parsed.component("openwg_gameface").is_none());
    assert_eq!(gameface.kind, DependencyKind::Dependency);
    assert_eq!(gameface.licence.name, "MIT");
    assert_eq!(gameface.required_by, vec!["marks_panel", "damage_log"]);
    assert!(!parsed.is_owned_file(&gameface.file));
    assert!(parsed.component_for_file("gambiter.guiflash_0.6.6.mtmod").is_none());
}

#[test]
fn round_trips_the_dependencies_through_the_ui_shape() {
    let parsed = parse(&catalog_json().to_string()).unwrap();
    let served = serde_json::to_value(&parsed).unwrap();

    assert_eq!(served["dependencies"][0]["kind"], "dependency");
    assert_eq!(serde_json::from_value::<Catalog>(served).unwrap(), parsed);
}

#[test]
fn skips_a_dependency_that_claims_our_names_or_has_no_pinned_hash() {
    let mut claimed = catalog_json();

    claimed["components"][5]["packageId"] = json!("net.triotmetki.core");
    claimed["components"][5]["file"] = json!("net.triotmetki.core_9.mtmod");
    claimed["components"][6]["sha256"] = json!("abc");

    let parsed = parse(&claimed.to_string()).unwrap();

    assert!(parsed.dependencies.is_empty());
    assert_eq!(parsed.components.len(), 5);
}

#[test]
fn accepts_the_dependencies_the_modpack_catalogue_pins() {
    let path = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../modpack/catalog/catalog.json");
    let raw: serde_json::Value = serde_json::from_str(&fs::read_to_string(path).unwrap()).unwrap();
    let dependencies: Vec<DependencyComponent> = raw["components"]
        .as_array()
        .unwrap()
        .iter()
        .filter(|entry| entry["kind"] == DEPENDENCY_KIND)
        .map(|entry| serde_json::from_value(entry.clone()).unwrap())
        .collect();

    assert_eq!(dependencies.iter().map(|dependency| dependency.id.as_str()).collect::<Vec<_>>(), vec!["openwg_gameface", "guiflash"]);

    for dependency in &dependencies {
        assert!(is_valid_dependency(dependency), "{}", dependency.id);
        assert!(crate::releases::is_dependency_source(&dependency.source_url), "{}", dependency.source_url);
        assert!(crate::releases::is_dependency_source(&dependency.licence.url), "{}", dependency.licence.url);
        assert!(!dependency.required_by.is_empty());
    }
}
