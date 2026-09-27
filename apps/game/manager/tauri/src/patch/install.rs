use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

use crate::components::{sync_manifest, ClientContext};
use crate::error::AppResult;
use crate::fsx::list_files;
use crate::releases::{write_verified, Release, ReleasePackage, ReleasesClient, WriteVerifiedInput};
use crate::state::{disabled_dir, save_client_state, Manifest};

#[derive(Debug, Clone)]
pub struct FetchedPackage {
    pub package: ReleasePackage,
    pub bytes: Vec<u8>,
}

pub fn install_targets(context: ClientContext, extra: &[String]) -> AppResult<(BTreeSet<String>, BTreeSet<String>)> {
    let catalog = context.catalog;
    let manifest = Manifest::read(context.client_dir)?;
    let parked: BTreeSet<String> = list_files(&disabled_dir(context.client_dir))
        .iter()
        .filter_map(|path| path.file_name())
        .filter_map(|name| catalog.component_for_file(&name.to_string_lossy()).map(|component| component.id.clone()))
        .chain(manifest.iter().flat_map(|manifest| manifest.disabled.clone()))
        .collect();
    let active: Vec<String> = list_files(&context.client.mods_dir)
        .iter()
        .filter_map(|path| path.file_name())
        .filter_map(|name| catalog.component_for_file(&name.to_string_lossy()).map(|component| component.id.clone()))
        .chain(manifest.iter().flat_map(Manifest::component_ids))
        .chain(extra.iter().cloned())
        .chain(catalog.components.iter().filter(|component| component.required).map(|component| component.id.clone()))
        .collect();
    let wanted = catalog.with_dependencies(extra.iter().map(String::as_str));
    let enabled: BTreeSet<String> =
        catalog.with_dependencies(active.iter().map(String::as_str)).into_iter().filter(|id| !parked.contains(id) || wanted.contains(id)).collect();
    let disabled = parked.into_iter().filter(|id| !enabled.contains(id)).collect();

    Ok((enabled, disabled))
}

pub async fn fetch_packages(client: &ReleasesClient, release: &Release, ids: &BTreeSet<String>) -> AppResult<Vec<FetchedPackage>> {
    let mut fetched = Vec::new();

    for package in release.packages.iter().filter(|package| ids.contains(&package.id)) {
        let bytes = client.fetch(&package.url).await?;

        crate::releases::verify_sha256(&bytes, &package.sha256)?;
        fetched.push(FetchedPackage { package: package.clone(), bytes });
    }

    Ok(fetched)
}

pub struct ApplyInput<'a> {
    pub context: ClientContext<'a>,
    pub modpack_version: &'a str,
    pub packages: &'a [FetchedPackage],
    pub disabled: &'a BTreeSet<String>,
}

fn stale_versions(dir: &Path, input: &ApplyInput, package: &ReleasePackage) -> Vec<PathBuf> {
    list_files(dir)
        .into_iter()
        .filter(|path| {
            let name = path.file_name().map(|name| name.to_string_lossy().into_owned()).unwrap_or_default();

            name != package.file && input.context.catalog.component_for_file(&name).is_some_and(|component| component.id == package.id)
        })
        .collect()
}

pub fn apply_packages(input: ApplyInput) -> AppResult<Vec<String>> {
    let mods_dir = input.context.client.mods_dir.clone();
    let parked_dir = disabled_dir(input.context.client_dir);
    let mut written = Vec::new();

    for fetched in input.packages {
        let package = &fetched.package;
        let target = if input.disabled.contains(&package.id) { &parked_dir } else { &mods_dir };

        write_verified(WriteVerifiedInput { dir: target, file_name: &package.file, bytes: &fetched.bytes, sha256: &package.sha256 })?;

        for stale in [&mods_dir, &parked_dir].into_iter().flat_map(|dir| stale_versions(dir, &input, package)) {
            fs::remove_file(stale)?;
        }

        written.push(package.id.clone());
    }

    let mut manifest = sync_manifest(input.context)?;

    manifest.modpack = input.modpack_version.to_owned();
    manifest.date = crate::components::now_text();
    manifest.write(input.context.client_dir)?;
    save_client_state(input.context.client_dir, input.context.client)?;

    Ok(written)
}
