mod profile_ini;

use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

use serde::Serialize;

pub use profile_ini::read_component_profile;

use crate::catalog::Catalog;
use crate::components::ClientContext;
use crate::detect::GameClient;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::fsx::{list_files, remove_path};
use crate::patch::{apply_packages, ApplyInput, FetchedPackage};
use crate::paths::{configs_dir, same_path};
use crate::releases::verify_sha256;
use crate::snapshots::{self, CreateInput, KEEP_SNAPSHOTS};
use crate::state::{disabled_dir, Manifest, CLIENT_INI};

pub const DEFAULT_OWNED_PATTERNS: [&str; 4] = ["net.triotmetki.*.mtmod", "net.triotmetki.*.wotmod", "otmetki.*.mtmod", "otmetki.*.wotmod"];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum ForeignLocation {
    Mods,
    ResMods,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ForeignEntry {
    pub path: PathBuf,
    pub name: String,
    pub is_dir: bool,
    pub location: ForeignLocation,
}

fn entries(dir: &Path) -> Vec<(PathBuf, String, bool)> {
    fs::read_dir(dir)
        .map(|entries| {
            entries
                .filter_map(Result::ok)
                .map(|entry| {
                    let is_dir = entry.file_type().is_ok_and(|kind| kind.is_dir());

                    (entry.path(), entry.file_name().to_string_lossy().into_owned(), is_dir)
                })
                .collect()
        })
        .unwrap_or_default()
}

pub fn is_owned(catalog: &Catalog, name: &str) -> bool {
    catalog.is_owned_file(name) || catalog.component_for_file(name).is_some()
}

pub fn other_mods(client: &GameClient, catalog: &Catalog) -> Vec<ForeignEntry> {
    let in_mods = entries(&client.mods_dir).into_iter().filter(|(_, name, _)| !is_owned(catalog, name)).map(|(path, name, is_dir)| ForeignEntry {
        path,
        name,
        is_dir,
        location: ForeignLocation::Mods,
    });
    let in_res_mods =
        entries(&client.res_mods_dir).into_iter().map(|(path, name, is_dir)| ForeignEntry { path, name, is_dir, location: ForeignLocation::ResMods });
    let mut found: Vec<ForeignEntry> = in_mods.chain(in_res_mods).collect();

    found.sort_by(|left, right| left.path.cmp(&right.path));
    found
}

pub fn remove_other_mods(client: &GameClient, catalog: &Catalog, reviewed: &[PathBuf]) -> AppResult<Vec<PathBuf>> {
    let current = other_mods(client, catalog);
    let mut removed = Vec::new();

    for path in reviewed {
        if !current.iter().any(|entry| same_path(&entry.path, path)) {
            return Err(AppError::coded(ErrorCode::InvalidPath, format!("{} is not in the reviewed list", path.display())));
        }
    }

    for path in reviewed {
        remove_path(path)?;
        removed.push(path.clone());
    }

    Ok(removed)
}

pub fn remove_our_files(context: ClientContext) -> AppResult<Vec<PathBuf>> {
    let catalog = context.catalog;
    let manifest_files = Manifest::read(context.client_dir)?.map(|manifest| manifest.files).unwrap_or_default();
    let in_mods = list_files(&context.client.mods_dir);
    let mut removed = Vec::new();

    for path in manifest_files.iter().chain(in_mods.iter()) {
        let name = path.file_name().map(|name| name.to_string_lossy().into_owned()).unwrap_or_default();

        if path.is_file() && is_owned(catalog, &name) {
            remove_path(path)?;
            removed.push(path.clone());
        }
    }

    remove_path(&disabled_dir(context.client_dir))?;

    Ok(removed)
}

pub struct InstallInput<'a> {
    pub context: ClientContext<'a>,
    pub packages: &'a [FetchedPackage],
    pub modpack_version: &'a str,
    pub remove_others: &'a [PathBuf],
    pub take_snapshot: bool,
}

pub fn install(input: InstallInput) -> AppResult<Vec<String>> {
    let context = input.context;
    let wants_snapshot = input.take_snapshot || !input.remove_others.is_empty();

    for fetched in input.packages {
        verify_sha256(&fetched.bytes, &fetched.package.sha256)?;
    }

    if wants_snapshot && (context.client.mods_dir.is_dir() || configs_dir(&context.client.path).is_dir()) {
        snapshots::create(CreateInput { client_dir: context.client_dir, client: context.client, now: chrono::Local::now() })?;
        snapshots::prune(context.client_dir, KEEP_SNAPSHOTS)?;
    }

    remove_our_files(context)?;
    remove_other_mods(context.client, context.catalog, input.remove_others)?;
    fs::create_dir_all(&context.client.mods_dir)?;

    if let Some(mut manifest) = Manifest::read(context.client_dir)? {
        manifest.components.clear();
        manifest.write(context.client_dir)?;
    }

    apply_packages(ApplyInput { context, modpack_version: input.modpack_version, packages: input.packages, disabled: &BTreeSet::new() })
}

pub fn selection(catalog: &Catalog, requested: &[String]) -> AppResult<BTreeSet<String>> {
    if let Some(unknown) = requested.iter().find(|id| catalog.component(id).is_none()) {
        return Err(AppError::coded(ErrorCode::UnknownComponent, format!("unknown component {unknown}")));
    }

    let required = catalog.components.iter().filter(|component| component.required).map(|component| component.id.as_str());

    Ok(catalog.with_dependencies(requested.iter().map(String::as_str).chain(required)))
}

pub struct UninstallInput<'a> {
    pub context: ClientContext<'a>,
    pub restore_snapshot: Option<&'a str>,
    pub remove_config: bool,
}

pub fn uninstall(input: UninstallInput) -> AppResult<()> {
    if let Some(id) = input.restore_snapshot {
        snapshots::restore(input.context.client_dir, id)?;
    }

    remove_our_files(input.context)?;

    if input.remove_config {
        remove_path(&configs_dir(&input.context.client.path))?;
    }

    remove_path(input.context.client_dir)
}

pub fn uninstall_everywhere(clients_dir: &Path, catalog: &Catalog) -> Vec<PathBuf> {
    let state_dirs: Vec<PathBuf> = fs::read_dir(clients_dir)
        .map(|entries| entries.filter_map(Result::ok).map(|entry| entry.path()).filter(|path| path.is_dir()).collect())
        .unwrap_or_default();
    let mut cleaned = Vec::new();

    for state_dir in state_dirs {
        let recorded = crate::ini_file::read(&state_dir.join(CLIENT_INI))
            .ok()
            .flatten()
            .and_then(|ini| crate::ini_file::get(&ini, "client", "path").map(PathBuf::from));
        let client = recorded.as_deref().and_then(|path| crate::detect::inspect(path, crate::detect::ClientSource::Manual));

        if let Some(client) = &client {
            let context = ClientContext { client_dir: &state_dir, client, catalog };

            if remove_our_files(context).is_ok() {
                cleaned.push(client.path.clone());
            }
        }

        if let Err(error) = remove_path(&state_dir) {
            log::warn!("uninstall: {}: {error}", state_dir.display());
        }
    }

    cleaned
}

pub fn owned_patterns_catalog(catalog: Option<Catalog>) -> Catalog {
    let mut catalog = catalog.unwrap_or(Catalog {
        schema_version: 1,
        modpack_version: String::new(),
        platform: String::new(),
        extension: String::new(),
        categories: Vec::new(),
        presets: Vec::new(),
        components: Vec::new(),
        owned_patterns: Vec::new(),
    });

    if catalog.owned_patterns.is_empty() {
        catalog.owned_patterns = DEFAULT_OWNED_PATTERNS.iter().map(|pattern| (*pattern).to_owned()).collect();
    }

    catalog
}

#[cfg(test)]
mod tests;
