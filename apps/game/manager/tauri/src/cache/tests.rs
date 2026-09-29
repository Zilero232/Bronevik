use std::fs;
use std::path::Path;

use super::*;
use crate::detect::fixtures::lesta_client;

fn write(path: &Path, bytes: usize) {
    fs::create_dir_all(path.parent().unwrap()).unwrap();
    fs::write(path, vec![b'x'; bytes]).unwrap();
}

fn profile(app_data: &Path, name: &str) -> PathBuf {
    let dir = app_data.join(LESTA_FOLDER).join(name);

    write(&dir.join(PREFERENCES_XML), 10);
    dir
}

#[test]
fn lists_only_the_known_cache_folders_of_lesta_profiles_and_the_game() {
    let root = tempfile::tempdir().unwrap();
    let app_data = root.path().join("Роуминг");
    let client = lesta_client(root.path(), "1.45.0.0");
    let release = profile(&app_data, "MirTankov");

    write(&release.join("web_cache").join("a.bin"), 300);
    write(&release.join("dossier_cache").join("b.dat"), 20);
    write(&release.join("profile").join("cef_cache").join("GPUCache").join("data_0"), 5);
    write(&release.join("profile").join("cef_cache").join("Local Storage").join("x"), 5);
    write(&release.join("battle_results").join("r.dat"), 50);
    write(&release.join("mods").join("xvm.json"), 50);
    write(&release.join("xvm").join("cache.json"), 50);
    fs::create_dir_all(release.join("clan_cache")).unwrap();
    write(&app_data.join(LESTA_FOLDER).join("MirTankov_old").join("web_cache").join("x"), 5);
    write(&client.path.join("win64").join("Reports").join("crash.dmp"), 7);
    write(&client.path.join("replays").join("20260929_x.mtreplay"), 70);

    let plan = plan(PlanInput { app_data: &app_data, client: &client });
    let ids: Vec<&str> = plan.targets.iter().map(|target| target.id.as_str()).collect();

    assert_eq!(ids, vec!["MirTankov/web_cache", "MirTankov/dossier_cache", "MirTankov/profile/cef_cache/GPUCache", "game/win64/Reports"]);
    assert_eq!(plan.total_bytes, 332);
    assert_eq!(plan.targets[3].location, CacheLocation::Game);
}

#[test]
fn clears_the_chosen_folders_and_keeps_the_folders_themselves() {
    let root = tempfile::tempdir().unwrap();
    let app_data = root.path().join("AppData");
    let client = lesta_client(root.path(), "1.45.0.0");
    let release = profile(&app_data, "MirTankov");

    write(&release.join("web_cache").join("nested").join("a.bin"), 300);
    write(&release.join("dossier_cache").join("b.dat"), 20);

    let plan = plan(PlanInput { app_data: &app_data, client: &client });
    let result = clear(&plan, &["MirTankov/web_cache".to_owned(), "unknown".to_owned()]);

    assert_eq!(result, CacheResult { freed_bytes: 300, cleared: vec!["MirTankov/web_cache".into()], failed: vec![] });
    assert!(release.join("web_cache").is_dir());
    assert!(!release.join("web_cache").join("nested").exists());
    assert!(release.join("dossier_cache").join("b.dat").exists());
    assert!(release.join(PREFERENCES_XML).exists());
}

fn link_dir(target: &Path, link: &Path) {
    #[cfg(windows)]
    {
        let status = std::process::Command::new("cmd").arg("/C").arg("mklink").arg("/J").arg(link).arg(target).output().unwrap().status;

        assert!(status.success());
    }
    #[cfg(unix)]
    std::os::unix::fs::symlink(target, link).unwrap();
}

#[test]
fn never_follows_a_linked_folder_anywhere_on_the_way_to_a_cache() {
    let root = tempfile::tempdir().unwrap();
    let app_data = root.path().join("AppData");
    let client = lesta_client(root.path(), "1.45.0.0");
    let release = profile(&app_data, "MirTankov");
    let elsewhere = root.path().join("Мои документы");

    write(&elsewhere.join("web_cache").join("keep.txt"), 10);
    write(&elsewhere.join("cef_cache").join("GPUCache").join("keep.bin"), 10);
    write(&elsewhere.join(PREFERENCES_XML), 10);
    write(&elsewhere.join("Reports").join("keep.dmp"), 10);
    fs::create_dir_all(release.join("profile")).unwrap();
    link_dir(&elsewhere.join("cef_cache"), &release.join("profile").join("cef_cache"));
    link_dir(&elsewhere.join("web_cache"), &release.join("web_cache"));
    link_dir(&elsewhere, &app_data.join(LESTA_FOLDER).join("MirTankov_linked"));
    fs::create_dir_all(&client.path).unwrap();
    link_dir(&elsewhere, &client.path.join("win64"));
    write(&release.join("dossier_cache").join("b.dat"), 20);

    let plan = plan(PlanInput { app_data: &app_data, client: &client });
    let ids: Vec<&str> = plan.targets.iter().map(|target| target.id.as_str()).collect();

    assert_eq!(ids, vec!["MirTankov/dossier_cache"]);

    let forged = CachePlan {
        targets: vec![CacheTarget {
            id: "forged".into(),
            name: "web_cache".into(),
            location: CacheLocation::AppData,
            path: release.join("web_cache"),
            size_bytes: 10,
            files: 1,
        }],
        total_bytes: 10,
    };

    assert_eq!(clear(&forged, &["forged".to_owned()]).failed, vec!["forged".to_owned()]);
    assert!(elsewhere.join("web_cache").join("keep.txt").exists());
    assert!(elsewhere.join("cef_cache").join("GPUCache").join("keep.bin").exists());
    assert!(elsewhere.join("Reports").join("keep.dmp").exists());
}
