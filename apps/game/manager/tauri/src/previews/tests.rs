use std::fs;

use super::*;
use crate::catalog::fixtures::catalog_json;

#[test]
fn accepts_only_media_files_directly_in_the_previews_folder() {
    assert!(is_preview_file("previews/core.png"));
    assert!(is_preview_file("previews/session_stats.ogg"));
    assert!(!is_preview_file("previews/../core.png"));
    assert!(!is_preview_file("previews/nested/core.png"));
    assert!(!is_preview_file("other/core.png"));
    assert!(!is_preview_file("previews/core.exe"));
    assert!(!is_preview_file("core.png"));
    assert!(!is_preview_file("previews/con.png"));
}

#[test]
fn lists_each_image_and_sound_of_the_catalog_once() {
    let mut json = catalog_json();

    json["components"][0]["preview"]["audio"] = "previews/core.ogg".into();
    json["components"][1]["preview"]["image"] = "../escape.png".into();

    let catalog: Catalog = serde_json::from_value(json).unwrap();
    let listed = files(&catalog);

    assert!(listed.contains(&"previews/core.png".to_owned()));
    assert!(listed.contains(&"previews/core.ogg".to_owned()));
    assert!(listed.iter().all(|file| is_preview_file(file)));
    assert_eq!(listed.len(), listed.iter().collect::<BTreeSet<_>>().len());
}

#[test]
fn resolves_a_preview_next_to_the_catalogue() {
    assert_eq!(
        url("https://triotmetki.ru/downloads/modpack/0.1.0/catalog/components.json", "previews/core.png").as_deref(),
        Some("https://triotmetki.ru/downloads/modpack/0.1.0/catalog/previews/core.png")
    );
    assert_eq!(url("https://triotmetki.ru/c/components.json?v=2", "previews/a.png").as_deref(), Some("https://triotmetki.ru/c/previews/a.png"));
}

#[test]
fn downloads_only_the_missing_previews_unless_the_catalogue_changed() {
    let root = tempfile::tempdir().unwrap();
    let manager = root.path().join("Игрок").join("manager");
    let files = vec!["previews/core.png".to_owned(), "previews/hud.png".to_owned()];

    fs::create_dir_all(manager.join(DIR)).unwrap();
    fs::write(manager.join(DIR).join("core.png"), b"png").unwrap();

    assert_eq!(pending(PendingInput { root: &manager, files: files.clone(), refresh: false }), vec!["previews/hud.png".to_owned()]);
    assert_eq!(pending(PendingInput { root: &manager, files: files.clone(), refresh: true }), files);
}
