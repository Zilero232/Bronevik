use std::fs;

use super::*;

#[test]
fn defaults_to_autostart_and_a_half_hour_check() {
    let settings = ManagerSettings::default();

    assert!(settings.autostart);
    assert!(settings.auto_migrate);
    assert!(CHECK_INTERVAL_MINUTES.contains(&settings.check_interval_minutes));
}

#[test]
fn falls_back_to_defaults_for_a_missing_or_broken_file() {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("settings.json");

    assert_eq!(ManagerSettings::load(&path), ManagerSettings::default());

    fs::write(&path, "{").unwrap();

    assert_eq!(ManagerSettings::load(&path), ManagerSettings::default());
}

#[test]
fn keeps_known_fields_and_fixes_an_unknown_interval() {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("settings.json");

    fs::write(&path, r#"{"autostart":false,"checkIntervalMinutes":7,"selectedClient":"D:\\Игры\\Танки"}"#).unwrap();

    let settings = ManagerSettings::load(&path);

    assert!(!settings.autostart);
    assert_eq!(settings.check_interval_minutes, DEFAULT_CHECK_INTERVAL);
    assert_eq!(settings.selected_client, Some(PathBuf::from(r"D:\Игры\Танки")));
}

#[test]
fn round_trips_through_disk() {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("nested").join("settings.json");
    let settings = ManagerSettings { language: Language::En, check_interval_minutes: 60, ..ManagerSettings::default() };

    settings.save(&path).unwrap();

    assert_eq!(ManagerSettings::load(&path), settings);
}

#[test]
fn resolves_the_automatic_language_from_the_system() {
    assert_eq!(Language::Auto.resolve(Some("ru-RU")), Locale::Ru);
    assert_eq!(Language::Auto.resolve(Some("en-US")), Locale::En);
    assert_eq!(Language::Auto.resolve(None), Locale::Ru);
    assert_eq!(Language::En.resolve(Some("ru-RU")), Locale::En);
}
