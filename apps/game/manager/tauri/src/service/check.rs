use std::collections::BTreeSet;
use std::fs;
use std::path::Path;

use super::{ClientScope, Manager};
use crate::components::{self, ToggleInput};
use crate::detect::GameVersion;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::patch::{self, ApplyInput, MigrateInput, PatchAction, PatchReport, PatchStatus, PlanInput};
use crate::process::ensure_closed;
use crate::releases::{verify_sha256, Release, ReleaseStatus};
use crate::snapshots::{self, CreateInput, KEEP_SNAPSHOTS};
use crate::state::Manifest;

#[derive(Debug, Clone, PartialEq)]
pub struct CheckOutcome {
    pub report: PatchReport,
    pub changed: bool,
}

fn checked_at() -> Option<String> {
    Some(chrono::Local::now().to_rfc3339())
}

impl Manager {
    pub async fn check(&self) -> CheckOutcome {
        let _guard = self.check_lock.lock().await;
        let previous = self.report();
        let report = self.run_check().await.unwrap_or_else(|error| PatchReport {
            status: PatchStatus::Failed { message: error.to_string() },
            client_path: previous.client_path.clone(),
            checked_at: checked_at(),
        });

        self.set_report(report.clone());

        CheckOutcome { changed: previous.status != report.status, report }
    }

    pub fn has_patch_pending(&self) -> bool {
        let Ok(client) = self.client(None) else {
            return false;
        };
        let recorded =
            Manifest::read(&self.layout.client_dir(&client.path)).ok().flatten().and_then(|manifest| GameVersion::parse(&manifest.version));

        recorded.is_some_and(|recorded| recorded != client.version)
    }

    async fn run_check(&self) -> AppResult<PatchReport> {
        let settings = self.settings();
        let Ok(client) = self.client(None) else {
            return Ok(PatchReport { status: PatchStatus::NoClient, client_path: None, checked_at: checked_at() });
        };
        let client_dir = self.layout.client_dir(&client.path);
        let game_version = client.version.to_string();
        let report = |status| PatchReport { status, client_path: Some(client.path.clone()), checked_at: checked_at() };
        let Some(manifest) = Manifest::read(&client_dir)? else {
            return Ok(report(PatchStatus::NotInstalled { game_version }));
        };
        let recorded = GameVersion::parse(&manifest.version);
        let latest = self.releases.latest(&game_version).await.ok();
        let installed_modpack = Some(manifest.modpack.as_str()).filter(|version| !version.is_empty());
        let action = patch::plan(PlanInput { recorded_game: recorded, current_game: client.version, installed_modpack, latest: latest.as_ref() });
        let from = recorded.map(|version| version.to_string()).unwrap_or_default();
        let status = match action {
            PatchAction::Nothing => PatchStatus::UpToDate { game_version, modpack_version: installed_modpack.map(str::to_owned) },
            PatchAction::Offline => PatchStatus::Offline { game_version },
            PatchAction::Wait => PatchStatus::Waiting { game_version, from },
            PatchAction::Offer(release) => PatchStatus::UpdateAvailable {
                game_version,
                current: installed_modpack.map(str::to_owned),
                latest: release.version,
                notes: release.notes,
            },
            PatchAction::Migrate if settings.auto_migrate => {
                self.migrate_scope(&self.scope(Some(&client.path))?, &manifest.mods_dir)?;

                PatchStatus::Migrated { from, to: game_version, modpack_version: installed_modpack.map(str::to_owned) }
            }
            PatchAction::Install(release) if settings.auto_migrate => {
                self.install_release(&client.path, &release).await?;

                PatchStatus::Updated { game_version, from: installed_modpack.map(str::to_owned), to: release.version }
            }
            PatchAction::Migrate | PatchAction::Install(_) => PatchStatus::Waiting { game_version, from },
        };

        Ok(report(status))
    }

    fn migrate_scope(&self, scope: &ClientScope, from_mods_dir: &Path) -> AppResult<Vec<String>> {
        patch::migrate(MigrateInput { context: scope.context(), from_mods_dir })
    }

    pub fn migrate_now(&self, client_path: Option<&Path>) -> AppResult<Vec<String>> {
        let scope = self.scope(client_path)?;
        let manifest = Manifest::read(&scope.client_dir)?
            .ok_or_else(|| AppError::coded(ErrorCode::NotInstalled, "the modpack is not installed in this client"))?;

        self.migrate_scope(&scope, &manifest.mods_dir)
    }

    pub(super) async fn refresh_catalog(&self, release: &Release) -> AppResult<()> {
        let Some(catalog) = &release.catalog else {
            return Ok(());
        };
        let bytes = self.releases.fetch(&catalog.url).await?;

        verify_sha256(&bytes, &catalog.sha256)?;
        crate::catalog::parse(&String::from_utf8_lossy(&bytes))?;
        fs::create_dir_all(self.layout.manager_dir())?;
        fs::write(self.layout.catalog_cache(), bytes)?;

        Ok(())
    }

    pub async fn install_release(&self, client_path: &Path, release: &Release) -> AppResult<Vec<String>> {
        self.refresh_catalog(release).await?;

        let scope = self.scope(Some(client_path))?;

        if scope.client.mods_dir.is_dir() {
            snapshots::create(CreateInput { client_dir: &scope.client_dir, client: &scope.client, now: chrono::Local::now() })?;
            snapshots::prune(&scope.client_dir, KEEP_SNAPSHOTS)?;
        }

        let (enabled, disabled) = patch::install_targets(scope.context(), &[])?;
        let ids: BTreeSet<String> = enabled.union(&disabled).cloned().collect();
        let packages = patch::fetch_packages(&self.releases, release, &ids).await?;

        patch::apply_packages(ApplyInput { context: scope.context(), modpack_version: &release.version, packages: &packages, disabled: &disabled })
    }

    pub async fn update_now(&self, client_path: Option<&Path>) -> AppResult<PatchReport> {
        let client = self.client(client_path)?;
        let latest = self.releases.latest(&client.version.to_string()).await?;
        let release = latest
            .release
            .filter(|_| latest.status == ReleaseStatus::Compatible)
            .ok_or_else(|| AppError::coded(ErrorCode::ReleaseUnavailable, "no release supports this client yet"))?;

        ensure_closed(&client.path)?;
        self.install_release(&client.path, &release).await?;

        Ok(self.check().await.report)
    }

    pub async fn set_component_enabled(&self, client_path: Option<&Path>, component_id: &str, enabled: bool) -> AppResult<Vec<String>> {
        let scope = self.scope(client_path)?;

        ensure_closed(&scope.client.path)?;

        let input = ToggleInput { context: scope.context(), component_id, enabled };
        let missing = if enabled { components::missing_for_enable(&input)? } else { Vec::new() };

        if !missing.is_empty() {
            self.download_components(&scope, &missing).await?;
        }

        components::set_enabled(ToggleInput { context: scope.context(), component_id, enabled })
    }

    async fn download_components(&self, scope: &ClientScope, ids: &[String]) -> AppResult<()> {
        let installed = Manifest::read(&scope.client_dir)?.map(|manifest| manifest.modpack).unwrap_or_default();
        let latest = self.releases.latest(&scope.client.version.to_string()).await?;
        let release = latest
            .release
            .filter(|release| latest.status == ReleaseStatus::Compatible && (installed.is_empty() || release.version == installed))
            .ok_or_else(|| AppError::coded(ErrorCode::ReleaseUnavailable, "update the modpack before adding components"))?;
        let wanted: BTreeSet<String> = ids.iter().cloned().collect();

        if let Some(absent) = wanted.iter().find(|id| release.package(id).is_none()) {
            return Err(AppError::coded(ErrorCode::ReleaseUnavailable, format!("the release has no package {absent}")));
        }

        let packages = patch::fetch_packages(&self.releases, &release, &wanted).await?;

        patch::apply_packages(ApplyInput {
            context: scope.context(),
            modpack_version: &release.version,
            packages: &packages,
            disabled: &BTreeSet::new(),
        })?;

        Ok(())
    }
}
