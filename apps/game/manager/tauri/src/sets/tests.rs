use std::fs;

use super::codec::CODE_PREFIX;
use super::*;
use crate::error::ErrorCode;

fn ids(items: &[&str]) -> Vec<String> {
    items.iter().map(|item| (*item).to_owned()).collect()
}

fn store(root: &std::path::Path) -> SetStore {
    SetStore::new(root.join("Роуминг").join("manager").join(FILE_NAME))
}

#[test]
fn saves_renames_duplicates_and_deletes_sets() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let saved = store.update(|file| file.add("  Мой   стрим ", &ids(&["core", "marks_panel", "marks_panel", "Bad-Id", "damage_log"]))).unwrap();

    assert_eq!(saved.name, "Мой стрим");
    assert_eq!(saved.components, ids(&["core", "marks_panel", "damage_log"]));

    store.update(|file| file.rename(&saved.id, "Турнир")).unwrap();

    let copy = store.update(|file| file.duplicate(&saved.id, "Турнир (копия)")).unwrap();
    let file = store.load();

    assert_eq!(file.sets.iter().map(|set| set.name.as_str()).collect::<Vec<_>>(), vec!["Турнир", "Турнир (копия)"]);
    assert_eq!(file.get(&copy.id).unwrap().components, saved.components);
    assert_ne!(copy.id, saved.id);

    store.update(|file| file.remove(&saved.id)).unwrap();

    let file = store.load();

    assert_eq!(file.sets.len(), 1);
    assert_eq!(file.deleted[0].id, saved.id);
    assert_eq!(store.update(|file| file.remove(&saved.id)).unwrap_err().code(), ErrorCode::SetMissing);
}

#[test]
fn keeps_at_most_twelve_sets_and_refuses_empty_names() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());

    for index in 0..MAX_SETS {
        store.update(|file| file.add(&format!("Набор {index}"), &ids(&["core"]))).unwrap();
    }

    assert_eq!(store.update(|file| file.add("Лишний", &ids(&["core"]))).unwrap_err().code(), ErrorCode::SetLimit);
    let first = store.load().sets[0].id.clone();

    assert_eq!(store.update(|file| file.rename(&first, "   ")).unwrap_err().code(), ErrorCode::SetName);
    assert_eq!(store.load().view().max, MAX_SETS);
}

#[test]
fn codes_round_trip_and_reject_foreign_text() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let saved = store.update(|file| file.add("ПТ", &ids(&["core", "reload_timer"]))).unwrap();
    let code = store.export_code(&saved.id).unwrap();

    assert!(code.starts_with(CODE_PREFIX));
    assert_eq!(decode(&code).unwrap(), ("ПТ".to_owned(), ids(&["core", "reload_timer"])));

    let imported = store.import_code(&code, Some("ПТ на ноуте")).unwrap();

    assert_eq!(imported.name, "ПТ на ноуте");
    assert_eq!(decode("TM1.abc").unwrap_err().code(), ErrorCode::SetCode);
    assert_eq!(decode(&encode("x", &ids(&["Bad-Id"])).unwrap()).unwrap_err().code(), ErrorCode::SetCode);
}

#[test]
fn exports_and_imports_a_set_file_or_the_whole_library() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let saved = store.update(|file| file.add("Минимум", &ids(&["core", "sixth_sense"]))).unwrap();
    let single = root.path().join("Минимум.tmset");
    let library = root.path().join("все.json");

    store.export_file(&saved.id, &single).unwrap();
    store.export_library(&library).unwrap();

    let text = fs::read_to_string(&single).unwrap();

    assert!(text.contains("\"format\": \"triotmetki-component-set\""));

    let other = SetStore::new(root.path().join("другой").join(FILE_NAME));

    other.import_file(&single).unwrap();
    other.import_file(&library).unwrap();

    let names: Vec<String> = other.load().sets.into_iter().map(|set| set.name).collect();

    assert_eq!(names, vec!["Минимум", "Минимум"]);
    fs::write(root.path().join("code.txt"), store.export_code(&saved.id).unwrap()).unwrap();
    other.import_file(&root.path().join("code.txt")).unwrap();
    assert_eq!(other.load().sets.len(), 3);
    fs::write(root.path().join("junk.tmset"), "{\"format\":\"other\",\"version\":1,\"name\":\"x\",\"components\":[\"core\"]}").unwrap();
    assert_eq!(other.import_file(&root.path().join("junk.tmset")).unwrap_err().code(), ErrorCode::SetCode);
}

#[test]
fn merging_keeps_the_newest_copy_and_honours_deletions() {
    let set =
        |id: &str, name: &str, updated: f64| ComponentSet { id: id.into(), name: name.into(), components: ids(&["core"]), created: 1.0, updated };
    let local = SetsFile {
        sets: vec![set("a", "Локальный", 5.0), set("b", "Удалённый позже", 2.0)],
        deleted: vec![Tombstone { id: "c".into(), deleted: 9.0 }],
        ..SetsFile::default()
    };
    let remote = SetsFile {
        sets: vec![set("a", "С сайта", 7.0), set("c", "Удалён", 8.0), set("d", "Новый", 3.0)],
        deleted: vec![Tombstone { id: "b".into(), deleted: 4.0 }],
        synced_at: Some(10.0),
        ..SetsFile::default()
    };
    let merged = merge(&local, &remote);

    assert_eq!(merged.sets.iter().map(|set| (set.id.as_str(), set.name.as_str())).collect::<Vec<_>>(), vec![("a", "С сайта"), ("d", "Новый")]);
    assert_eq!(merged.deleted.iter().map(|tombstone| tombstone.id.as_str()).collect::<Vec<_>>(), vec!["b", "c"]);
    assert_eq!(merged.synced_at, Some(10.0));
}

#[test]
fn an_imported_library_is_checked_like_our_own_sets() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let long_id = "a".repeat(MAX_ID_LENGTH + 1);
    let mut sets = vec![
        serde_json::json!({ "id": "ok", "name": "  Турнир  ", "components": ["core", long_id, "Bad"], "created": 1.0, "updated": 1.0 }),
        serde_json::json!({ "id": "ok", "name": "Двойник", "components": ["core"], "created": 1.0, "updated": 1.0 }),
        serde_json::json!({ "id": "../x", "name": "Путь", "components": ["core"], "created": 1.0, "updated": 1.0 }),
        serde_json::json!({ "id": "blank", "name": "   ", "components": ["core"], "created": 1.0, "updated": 1.0 }),
    ];

    sets.extend(
        (0..20)
            .map(|index| serde_json::json!({ "id": format!("s{index}"), "name": "x".repeat(500), "components": [], "created": 2.0, "updated": 2.0 })),
    );

    let library = root.path().join("library.json");

    fs::write(&library, serde_json::json!({ "version": 1, "sets": sets, "deleted": [{ "id": "", "deleted": 1.0 }] }).to_string()).unwrap();
    store.import_file(&library).unwrap();

    let file = store.load();
    let first = file.get("ok").unwrap();

    assert_eq!(file.sets.len(), MAX_SETS);
    assert_eq!((first.name.as_str(), first.components.clone()), ("Турнир", ids(&["core"])));
    assert!(file.sets.iter().all(|set| is_set_id(&set.id) && set.name.chars().count() <= NAME_MAX_LENGTH));
    assert!(file.deleted.is_empty());
}

#[test]
fn a_damaged_sets_file_is_kept_aside_not_overwritten() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());

    fs::create_dir_all(store.path.parent().unwrap()).unwrap();
    fs::write(&store.path, "{ \"sets\": [").unwrap();

    assert!(store.load().sets.is_empty());

    store.update(|file| file.add("Новый", &ids(&["core"]))).unwrap();

    assert_eq!(fs::read_to_string(crate::fsx::sibling(&store.path, DAMAGED_SUFFIX)).unwrap(), "{ \"sets\": [");
    assert_eq!(store.load().sets.len(), 1);

    fs::write(&store.path, [0xff, 0xfe, b'{']).unwrap();
    store.update(|file| file.add("Ещё", &ids(&["core"]))).unwrap();

    assert_eq!(fs::read(crate::fsx::sibling(&store.path, DAMAGED_SUFFIX)).unwrap(), vec![0xff, 0xfe, b'{']);
}

#[test]
fn exports_get_their_extension_and_oversized_imports_are_refused() {
    let root = tempfile::tempdir().unwrap();
    let store = store(root.path());
    let saved = store.update(|file| file.add("Набор", &ids(&["core"]))).unwrap();

    store.export_file(&saved.id, &root.path().join("game.exe")).unwrap();
    store.export_library(&root.path().join("все")).unwrap();

    assert!(root.path().join("game.exe.tmset").is_file() && !root.path().join("game.exe").exists());
    assert!(root.path().join("все.json").is_file());
    assert_eq!(with_extension(&root.path().join("a.TMSET"), SET_EXTENSION), root.path().join("a.TMSET"));

    let big = root.path().join("big.tmset");

    fs::write(&big, vec![b' '; usize::try_from(MAX_FILE_BYTES).unwrap() + 1]).unwrap();

    assert_eq!(store.import_file(&big).unwrap_err().code(), ErrorCode::SetCode);
}
