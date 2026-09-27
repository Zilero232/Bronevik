use ini::Ini;

use super::*;

#[test]
fn round_trips_cyrillic_paths_through_utf16() {
    let dir = tempfile::tempdir().unwrap();
    let file = dir.path().join("Состояние").join("client.ini");
    let mut ini = Ini::new();

    ini.with_section(Some("client")).set("path", r"D:\Игры\Мир танков");
    write(&file, &ini).unwrap();

    let bytes = std::fs::read(&file).unwrap();
    let read_back = read(&file).unwrap().unwrap();

    assert_eq!(&bytes[..2], &[0xFF, 0xFE]);
    assert_eq!(get(&read_back, "client", "path"), Some(r"D:\Игры\Мир танков"));
}

#[test]
fn keeps_backslashes_literal() {
    let ini = parse("[install]\r\nmods=D:\\Games\\Tanki\\mods\\1.45.0.0\r\n").unwrap();

    assert_eq!(get(&ini, "install", "mods"), Some(r"D:\Games\Tanki\mods\1.45.0.0"));
}

#[test]
fn reads_plain_utf8_with_a_bom() {
    let text = decode_text(b"\xEF\xBB\xBF[a]\nb=1\n");

    assert_eq!(text, "[a]\nb=1\n");
}

#[test]
fn reads_inno_booleans() {
    let ini = parse("[snapshot]\nmods_exists=1\nres_mods_exists=0\nconfigs_exists=true\n").unwrap();

    assert!(get_bool(&ini, "snapshot", "mods_exists"));
    assert!(!get_bool(&ini, "snapshot", "res_mods_exists"));
    assert!(get_bool(&ini, "snapshot", "configs_exists"));
    assert!(!get_bool(&ini, "snapshot", "missing"));
}

#[test]
fn a_missing_file_is_none() {
    let dir = tempfile::tempdir().unwrap();

    assert!(read(&dir.path().join("absent.ini")).unwrap().is_none());
}
