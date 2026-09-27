use std::path::{Path, PathBuf};

use serde::Serialize;
use tauri::{AppHandle, State};

use crate::background::{self, apply_autostart};
use crate::catalog::LoadedCatalog;
use crate::components::{read_installation, Installation};
use crate::deep_link::DeepLink;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::install::read_component_profile;
use crate::logs::{self, CollectInput};
use crate::patch::PatchReport;
use crate::paths::configs_dir;
use crate::process::ensure_closed;
use crate::profiles::{ProfileStore, ProfilesView};
use crate::releases::api_url;
use crate::service::{ClientsView, InstallPlan, InstallRequest, Manager, UninstallRequest};
use crate::settings::ManagerSettings;
use crate::snapshots::{self, CreateInput, Snapshot, KEEP_SNAPSHOTS};

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    pub version: String,
    pub state_root: PathBuf,
    pub roaming_root: PathBuf,
    pub logs_dir: PathBuf,
    pub api_url: String,
}

fn profile_store(manager: &Manager, client_path: Option<&Path>) -> AppResult<(ProfileStore, PathBuf)> {
    let client = manager.client(client_path)?;
    let store = ProfileStore::new(configs_dir(&client.path), manager.layout.durable_dir());

    Ok((store, client.path))
}

#[tauri::command]
pub async fn app_info(manager: State<'_, Manager>) -> AppResult<AppInfo> {
    Ok(AppInfo {
        version: env!("CARGO_PKG_VERSION").to_owned(),
        state_root: manager.layout.state_root.clone(),
        roaming_root: manager.layout.roaming_root.clone(),
        logs_dir: manager.layout.logs_dir(),
        api_url: api_url(),
    })
}

#[tauri::command]
pub async fn list_clients(manager: State<'_, Manager>) -> AppResult<ClientsView> {
    Ok(manager.clients_view())
}

#[tauri::command]
pub async fn add_client(manager: State<'_, Manager>, path: PathBuf) -> AppResult<ClientsView> {
    manager.add_client(&path)?;

    Ok(manager.clients_view())
}

#[tauri::command]
pub async fn select_client(manager: State<'_, Manager>, path: PathBuf) -> AppResult<ClientsView> {
    manager.select_client(&path)?;

    Ok(manager.clients_view())
}

#[tauri::command]
pub async fn get_catalog(manager: State<'_, Manager>) -> AppResult<Option<LoadedCatalog>> {
    Ok(manager.catalog())
}

#[tauri::command]
pub async fn get_installation(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<Installation> {
    let scope = manager.scope(client_path.as_deref())?;

    read_installation(scope.context())
}

#[tauri::command]
pub async fn set_component_enabled(
    manager: State<'_, Manager>,
    client_path: Option<PathBuf>,
    component_id: String,
    enabled: bool,
) -> AppResult<Installation> {
    manager.set_component_enabled(client_path.as_deref(), &component_id, enabled).await?;

    let scope = manager.scope(client_path.as_deref())?;

    read_installation(scope.context())
}

#[tauri::command]
pub async fn list_profiles(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<ProfilesView> {
    let (store, _) = profile_store(&manager, client_path.as_deref())?;

    Ok(store.load()?.view())
}

fn change_profiles(manager: &Manager, client_path: Option<&Path>, change: impl FnOnce(&ProfileStore) -> AppResult<()>) -> AppResult<ProfilesView> {
    let (store, path) = profile_store(manager, client_path)?;

    ensure_closed(&path)?;
    change(&store)?;

    Ok(store.load()?.view())
}

#[tauri::command]
pub async fn save_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, name: String) -> AppResult<ProfilesView> {
    change_profiles(&manager, client_path.as_deref(), |store| store.save_current(&name).map(drop))
}

#[tauri::command]
pub async fn activate_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<ProfilesView> {
    change_profiles(&manager, client_path.as_deref(), |store| store.activate(&id))
}

#[tauri::command]
pub async fn rename_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String, name: String) -> AppResult<ProfilesView> {
    change_profiles(&manager, client_path.as_deref(), |store| store.rename(&id, &name))
}

#[tauri::command]
pub async fn delete_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<ProfilesView> {
    change_profiles(&manager, client_path.as_deref(), |store| store.delete(&id))
}

#[tauri::command]
pub async fn import_profile(
    manager: State<'_, Manager>,
    client_path: Option<PathBuf>,
    code: String,
    name: Option<String>,
) -> AppResult<ProfilesView> {
    change_profiles(&manager, client_path.as_deref(), |store| store.import(&code, name.as_deref()).map(drop))
}

#[tauri::command]
pub async fn export_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<String> {
    let (store, _) = profile_store(&manager, client_path.as_deref())?;

    store.export(&id)
}

#[tauri::command]
pub async fn list_snapshots(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<Vec<Snapshot>> {
    let client = manager.client(client_path.as_deref())?;

    Ok(snapshots::list(&manager.layout.client_dir(&client.path)))
}

#[tauri::command]
pub async fn create_snapshot(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<Vec<Snapshot>> {
    let client = manager.client(client_path.as_deref())?;
    let client_dir = manager.layout.client_dir(&client.path);

    snapshots::create(CreateInput { client_dir: &client_dir, client: &client, now: chrono::Local::now() })?;
    snapshots::prune(&client_dir, KEEP_SNAPSHOTS)?;

    Ok(snapshots::list(&client_dir))
}

#[tauri::command]
pub async fn restore_snapshot(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<Vec<Snapshot>> {
    let client = manager.client(client_path.as_deref())?;
    let client_dir = manager.layout.client_dir(&client.path);

    ensure_closed(&client.path)?;
    snapshots::restore(&client_dir, &id)?;

    Ok(snapshots::list(&client_dir))
}

#[tauri::command]
pub async fn delete_snapshot(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<Vec<Snapshot>> {
    let client = manager.client(client_path.as_deref())?;
    let client_dir = manager.layout.client_dir(&client.path);

    snapshots::delete(&client_dir, &id)?;

    Ok(snapshots::list(&client_dir))
}

#[tauri::command]
pub async fn get_settings(manager: State<'_, Manager>) -> AppResult<ManagerSettings> {
    Ok(manager.settings())
}

#[tauri::command]
pub async fn update_settings(app: AppHandle, manager: State<'_, Manager>, settings: ManagerSettings) -> AppResult<ManagerSettings> {
    let saved = manager.save_settings(settings)?;

    apply_autostart(&app, saved.autostart)?;

    Ok(saved)
}

#[tauri::command]
pub async fn get_patch_report(manager: State<'_, Manager>) -> AppResult<PatchReport> {
    Ok(manager.report())
}

#[tauri::command]
pub async fn check_now(app: AppHandle, manager: State<'_, Manager>) -> AppResult<PatchReport> {
    let outcome = manager.check().await;

    background::publish(&app, &outcome);

    Ok(outcome.report)
}

#[tauri::command]
pub async fn update_modpack(app: AppHandle, manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<PatchReport> {
    let report = manager.update_now(client_path.as_deref()).await?;

    background::publish(&app, &crate::service::CheckOutcome { report: report.clone(), changed: false });

    Ok(report)
}

#[tauri::command]
pub async fn migrate_modpack(app: AppHandle, manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<PatchReport> {
    manager.migrate_now(client_path.as_deref())?;

    let outcome = manager.check().await;

    background::publish(&app, &outcome);

    Ok(outcome.report)
}

#[tauri::command]
pub async fn collect_logs(manager: State<'_, Manager>) -> AppResult<PathBuf> {
    let output_dir = dirs::desktop_dir().or_else(dirs::home_dir).ok_or_else(|| AppError::coded(ErrorCode::InvalidPath, "no desktop folder"))?;

    logs::collect(CollectInput { layout: &manager.layout, clients: &manager.detect(), output_dir: &output_dir, now: chrono::Local::now() })
}

#[tauri::command]
pub async fn reveal_path(path: PathBuf) -> AppResult<()> {
    tauri_plugin_opener::reveal_item_in_dir(&path).map_err(|error| AppError::coded(ErrorCode::InvalidPath, error.to_string()))
}

#[tauri::command]
pub async fn prepare_install(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<InstallPlan> {
    manager.prepare_install(client_path.as_deref()).await
}

#[tauri::command]
pub async fn install_modpack(app: AppHandle, manager: State<'_, Manager>, request: InstallRequest) -> AppResult<Installation> {
    let installation = manager.install_modpack(request).await?;
    let outcome = manager.check().await;

    background::publish(&app, &outcome);

    Ok(installation)
}

#[tauri::command]
pub async fn uninstall_modpack(app: AppHandle, manager: State<'_, Manager>, request: UninstallRequest) -> AppResult<PatchReport> {
    manager.uninstall_modpack(&request)?;

    let outcome = manager.check().await;

    background::publish(&app, &outcome);

    Ok(outcome.report)
}

#[tauri::command]
pub async fn read_installer_profile(path: PathBuf) -> AppResult<Vec<String>> {
    read_component_profile(&path)
}

#[tauri::command]
pub async fn take_deep_link(manager: State<'_, Manager>) -> AppResult<Option<DeepLink>> {
    Ok(manager.take_pending_link())
}
