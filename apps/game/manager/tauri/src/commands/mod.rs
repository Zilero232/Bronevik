use std::path::PathBuf;

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
use crate::profiles::ProfilesView;
use crate::releases::api_url;
use crate::service::{ClientsView, InstallPlan, InstallRequest, Manager, UninstallRequest};
use crate::settings::ManagerSettings;
use crate::snapshots::Snapshot;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    pub version: String,
    pub state_root: PathBuf,
    pub roaming_root: PathBuf,
    pub logs_dir: PathBuf,
    pub api_url: String,
}

async fn recheck(app: &AppHandle, manager: &Manager) -> PatchReport {
    let outcome = manager.check().await;

    background::publish(app, &outcome);

    outcome.report
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
    Ok(manager.profile_store(client_path.as_deref())?.load()?.view())
}

#[tauri::command]
pub async fn save_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, name: String) -> AppResult<ProfilesView> {
    manager.change_profiles(client_path.as_deref(), |store| store.save_current(&name).map(drop)).await
}

#[tauri::command]
pub async fn activate_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<ProfilesView> {
    manager.change_profiles(client_path.as_deref(), |store| store.activate(&id)).await
}

#[tauri::command]
pub async fn rename_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String, name: String) -> AppResult<ProfilesView> {
    manager.change_profiles(client_path.as_deref(), |store| store.rename(&id, &name)).await
}

#[tauri::command]
pub async fn delete_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<ProfilesView> {
    manager.change_profiles(client_path.as_deref(), |store| store.delete(&id)).await
}

#[tauri::command]
pub async fn import_profile(
    manager: State<'_, Manager>,
    client_path: Option<PathBuf>,
    code: String,
    name: Option<String>,
) -> AppResult<ProfilesView> {
    manager.change_profiles(client_path.as_deref(), |store| store.import(&code, name.as_deref()).map(drop)).await
}

#[tauri::command]
pub async fn export_profile(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<String> {
    manager.profile_store(client_path.as_deref())?.export(&id)
}

#[tauri::command]
pub async fn list_snapshots(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<Vec<Snapshot>> {
    manager.list_snapshots(client_path.as_deref())
}

#[tauri::command]
pub async fn create_snapshot(manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<Vec<Snapshot>> {
    manager.create_snapshot(client_path.as_deref()).await
}

#[tauri::command]
pub async fn restore_snapshot(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<Vec<Snapshot>> {
    manager.restore_snapshot(client_path.as_deref(), &id).await
}

#[tauri::command]
pub async fn delete_snapshot(manager: State<'_, Manager>, client_path: Option<PathBuf>, id: String) -> AppResult<Vec<Snapshot>> {
    manager.delete_snapshot(client_path.as_deref(), &id).await
}

#[tauri::command]
pub async fn get_settings(manager: State<'_, Manager>) -> AppResult<ManagerSettings> {
    Ok(manager.settings())
}

#[tauri::command]
pub async fn update_settings(app: AppHandle, manager: State<'_, Manager>, settings: ManagerSettings) -> AppResult<ManagerSettings> {
    let saved = manager.save_settings(settings)?;

    if saved.autostart_asked {
        apply_autostart(&app, saved.autostart)?;
    }

    Ok(saved)
}

#[tauri::command]
pub async fn get_patch_report(manager: State<'_, Manager>) -> AppResult<PatchReport> {
    Ok(manager.report())
}

#[tauri::command]
pub async fn check_now(app: AppHandle, manager: State<'_, Manager>) -> AppResult<PatchReport> {
    Ok(recheck(&app, &manager).await)
}

#[tauri::command]
pub async fn update_modpack(app: AppHandle, manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<PatchReport> {
    manager.update_now(client_path.as_deref()).await?;

    Ok(recheck(&app, &manager).await)
}

#[tauri::command]
pub async fn migrate_modpack(app: AppHandle, manager: State<'_, Manager>, client_path: Option<PathBuf>) -> AppResult<PatchReport> {
    manager.migrate_now(client_path.as_deref()).await?;

    Ok(recheck(&app, &manager).await)
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

    recheck(&app, &manager).await;

    Ok(installation)
}

#[tauri::command]
pub async fn uninstall_modpack(app: AppHandle, manager: State<'_, Manager>, request: UninstallRequest) -> AppResult<PatchReport> {
    manager.uninstall_modpack(&request).await?;

    Ok(recheck(&app, &manager).await)
}

#[tauri::command]
pub async fn read_installer_profile(path: PathBuf) -> AppResult<Vec<String>> {
    read_component_profile(&path)
}

#[tauri::command]
pub async fn take_deep_link(manager: State<'_, Manager>) -> AppResult<Option<DeepLink>> {
    Ok(manager.take_pending_link())
}
