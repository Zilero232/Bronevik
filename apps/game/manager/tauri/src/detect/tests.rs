use std::fs;
use std::path::PathBuf;

use super::client::{parse_paths_xml, parse_version_xml, Branch, ClientProblem};
use super::fixtures::{lesta_client_dir, write_lgc, write_paths_xml, write_version_xml};
use super::lgc::{parse_preferences, LgcPreferences};
use super::*;

#[test]
fn parses_the_version_and_realm_from_version_xml() {
    let (version, realm) =
        parse_version_xml("<version.xml><version>\tv.1.45.0.0 #8259\t</version><meta><realm> RU </realm></meta></version.xml>").unwrap();

    assert_eq!(version.to_string(), "1.45.0.0");
    assert_eq!(realm.as_deref(), Some("RU"));
}

#[test]
fn orders_game_versions_numerically() {
    let older = GameVersion::parse("1.9.0.0").unwrap();
    let newer = GameVersion::parse("1.45.0").unwrap();

    assert!(older < newer);
    assert_eq!(newer.to_string(), "1.45.0.0");
    assert!(GameVersion::parse("garbage").is_none());
}

#[test]
fn supports_lesta_clients_from_1_35_on() {
    assert!(GameVersion::parse("1.35.0.0").unwrap().is_supported());
    assert!(!GameVersion::parse("1.34.9.0").unwrap().is_supported());
    assert!(!GameVersion::parse("2.4.1.0").unwrap().is_supported());
}

#[test]
fn reads_mods_and_res_mods_from_paths_xml() {
    let paths = parse_paths_xml("<root><Paths><Path>./res_mods/1.45.0.0</Path><Packages><Root>./mods/1.45.0.0</Root><Mask>*.mtmod</Mask></Packages><Path>./res</Path></Paths></root>");

    assert_eq!(paths.mods.as_deref(), Some("./mods/1.45.0.0"));
    assert_eq!(paths.res_mods.as_deref(), Some("./res_mods/1.45.0.0"));
    assert_eq!(paths.mask.as_deref(), Some("*.mtmod"));
}

#[test]
fn inspects_a_lesta_client_in_a_cyrillic_folder() {
    let root = tempfile::tempdir().unwrap();
    let dir = lesta_client_dir(root.path(), "Игры/Мир танков", "1.45.0.0");
    let client = inspect(&dir, ClientSource::Manual).unwrap();

    assert_eq!(client.version.to_string(), "1.45.0.0");
    assert_eq!(client.mods_dir, dir.join("mods").join("1.45.0.0"));
    assert_eq!(client.res_mods_dir, dir.join("res_mods").join("1.45.0.0"));
    assert_eq!(client.branch, Branch::Release);
    assert_eq!(client.problem, None);
}

#[test]
fn falls_back_to_the_versioned_mods_folder_without_paths_xml() {
    let root = tempfile::tempdir().unwrap();
    let dir = root.path().join("client");

    write_version_xml(&dir, "1.45.0.0", "RU");

    let client = inspect(&dir, ClientSource::Manual).unwrap();

    assert_eq!(client.mods_dir, dir.join("mods").join("1.45.0.0"));
}

#[test]
fn flags_wargaming_and_old_clients() {
    let root = tempfile::tempdir().unwrap();
    let wg = root.path().join("wg");
    let old = root.path().join("old");

    write_version_xml(&wg, "2.4.1.0", "EU");
    write_version_xml(&old, "1.30.0.0", "RU");

    assert_eq!(inspect(&wg, ClientSource::Manual).unwrap().problem, Some(ClientProblem::NotLesta));
    assert_eq!(inspect(&old, ClientSource::Manual).unwrap().problem, Some(ClientProblem::OldVersion));
}

#[test]
fn marks_the_common_test_client() {
    let root = tempfile::tempdir().unwrap();
    let dir = root.path().join("ct");

    write_version_xml(&dir, "1.46.0.0", "RPT");
    write_paths_xml(&dir, "1.46.0.0");

    assert_eq!(inspect(&dir, ClientSource::Manual).unwrap().branch, Branch::CommonTest);
}

#[test]
fn an_empty_folder_is_not_a_client() {
    let root = tempfile::tempdir().unwrap();

    assert!(inspect(root.path(), ClientSource::Manual).is_none());
}

#[test]
fn detects_every_lgc_client_and_the_preferred_one() {
    let root = tempfile::tempdir().unwrap();
    let release = lesta_client_dir(root.path(), "Мир танков", "1.45.0.0");
    let common_test = lesta_client_dir(root.path(), "Общий тест", "1.46.0.0");
    let program_data = root.path().join("ProgramData");

    write_lgc(&program_data, &root.path().join("Lesta Game Center"), &[&release, &common_test], Some(&common_test));

    let clients = detect_clients(DetectInput { program_data: &program_data, manual: &[] });

    assert_eq!(clients.len(), 2);
    assert!(!clients[0].preferred);
    assert!(clients[1].preferred);
    assert_eq!(default_client(&clients, None).unwrap().path, common_test);
}

#[test]
fn adds_manual_clients_once() {
    let root = tempfile::tempdir().unwrap();
    let release = lesta_client_dir(root.path(), "Tanki", "1.45.0.0");
    let program_data = root.path().join("ProgramData");

    write_lgc(&program_data, &root.path().join("lgc"), &[&release], None);

    let manual = vec![release.clone(), root.path().join("nothing-here")];
    let clients = detect_clients(DetectInput { program_data: &program_data, manual: &manual });

    assert_eq!(clients.len(), 1);
    assert_eq!(clients[0].source, ClientSource::Lgc);
}

#[test]
fn works_without_lesta_game_center() {
    let root = tempfile::tempdir().unwrap();

    assert!(detect_clients(DetectInput { program_data: root.path(), manual: &[] }).is_empty());
}

#[test]
fn reads_lgc_path_dat_pointing_at_the_executable() {
    let root = tempfile::tempdir().unwrap();
    let lgc = root.path().join("Lesta").join("GameCenter");
    let data = root.path().join("Lesta").join("GameCenter").join("data");

    fs::create_dir_all(&data).unwrap();
    fs::write(data.join("lgc_path.dat"), lgc.join("lgc.exe").display().to_string()).unwrap();

    assert_eq!(lgc_dir(root.path()), Some(PathBuf::from(&lgc)));
}

#[test]
fn tolerates_broken_preferences() {
    assert_eq!(parse_preferences("<not xml"), LgcPreferences::default());
}
