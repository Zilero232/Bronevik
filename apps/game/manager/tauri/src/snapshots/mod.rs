use std::fs;
use std::path::{Path, PathBuf};

use chrono::{DateTime, Local};
use ini::Ini;
use serde::Serialize;

use crate::detect::GameClient;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::fsx::{copy_dir, dir_size, mirror_dir, remove_path};
use crate::ini_file;
use crate::paths::configs_dir;

pub const BACKUPS_DIR: &str = "backups";
pub const SNAPSHOT_INI: &str = "snapshot.ini";
pub const SECTION: &str = "snapshot";
pub const KEEP_SNAPSHOTS: usize = 3;
pub const ID_FORMAT: &str = "%Y%m%d-%H%M%S";
pub const DATE_FORMAT: &str = "%Y-%m-%d %H:%M:%S";
pub const PART_NAMES: [&str; 3] = ["mods", "res_mods", "configs"];

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SnapshotPart {
    pub name: String,
    pub target: PathBuf,
    pub existed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Snapshot {
    pub id: String,
    pub date: String,
    pub size_bytes: u64,
    pub parts: Vec<SnapshotPart>,
}

pub fn backups_dir(client_dir: &Path) -> PathBuf {
    client_dir.join(BACKUPS_DIR)
}

fn part_targets(client: &GameClient) -> [(&'static str, PathBuf); 3] {
    [(PART_NAMES[0], client.mods_dir.clone()), (PART_NAMES[1], client.res_mods_dir.clone()), (PART_NAMES[2], configs_dir(&client.path))]
}

fn read_snapshot(dir: &Path) -> Option<Snapshot> {
    let ini = ini_file::read(&dir.join(SNAPSHOT_INI)).ok()??;
    let parts = PART_NAMES
        .iter()
        .filter_map(|name| {
            let target = ini_file::get(&ini, SECTION, name).filter(|target| !target.is_empty())?;

            Some(SnapshotPart {
                name: (*name).to_owned(),
                target: PathBuf::from(target),
                existed: ini_file::get_bool(&ini, SECTION, &format!("{name}_exists")),
            })
        })
        .collect();

    Some(Snapshot {
        id: dir.file_name()?.to_string_lossy().into_owned(),
        date: ini_file::get(&ini, SECTION, "date").unwrap_or_default().to_owned(),
        size_bytes: dir_size(dir),
        parts,
    })
}

pub fn list(client_dir: &Path) -> Vec<Snapshot> {
    let mut snapshots: Vec<Snapshot> = fs::read_dir(backups_dir(client_dir))
        .map(|entries| entries.filter_map(Result::ok).filter_map(|entry| read_snapshot(&entry.path())).collect())
        .unwrap_or_default();

    snapshots.sort_by(|left, right| right.id.cmp(&left.id));
    snapshots
}

fn unique_id(client_dir: &Path, now: DateTime<Local>) -> String {
    let base = now.format(ID_FORMAT).to_string();
    let backups = backups_dir(client_dir);

    (1..).map(|attempt| if attempt == 1 { base.clone() } else { format!("{base}-{attempt}") }).find(|id| !backups.join(id).exists()).unwrap_or(base)
}

pub struct CreateInput<'a> {
    pub client_dir: &'a Path,
    pub client: &'a GameClient,
    pub now: DateTime<Local>,
}

pub fn create(input: CreateInput) -> AppResult<Snapshot> {
    let id = unique_id(input.client_dir, input.now);
    let dir = backups_dir(input.client_dir).join(&id);
    let mut ini = Ini::new();

    fs::create_dir_all(&dir)?;
    ini.with_section(Some(SECTION)).set("client", input.client.path.to_string_lossy()).set("date", input.now.format(DATE_FORMAT).to_string());

    for (name, source) in part_targets(input.client) {
        let exists = source.is_dir();

        ini.with_section(Some(SECTION)).set(name, source.to_string_lossy()).set(format!("{name}_exists"), if exists { "1" } else { "0" });

        if exists {
            if let Err(error) = copy_dir(&source, &dir.join(name)) {
                remove_path(&dir)?;

                return Err(AppError::coded(ErrorCode::SnapshotFailed, error.to_string()));
            }
        }
    }

    ini_file::write(&dir.join(SNAPSHOT_INI), &ini)?;

    read_snapshot(&dir).ok_or_else(|| AppError::coded(ErrorCode::SnapshotFailed, "snapshot.ini unreadable"))
}

fn snapshot_dir(client_dir: &Path, id: &str) -> AppResult<PathBuf> {
    let dir = backups_dir(client_dir).join(id);
    let valid_name = !id.is_empty() && id.chars().all(|c| c.is_ascii_digit() || c == '-');

    if !valid_name || !dir.join(SNAPSHOT_INI).is_file() {
        return Err(AppError::coded(ErrorCode::SnapshotMissing, format!("no snapshot {id}")));
    }

    Ok(dir)
}

pub fn restore(client_dir: &Path, id: &str) -> AppResult<Snapshot> {
    let dir = snapshot_dir(client_dir, id)?;
    let snapshot = read_snapshot(&dir).ok_or_else(|| AppError::coded(ErrorCode::SnapshotMissing, id.to_owned()))?;

    for part in &snapshot.parts {
        let source = dir.join(&part.name);

        if part.existed {
            if source.is_dir() {
                mirror_dir(&source, &part.target)?;
            } else {
                fs::create_dir_all(&part.target)?;
            }
        } else if part.target.exists() {
            remove_path(&part.target)?;
        }
    }

    Ok(snapshot)
}

pub fn delete(client_dir: &Path, id: &str) -> AppResult<()> {
    remove_path(&snapshot_dir(client_dir, id)?)
}

pub fn prune(client_dir: &Path, keep: usize) -> AppResult<Vec<String>> {
    let removed: Vec<String> = list(client_dir).into_iter().skip(keep).map(|snapshot| snapshot.id).collect();

    for id in &removed {
        remove_path(&backups_dir(client_dir).join(id))?;
    }

    Ok(removed)
}

#[cfg(test)]
mod tests;
