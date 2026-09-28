use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::Manager;
use crate::catalog::{read_catalog, Catalog, LoadedCatalog, Localized};
use crate::components::{read_installation, ClientContext, ComponentState, Installation};
use crate::dependencies::{self, DependencyState, DependencyStatus, DownloadPlanInput, FetchedDependency, InstallDependenciesInput, ResolveInput};
use crate::detect::GameClient;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::install::{self, installed_elsewhere, owned_patterns_catalog, ForeignEntry, InstallInput, UninstallInput};
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
    pub current_components: Vec<String>,
    pub parked_components: Vec<String>,
    pub dependencies: Vec<DependencyStatus>,
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
    #[serde(default)]
    pub excluded_dependencies: Vec<String>,
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

pub struct BundledSet {
    pub packages: Vec<FetchedPackage>,
    pub version: String,
}

pub fn bundled_packages(dir: &Path, catalog: &Catalog, ids: &BTreeSet<String>) -> Option<Vec<FetchedPackage>> {
    ids.iter()
        .map(|id| {
            let component = catalog.component(id)?;
            let expected = component.sha256.as_deref()?;
            let bytes = fs::read(dir.join(&component.file)).ok()?;
            let actual = sha256_hex(&bytes);

            if !expected.eq_ignore_ascii_case(&actual) {
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

pub struct BundledInput<'a> {
    pub catalog_file: Option<&'a Path>,
    pub packages_dir: Option<&'a Path>,
    pub in_use: &'a Catalog,
    pub ids: &'a BTreeSet<String>,
}

pub fn bundled_set(input: BundledInput) -> Option<BundledSet> {
    let bundled = read_catalog(input.catalog_file?)?;

    if input.ids.is_empty() || bundled.modpack_version != input.in_use.modpack_version {
        return None;
    }

    let packages = bundled_packages(input.packages_dir?, &bundled, input.ids)?;

    Some(BundledSet { packages, version: bundled.modpack_version })
}

fn without_owned_dependencies(others: Vec<ForeignEntry>, statuses: &[DependencyStatus]) -> Vec<ForeignEntry> {
    let owned: Vec<&str> = statuses
        .iter()
        .filter(|status| matches!(status.state, DependencyState::Ours | DependencyState::Outdated))
        .filter_map(|status| status.file.as_deref())
        .collect();

    others.into_iter().filter(|entry| !owned.iter().any(|file| entry.name.eq_ignore_ascii_case(file))).collect()
}

fn components_in(installation: &Installation, state: Option<ComponentState>) -> Vec<String> {
    installation
        .components
        .iter()
        .filter(|component| component.state != ComponentState::Missing && state.is_none_or(|state| component.state == state))
        .map(|component| component.id.clone())
        .collect()
}

impl Manager {
    async fn compatible_release(&self, client: &GameClient) -> Option<Release> {
        let latest = self.releases.latest(&client.version.to_string()).await.ok()?;

        latest.release.filter(|_| latest.status == ReleaseStatus::Compatible)
    }

    pub(super) async fn fetch_dependencies(&self, input: DownloadPlanInput<'_>) -> AppResult<Vec<FetchedDependency>> {
        let downloads = dependencies::to_download(input)?;

        dependencies::fetch(&self.releases, &downloads).await
    }

    fn bundled_for(&self, catalog: &Catalog, ids: &BTreeSet<String>) -> Option<BundledSet> {
        bundled_set(BundledInput {
            catalog_file: self.bundled.catalog.as_deref(),
            packages_dir: self.bundled.packages.as_deref(),
            in_use: catalog,
            ids,
        })
    }

    pub async fn prepare_install(&self, client_path: Option<&Path>) -> AppResult<InstallPlan> {
        let client = self.client(client_path)?;
        let release = self.compatible_release(&client).await;

        if let Some(release) = &release {
            let refreshed = match self.try_write_guard() {
                Ok(_guard) => self.refresh_catalog(release).await,
                Err(error) => Err(error),
            };

            if let Err(error) = refreshed {
                log::warn!("catalog refresh: {error}");
            }
        }

        let catalog = self.catalog();
        let bundled = catalog.as_ref().is_some_and(|loaded| {
            let ids: BTreeSet<String> = loaded.catalog.components.iter().map(|component| component.id.clone()).collect();

            self.bundled_for(&loaded.catalog, &ids).is_some()
        });
        let source = match (bundled, &release) {
            (true, _) => PackageSource::Bundled,
            (false, Some(_)) => PackageSource::Release,
            (false, None) => PackageSource::Unavailable,
        };
        let owned = owned_patterns_catalog(catalog.as_ref().map(|loaded| loaded.catalog.clone()));
        let client_dir = self.layout.client_dir(&client.path);
        let installed = crate::state::Manifest::read(&client_dir)?.is_some();
        let installation = catalog
            .as_ref()
            .map(|loaded| read_installation(ClientContext { client_dir: &client_dir, client: &client, catalog: &loaded.catalog }))
            .transpose()?;
        let dependency_statuses = catalog
            .as_ref()
            .map(|loaded| dependencies::statuses(ClientContext { client_dir: &client_dir, client: &client, catalog: &loaded.catalog }))
            .transpose()?
            .unwrap_or_default();

        Ok(InstallPlan {
            other_mods: without_owned_dependencies(install::other_mods(&client, &owned), &dependency_statuses),
            dependencies: dependency_statuses,
            release: release.map(|release| ReleaseSummary { version: release.version, notes: release.notes }),
            current_components: installation.as_ref().map(|installation| components_in(installation, None)).unwrap_or_default(),
            parked_components: installation
                .as_ref()
                .map(|installation| components_in(installation, Some(ComponentState::Disabled)))
                .unwrap_or_default(),
            client,
            catalog,
            source,
            installed,
        })
    }

    pub async fn install_modpack(&self, request: InstallRequest) -> AppResult<Installation> {
        let _guard = self.write_guard().await?;
        let scope = self.usable_scope(request.client_path.as_deref())?;

        ensure_closed(&scope.client.path)?;

        let catalog = &scope.catalog.catalog;
        let ids = install::selection(catalog, &request.components)?;
        let (packages, version) = match self.bundled_for(catalog, &ids) {
            Some(bundled) => (bundled.packages, bundled.version),
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
        let wanted = dependencies::resolve(ResolveInput { catalog, components: &ids, excluded: &request.excluded_dependencies })?;
        let fetched =
            self.fetch_dependencies(DownloadPlanInput { context: scope.context(), wanted: &wanted, removing: &request.remove_others }).await?;
        let parked: BTreeSet<String> = components_in(&read_installation(scope.context())?, Some(ComponentState::Disabled)).into_iter().collect();

        ensure_closed(&scope.client.path)?;
        install::install(InstallInput {
            context: scope.context(),
            packages: &packages,
            modpack_version: &version,
            remove_others: &request.remove_others,
            take_snapshot: request.take_snapshot,
            parked: &parked,
            durable_dir: &self.layout.durable_dir(),
        })?;
        dependencies::install(InstallDependenciesInput { context: scope.context(), wanted: &wanted, fetched: &fetched })?;

        read_installation(scope.context())
    }

    pub async fn uninstall_modpack(&self, request: &UninstallRequest) -> AppResult<()> {
        let _guard = self.write_guard().await?;
        let scope = self.owned_scope(request.client_path.as_deref())?;
        let latest = snapshots::list(&scope.client_dir).into_iter().next().map(|snapshot| snapshot.id);

        ensure_closed(&scope.client.path)?;

        install::uninstall(UninstallInput {
            context: scope.context(),
            restore_snapshot: latest.as_deref().filter(|_| request.restore_snapshot),
            remove_config: request.remove_config,
            durable_dir: &self.layout.durable_dir(),
            shared_elsewhere: installed_elsewhere(&self.layout.clients_dir(), &scope.client_dir),
        })
    }
}
