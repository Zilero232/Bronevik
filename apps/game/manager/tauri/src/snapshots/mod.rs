use std::fs;
use std::path::{Path, PathBuf};

use chrono::{DateTime, Local};
use ini::Ini;
use serde::Serialize;

use crate::catalog::Catalog;
use crate::components::{is_owned, sync_manifest, ClientContext};
use crate::detect::GameClient;
use crate::durable::refresh_stamps;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::fsx::{available_space, copy_dir, copy_file, copy_verified, dir_size, list_files, mirror_dir, remove_path};
use crate::ini_file;
use crate::paths::configs_dir;
use crate::state::{disabled_dir, Manifest};

pub const BACKUPS_DIR: &str = "backups";
pub const SNAPSHOT_INI: &str = "snapshot.ini";
pub const SECTION: &str = "snapshot";
pub const KEEP_AUTO_SNAPSHOTS: usize = 3;
pub const KEEP_MANUAL_SNAPSHOTS: usize = 10;
pub const ID_FORMAT: &str = "%Y%m%d-%H%M%S";
pub const DATE_FORMAT: &str = "%Y-%m-%d %H:%M:%S";
pub const SPACE_MARGIN_BYTES: u64 = 64 * 1024 * 1024;
pub const MODS_PART: &str = "mods";
pub const RES_MODS_PART: &str = "res_mods";
pub const MODPACK_PART: &str = "modpack";
pub const DISABLED_PART: &str = "disabled";
pub const CONFIGS_PART: &str = "configs";
pub const REMOVED_PART: &str = "removed";
pub const PART_NAMES: [&str; 6] = [MODS_PART, RES_MODS_PART, MODPACK_PART, DISABLED_PART, CONFIGS_PART, REMOVED_PART];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum SnapshotKind {
    Auto,
    Manual,
}

impl SnapshotKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Auto => "auto",
            Self::Manual => "manual",
        }
    }

    fn parse(text: Option<&str>) -> Self {
        match text {
            Some("manual") => Self::Manual,
            _ => Self::Auto,
        }
    }

    pub fn keep(self) -> usize {
        match self {
            Self::Auto => KEEP_AUTO_SNAPSHOTS,
            Self::Manual => KEEP_MANUAL_SNAPSHOTS,
        }
    }
}

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
    pub kind: SnapshotKind,
    pub size_bytes: u64,
    pub parts: Vec<SnapshotPart>,
}

pub fn backups_dir(client_dir: &Path) -> PathBuf {
    client_dir.join(BACKUPS_DIR)
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
        kind: SnapshotKind::parse(ini_file::get(&ini, SECTION, "kind")),
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
    pub context: ClientContext<'a>,
    pub kind: SnapshotKind,
    pub removed: &'a [PathBuf],
    pub now: DateTime<Local>,
}

fn our_packages(client: &GameClient, catalog: &Catalog) -> Vec<PathBuf> {
    list_files(&client.mods_dir).into_iter().filter(|path| path.file_name().is_some_and(|name| is_owned(catalog, &name.to_string_lossy()))).collect()
}

fn removed_location(client: &GameClient, path: &Path) -> &'static str {
    if path.starts_with(&client.res_mods_dir) {
        RES_MODS_PART
    } else {
        MODS_PART
    }
}

fn entry_size(path: &Path) -> u64 {
    if path.is_dir() {
        dir_size(path)
    } else {
        fs::metadata(path).map(|metadata| metadata.len()).unwrap_or_default()
    }
}

pub fn required_space(input: &CreateInput) -> u64 {
    let context = input.context;
    let packages: u64 = our_packages(context.client, context.catalog).iter().map(|path| entry_size(path)).sum();
    let removed: u64 = input.removed.iter().map(|path| entry_size(path)).sum();

    packages + removed + dir_size(&disabled_dir(context.client_dir)) + dir_size(&configs_dir(&context.client.path))
}

fn ensure_space(input: &CreateInput) -> AppResult<()> {
    let needed = required_space(input) + SPACE_MARGIN_BYTES;

    match available_space(input.context.client_dir) {
        Some(available) if available < needed => {
            Err(AppError::coded(ErrorCode::NotEnoughSpace, format!("a snapshot needs {needed} bytes, {available} are free")))
        }
        _ => Ok(()),
    }
}

fn copy_entry(from: &Path, to: &Path) -> AppResult<()> {
    if from.is_dir() {
        copy_dir(from, to)?;
    } else {
        if let Some(parent) = to.parent() {
            fs::create_dir_all(parent)?;
        }

        copy_file(from, to)?;
    }

    Ok(())
}

fn record(ini: &mut Ini, name: &str, target: &Path, exists: bool) {
    ini.with_section(Some(SECTION)).set(name, target.to_string_lossy()).set(format!("{name}_exists"), if exists { "1" } else { "0" });
}

fn fill(input: &CreateInput, dir: &Path, ini: &mut Ini) -> AppResult<()> {
    let context = input.context;
    let client = context.client;

    record(ini, MODPACK_PART, &client.mods_dir, client.mods_dir.is_dir());
    fs::create_dir_all(dir.join(MODPACK_PART))?;

    for package in our_packages(client, context.catalog) {
        if let Some(name) = package.file_name() {
            copy_file(&package, &dir.join(MODPACK_PART).join(name))?;
        }
    }

    for (name, source) in [(DISABLED_PART, disabled_dir(context.client_dir)), (CONFIGS_PART, configs_dir(&client.path))] {
        let exists = source.is_dir();

        record(ini, name, &source, exists);

        if exists {
            copy_dir(&source, &dir.join(name))?;
        }
    }

    record(ini, REMOVED_PART, &client.path, !input.removed.is_empty());

    for path in input.removed {
        if let Some(name) = path.file_name() {
            copy_entry(path, &dir.join(REMOVED_PART).join(removed_location(client, path)).join(name))?;
        }
    }

    Ok(())
}

pub fn create(input: CreateInput) -> AppResult<Snapshot> {
    ensure_space(&input)?;

    let client_dir = input.context.client_dir;
    let id = unique_id(client_dir, input.now);
    let dir = backups_dir(client_dir).join(&id);
    let modpack = Manifest::read(client_dir)?.map(|manifest| manifest.modpack).unwrap_or_default();
    let mut ini = Ini::new();

    fs::create_dir_all(&dir)?;
    ini.with_section(Some(SECTION))
        .set("client", input.context.client.path.to_string_lossy())
        .set("date", input.now.format(DATE_FORMAT).to_string())
        .set("kind", input.kind.as_str())
        .set("modpack_version", modpack);

    if let Err(error) = fill(&input, &dir, &mut ini).and_then(|()| ini_file::write(&dir.join(SNAPSHOT_INI), &ini)) {
        remove_path(&dir)?;

        return Err(AppError::coded(ErrorCode::SnapshotFailed, error.to_string()));
    }

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

pub struct RestoreInput<'a> {
    pub context: ClientContext<'a>,
    pub durable_dir: &'a Path,
    pub id: &'a str,
}

fn restore_missing(source: &Path, target: &Path) -> AppResult<()> {
    if !source.is_dir() {
        return Ok(());
    }

    for entry in fs::read_dir(source)?.filter_map(Result::ok) {
        let destination = target.join(entry.file_name());

        if !destination.exists() {
            copy_entry(&entry.path(), &destination)?;
        }
    }

    Ok(())
}

fn restore_packages(context: ClientContext, source: &Path, with_foreign: bool) -> AppResult<()> {
    let mods_dir = &context.client.mods_dir;

    for path in our_packages(context.client, context.catalog) {
        remove_path(&path)?;
    }

    fs::create_dir_all(mods_dir)?;

    for file in list_files(source) {
        let Some(name) = file.file_name() else {
            continue;
        };

        if is_owned(context.catalog, &name.to_string_lossy()) {
            copy_verified(&file, &mods_dir.join(name))?;
        }
    }

    if with_foreign {
        restore_missing(source, mods_dir)?;
    }

    Ok(())
}

fn restore_part(input: &RestoreInput, dir: &Path, part: &SnapshotPart) -> AppResult<()> {
    let context = input.context;
    let client = context.client;
    let source = dir.join(&part.name);

    match part.name.as_str() {
        MODS_PART | MODPACK_PART if part.existed => restore_packages(context, &source, part.name == MODS_PART),
        RES_MODS_PART if part.existed => restore_missing(&source, &client.res_mods_dir),
        DISABLED_PART if part.existed && source.is_dir() => mirror_dir(&source, &disabled_dir(context.client_dir)),
        DISABLED_PART => remove_path(&disabled_dir(context.client_dir)),
        CONFIGS_PART if part.existed && source.is_dir() => {
            let configs = configs_dir(&client.path);

            mirror_dir(&source, &configs)?;
            refresh_stamps(&configs, input.durable_dir)?;

            Ok(())
        }
        REMOVED_PART => {
            restore_missing(&source.join(MODS_PART), &client.mods_dir)?;
            restore_missing(&source.join(RES_MODS_PART), &client.res_mods_dir)
        }
        _ => Ok(()),
    }
}

pub fn restore(input: RestoreInput) -> AppResult<Snapshot> {
    let client_dir = input.context.client_dir;
    let dir = snapshot_dir(client_dir, input.id)?;
    let snapshot = read_snapshot(&dir).ok_or_else(|| AppError::coded(ErrorCode::SnapshotMissing, input.id.to_owned()))?;

    for part in &snapshot.parts {
        restore_part(&input, &dir, part)?;
    }

    let recorded = ini_file::read(&dir.join(SNAPSHOT_INI))?
        .and_then(|ini| ini_file::get(&ini, SECTION, "modpack_version").map(str::to_owned))
        .filter(|version| !version.is_empty());

    if let Some(mut manifest) = Manifest::read(client_dir)? {
        if let Some(version) = recorded {
            manifest.modpack = version;
            manifest.write(client_dir)?;
        }

        sync_manifest(input.context)?;
    }

    Ok(snapshot)
}

pub fn delete(client_dir: &Path, id: &str) -> AppResult<()> {
    remove_path(&snapshot_dir(client_dir, id)?)
}

pub fn prune(client_dir: &Path, kind: SnapshotKind) -> AppResult<Vec<String>> {
    let removed: Vec<String> =
        list(client_dir).into_iter().filter(|snapshot| snapshot.kind == kind).skip(kind.keep()).map(|snapshot| snapshot.id).collect();

    for id in &removed {
        remove_path(&backups_dir(client_dir).join(id))?;
    }

    Ok(removed)
}

pub fn create_and_prune(input: CreateInput) -> AppResult<Snapshot> {
    let client_dir = input.context.client_dir;
    let kind = input.kind;
    let snapshot = create(input)?;

    prune(client_dir, kind)?;

    Ok(snapshot)
}

#[cfg(test)]
mod tests;
