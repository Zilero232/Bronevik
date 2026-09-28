use std::fs;

use chrono::TimeZone;

use super::*;
use crate::detect::fixtures::lesta_client;

#[test]
fn bundles_the_diagnostics_but_never_the_credentials() {
    let root = tempfile::tempdir().unwrap();
    let client = lesta_client(root.path(), "1.45.0.0");
    let layout = Layout::new(root.path().join("Local"), root.path().join("Roaming"));
    let configs = configs_dir(&client.path);

    fs::create_dir_all(layout.logs_dir()).unwrap();
    fs::write(layout.logs_dir().join("manager.log"), "started").unwrap();
    fs::write(client.path.join("python.log"), "[OTMETKI] started").unwrap();
    fs::write(client.mods_dir.join("net.triotmetki.core_0.1.0.mtmod"), "x").unwrap();
    fs::create_dir_all(&configs).unwrap();
    fs::write(configs.join("config.json"), "{}").unwrap();
    fs::write(configs.join("credentials.json"), "secret").unwrap();

    let now = Local.with_ymd_and_hms(2026, 9, 28, 10, 0, 0).unwrap();
    let zip_path =
        collect(CollectInput {
            layout: &layout, clients: std::slice::from_ref(&client), output_dir: &root.path().join("Рабочий стол"), now
        })
        .unwrap();
    let archive = zip::ZipArchive::new(fs::File::open(&zip_path).unwrap()).unwrap();
    let names: Vec<String> = archive.file_names().map(str::to_owned).collect();
    let key = client_key(&client.path);

    assert!(zip_path.ends_with("otmetki-logs-20260928-100000.zip"));
    assert!(names.contains(&"manager/manager.log".to_owned()));
    assert!(names.contains(&format!("clients/{key}/python.log")));
    assert!(names.contains(&format!("clients/{key}/configs/config.json")));
    assert!(names.contains(&format!("clients/{key}/listing.txt")));
    assert!(names.iter().all(|name| !name.contains("credentials")));
}

#[test]
fn hides_the_bind_code_in_the_bundled_config() {
    let redacted: serde_json::Value = serde_json::from_slice(&redact_config(br#"{"bind_code":"ABCD-1234","enabled":true}"#)).unwrap();

    assert_eq!(redacted["bind_code"], REDACTED);
    assert_eq!(redacted["enabled"], true);
    assert_eq!(redact_config(b"not json"), b"not json");
}
