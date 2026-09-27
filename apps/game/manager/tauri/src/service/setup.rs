use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::Manager;
use crate::catalog::{Catalog, LoadedCatalog, Localized};
use crate::components::{read_installation, Installation};
use crate::detect::GameClient;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::install::{self, owned_patterns_catalog, ForeignEntry, InstallInput, UninstallInput};
use crate::patch::{fetch_packages, FetchedPackage};
use crate::process::ensure_closed;
use crate::releases::{sha256_hex, Release, ReleasePackage, ReleaseStatus};
use crate::snapshots;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum PackageSource {
    Bundled,
    Release,
    Unavailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseSummary {
    pub version: String,
    pub notes: Option<Localized>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InstallPlan {
    pub client: GameClient,
    pub catalog: Option<LoadedCatalog>,
    pub release: Option<ReleaseSummary>,
    pub source: PackageSource,
    pub other_mods: Vec<ForeignEntry>,
    pub installed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InstallRequest {
    pub client_path: Option<PathBuf>,
    pub components: Vec<String>,
    #[serde(default)]
    pub remove_others: Vec<PathBuf>,
    #[serde(default = "take_snapshot_default")]
    pub take_snapshot: bool,
}

fn take_snapshot_default() -> bool {
    true
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UninstallRequest {
    pub client_path: Option<PathBuf>,
    #[serde(default)]
    pub restore_snapshot: bool,
    #[serde(default)]
    pub remove_config: bool,
}

fn bundled_packages(dir: &Path, catalog: &Catalog, ids: &BTreeSet<String>) -> Option<Vec<FetchedPackage>> {
    ids.iter()
        .map(|id| {
            let component = catalog.component(id)?;
            let bytes = fs::read(dir.join(&component.file)).ok()?;
            let actual = sha256_hex(&bytes);

            if component.sha256.as_deref().is_some_and(|expected| !expected.eq_ignore_ascii_case(&actual)) {
                return None;
            }

            Some(FetchedPackage {
                package: ReleasePackage {
                    id: id.clone(),
                    file: component.file.clone(),
                    url: String::new(),
                    size: bytes.len() as u64,
                    sha256: actual,
                },
                bytes,
            })
        })
        .collect()
}

impl Manager {
    async fn compatible_release(&self, client: &GameClient) -> Option<Release> {
        let latest = self.releases.latest(&client.version.to_string()).await.ok()?;

        latest.release.filter(|_| latest.status == ReleaseStatus::Compatible)
    }

    fn bundled_available(&self, catalog: &Catalog) -> bool {
        let ids: BTreeSet<String> = catalog.components.iter().map(|component| component.id.clone()).collect();

        !ids.is_empty() && self.bundled.packages.as_deref().is_some_and(|dir| bundled_packages(dir, catalog, &ids).is_some())
    }

    pub async fn prepare_install(&self, client_path: Option<&Path>) -> AppResult<InstallPlan> {
        let client = self.client(client_path)?;
        let release = self.compatible_release(&client).await;

        if let Some(release) = &release {
            if let Err(error) = self.refresh_catalog(release).await {
                log::warn!("catalog refresh: {error}");
            }
        }

        let catalog = self.catalog();
        let bundled = catalog.as_ref().is_some_and(|loaded| self.bundled_available(&loaded.catalog));
        let source = match (bundled, &release) {
            (true, _) => PackageSource::Bundled,
            (false, Some(_)) => PackageSource::Release,
            (false, None) => PackageSource::Unavailable,
        };
        let owned = owned_patterns_catalog(catalog.as_ref().map(|loaded| loaded.catalog.clone()));
        let installed = crate::state::Manifest::read(&self.layout.client_dir(&client.path))?.is_some();

        Ok(InstallPlan {
            other_mods: install::other_mods(&client, &owned),
            release: release.map(|release| ReleaseSummary { version: release.version, notes: release.notes }),
            client,
            catalog,
            source,
            installed,
        })
    }

    pub async fn install_modpack(&self, request: InstallRequest) -> AppResult<Installation> {
        let scope = self.scope(request.client_path.as_deref())?;

        ensure_closed(&scope.client.path)?;

        let catalog = &scope.catalog.catalog;
        let ids = install::selection(catalog, &request.components)?;
        let bundled = self.bundled.packages.as_deref().and_then(|dir| bundled_packages(dir, catalog, &ids));
        let (packages, version) = match bundled {
            Some(packages) => (packages, catalog.modpack_version.clone()),
            None => {
                let release = self
                    .compatible_release(&scope.client)
                    .await
                    .ok_or_else(|| AppError::coded(ErrorCode::ReleaseUnavailable, "no release supports this client yet"))?;

                if let Some(absent) = ids.iter().find(|id| release.package(id).is_none()) {
                    return Err(AppError::coded(ErrorCode::ReleaseUnavailable, format!("the release has no package {absent}")));
                }

                (fetch_packages(&self.releases, &release, &ids).await?, release.version)
            }
        };

        install::install(InstallInput {
            context: scope.context(),
            packages: &packages,
            modpack_version: &version,
            remove_others: &request.remove_others,
            take_snapshot: request.take_snapshot,
        })?;

        read_installation(scope.context())
    }

    pub fn uninstall_modpack(&self, request: &UninstallRequest) -> AppResult<()> {
        let client = self.client(request.client_path.as_deref())?;
        let client_dir = self.layout.client_dir(&client.path);
        let catalog = owned_patterns_catalog(self.catalog().map(|loaded| loaded.catalog));
        let latest = snapshots::list(&client_dir).into_iter().next().map(|snapshot| snapshot.id);

        ensure_closed(&client.path)?;

        install::uninstall(UninstallInput {
            context: crate::components::ClientContext { client_dir: &client_dir, client: &client, catalog: &catalog },
            restore_snapshot: latest.as_deref().filter(|_| request.restore_snapshot),
            remove_config: request.remove_config,
        })
    }
}
