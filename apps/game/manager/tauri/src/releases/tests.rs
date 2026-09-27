use std::fs;

use super::fixtures::release;
use super::*;

#[test]
fn verifies_a_sha256_case_insensitively() {
    let digest = sha256_hex(b"mtmod");

    assert!(verify_sha256(b"mtmod", &digest.to_uppercase()).is_ok());
    assert_eq!(verify_sha256(b"tampered", &digest).unwrap_err().code(), ErrorCode::ChecksumMismatch);
}

#[test]
fn writes_only_a_verified_download() {
    let dir = tempfile::tempdir().unwrap();
    let target = dir.path().join("Моды");
    let good = write_verified(WriteVerifiedInput { dir: &target, file_name: "a.mtmod", bytes: b"a", sha256: &sha256_hex(b"a") }).unwrap();
    let bad = write_verified(WriteVerifiedInput { dir: &target, file_name: "b.mtmod", bytes: b"b", sha256: &sha256_hex(b"a") });

    assert_eq!(fs::read(good).unwrap(), b"a");
    assert!(bad.is_err());
    assert!(!target.join("b.mtmod").exists());
    assert!(!target.join(format!("b.mtmod{PART_SUFFIX}")).exists());
}

#[test]
fn refuses_package_names_that_leave_the_folder() {
    assert!(safe_file_name("../evil.mtmod").is_err());
    assert!(safe_file_name(r"C:\evil.mtmod").is_err());
    assert!(safe_file_name("net.triotmetki.core_0.2.0.mtmod").is_ok());
}

#[test]
fn reads_the_server_contract() {
    let parsed: LatestRelease = serde_json::from_str(
        r#"{"game":"1.46.0.0","status":"compatible","release":{"version":"0.2.0","publishedAt":"2026-09-27T12:00:00.000Z","games":["1.46.*"],"notes":{"ru":"Исправления","en":"Fixes"},"catalog":{"url":"https://cdn.triotmetki.ru/c.json","sha256":"ab"},"packages":[{"id":"core","file":"net.triotmetki.core_0.2.0.mtmod","url":"https://cdn.triotmetki.ru/core.mtmod","sha256":"ab","size":10}]}}"#,
    )
    .unwrap();

    assert_eq!(parsed.status, ReleaseStatus::Compatible);
    assert_eq!(parsed.release.unwrap().package("core").unwrap().size, 10);
}

#[test]
fn finds_a_release_package_by_component() {
    assert!(release("0.2.0").package("companion").is_some());
    assert!(release("0.2.0").package("minimap").is_none());
}
