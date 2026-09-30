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
    assert!(wildcard_match("NET.TriOtmetki.*.MTMOD", "net.triotmetki.a_1.mtmod"));
}

#[test]
fn loads_the_downloaded_catalog() {
    let dir = tempfile::tempdir().unwrap();
    let cache = dir.path().join("cache.json");

    fs::write(&cache, catalog_json().to_string()).unwrap();

    assert_eq!(load(&cache).unwrap().catalog, catalog());
}

#[test]
fn has_no_catalog_before_the_first_download() {
    let dir = tempfile::tempdir().unwrap();

    assert!(load(&dir.path().join("absent.json")).is_none());
}

#[test]
fn has_no_catalog_when_nothing_parses() {
    let dir = tempfile::tempdir().unwrap();
    let broken = dir.path().join("broken.json");

    fs::write(&broken, "{").unwrap();

    assert!(load(&broken).is_none());
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
fn keeps_only_owned_paths_inside_the_game_folders() {
    let mut paths = catalog_json();

    paths["ownedPaths"] = json!(["gui/gameface/mods/triotmetki/", "", "../x/", "/abs/", "\\\\server\\share\\", "C:/Windows/", "c:x/"]);

    assert_eq!(parse(&paths.to_string()).unwrap().owned_paths, vec!["gui/gameface/mods/triotmetki/"]);
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
    assert!(!gameface.optional);
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
fn keeps_the_optional_flag_of_a_dependency() {
    let mut optional = catalog_json();

    optional["components"][6]["optional"] = json!(true);

    let parsed = parse(&optional.to_string()).unwrap();

    assert!(parsed.dependency("guiflash").unwrap().optional);
    assert!(!parsed.dependency("openwg_gameface").unwrap().optional);
    assert_eq!(serde_json::to_value(&parsed).unwrap()["dependencies"][1]["optional"], true);
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
fn accepts_the_optional_modslist_pin_saved_as_mtmod() {
    let mut catalog = catalog_json();

    catalog["components"].as_array_mut().unwrap().push(json!({
        "id": "modslist",
        "kind": "dependency",
        "packageId": "me.poliroid.modslistapi",
        "version": "1.6.01",
        "file": "me.poliroid.modslistapi_1.6.01.mtmod",
        "title": { "ru": "ModsList", "en": "ModsList" },
        "author": { "name": "poliroid (Andrii Andruschyshyn)", "url": "https://gitlab.com/wot-public-mods/mods-list" },
        "licence": {
            "name": "MIT",
            "url": "https://gitlab.com/wot-public-mods/mods-list/-/raw/v1.6.01/LICENSE.md",
            "sha256": "c67ed29b3f80fa7b99e6fc16490fa1710353fb7ead042c276e8dccd2dbeedb5f"
        },
        "sourceUrl": "https://gitlab.com/-/project/26509092/uploads/9705f0b2627e9a074ecac2e84f38c9ca/me.poliroid.modslistapi_1.6.01.wotmod",
        "sha256": "b312adfcd005405d49b711e79b4032be7d624b6e38d4156364d1c04bc5dba71f",
        "size": 79776,
        "requiredBy": ["ui"],
        "optional": true,
        "restartRequired": false
    }));

    let parsed = parse(&catalog.to_string()).unwrap();
    let modslist = parsed.dependency("modslist").unwrap();

    assert!(modslist.optional);
    assert!(crate::releases::is_dependency_source(&modslist.source_url));
    assert!(crate::releases::is_dependency_source(&modslist.licence.url));
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

    let ids: Vec<&str> = dependencies.iter().map(|dependency| dependency.id.as_str()).collect();

    assert!(["openwg_gameface", "guiflash"].iter().all(|id| ids.contains(id)), "{ids:?}");

    for dependency in &dependencies {
        assert!(is_valid_dependency(dependency), "{}", dependency.id);
        assert!(crate::releases::is_dependency_source(&dependency.source_url), "{}", dependency.source_url);
        assert!(crate::releases::is_dependency_source(&dependency.licence.url), "{}", dependency.licence.url);
        assert!(!dependency.required_by.is_empty());
    }
}
