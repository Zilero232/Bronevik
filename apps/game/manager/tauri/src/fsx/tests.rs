use std::fs;
use std::path::Path;

use super::*;

fn write(path: &Path, text: &str) {
    fs::create_dir_all(path.parent().unwrap()).unwrap();
    fs::write(path, text).unwrap();
}

#[test]
fn refuses_to_delete_roots_and_relative_paths() {
    assert!(ensure_removable(Path::new(r"C:\")).is_err());
    assert!(ensure_removable(Path::new("relative")).is_err());
}

#[test]
fn mirrors_a_folder_exactly() {
    let dir = tempfile::tempdir().unwrap();
    let source = dir.path().join("снимок");
    let target = dir.path().join("моды");

    write(&source.join("a.mtmod"), "a");
    write(&source.join("sub").join("b.txt"), "b");
    write(&target.join("stale.mtmod"), "stale");

    mirror_dir(&source, &target).unwrap();

    assert_eq!(fs::read_to_string(target.join("a.mtmod")).unwrap(), "a");
    assert_eq!(fs::read_to_string(target.join("sub").join("b.txt")).unwrap(), "b");
    assert!(!target.join("stale.mtmod").exists());
    assert!(!dir.path().join(format!("моды{STAGING_SUFFIX}")).exists());
    assert!(!dir.path().join(format!("моды{RETIRED_SUFFIX}")).exists());
}

#[test]
fn moves_a_file_over_an_existing_one() {
    let dir = tempfile::tempdir().unwrap();
    let from = dir.path().join("from").join("x.mtmod");
    let to = dir.path().join("to").join("x.mtmod");

    write(&from, "new");
    write(&to, "old");
    move_file(&from, &to).unwrap();

    assert!(!from.exists());
    assert_eq!(fs::read_to_string(&to).unwrap(), "new");
}

#[test]
fn copies_a_tree_and_counts_its_bytes() {
    let dir = tempfile::tempdir().unwrap();
    let source = dir.path().join("source");

    write(&source.join("one"), "12");
    write(&source.join("deep").join("two"), "345");

    assert_eq!(copy_dir(&source, &dir.path().join("copy")).unwrap(), 5);
    assert_eq!(dir_size(&dir.path().join("copy")), 5);
}

#[test]
fn lists_only_the_files_of_a_folder() {
    let dir = tempfile::tempdir().unwrap();

    write(&dir.path().join("file"), "");
    fs::create_dir_all(dir.path().join("folder")).unwrap();

    assert_eq!(list_files(dir.path()), vec![dir.path().join("file")]);
    assert!(list_files(&dir.path().join("absent")).is_empty());
}
