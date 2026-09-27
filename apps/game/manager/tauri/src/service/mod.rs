mod check;
pub mod setup;

use std::path::{Path, PathBuf};
use std::sync::Mutex;

use serde::Serialize;

pub use check::CheckOutcome;
pub use setup::{InstallPlan, InstallRequest, UninstallRequest};

use crate::catalog::{self, LoadInput, LoadedCatalog};
use crate::components::ClientContext;
use crate::deep_link::DeepLink;
use crate::detect::{self, DetectInput, GameClient};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::patch::PatchReport;
use crate::paths::{same_path, Layout};
use crate::releases::ReleasesClient;
use crate::settings::ManagerSettings;

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClientsView {
    pub clients: Vec<GameClient>,
    pub selected: Option<PathBuf>,
}

pub struct Manager {
    pub layout: Layout,
    pub bundled: BundledResources,
    pub releases: ReleasesClient,
    settings: Mutex<ManagerSettings>,
    report: Mutex<PatchReport>,
    pending_link: Mutex<Option<DeepLink>>,
    check_lock: tokio::sync::Mutex<()>,
}

#[derive(Debug, Clone, Default)]
pub struct BundledResources {
    pub catalog: Option<PathBuf>,
    pub packages: Option<PathBuf>,
}

pub struct ClientScope {
    pub client: GameClient,
    pub client_dir: PathBuf,
    pub catalog: LoadedCatalog,
}

impl ClientScope {
    pub fn context(&self) -> ClientContext<'_> {
        ClientContext { client_dir: &self.client_dir, client: &self.client, catalog: &self.catalog.catalog }
    }
}

impl Manager {
    pub fn new(layout: Layout, bundled: BundledResources, releases: ReleasesClient) -> Self {
        let settings = ManagerSettings::load(&layout.settings_file());

        Self {
            layout,
            bundled,
            releases,
            settings: Mutex::new(settings),
            report: Mutex::new(PatchReport::default()),
            pending_link: Mutex::new(None),
            check_lock: tokio::sync::Mutex::new(()),
        }
    }

    pub fn set_pending_link(&self, link: DeepLink) {
        if let Ok(mut pending) = self.pending_link.lock() {
            *pending = Some(link);
        }
    }

    pub fn take_pending_link(&self) -> Option<DeepLink> {
        self.pending_link.lock().ok().and_then(|mut pending| pending.take())
    }

    pub fn settings(&self) -> ManagerSettings {
        self.settings.lock().map(|settings| settings.clone()).unwrap_or_default()
    }

    pub fn save_settings(&self, settings: ManagerSettings) -> AppResult<ManagerSettings> {
        let settings = settings.normalized();

        settings.save(&self.layout.settings_file())?;

        if let Ok(mut current) = self.settings.lock() {
            *current = settings.clone();
        }

        Ok(settings)
    }

    pub fn report(&self) -> PatchReport {
        self.report.lock().map(|report| report.clone()).unwrap_or_default()
    }

    pub fn set_report(&self, report: PatchReport) {
        if let Ok(mut current) = self.report.lock() {
            *current = report;
        }
    }

    pub fn detect(&self) -> Vec<GameClient> {
        let settings = self.settings();

        detect::detect_clients(DetectInput { program_data: &detect::program_data(), manual: &settings.manual_clients })
    }

    pub fn clients_view(&self) -> ClientsView {
        let clients = self.detect();
        let settings = self.settings();
        let selected = detect::default_client(&clients, settings.selected_client.as_deref()).map(|client| client.path.clone());

        ClientsView { clients, selected }
    }

    pub fn add_client(&self, path: &Path) -> AppResult<GameClient> {
        let client = detect::inspect(path, detect::ClientSource::Manual)
            .ok_or_else(|| AppError::coded(ErrorCode::ClientNotFound, format!("no game client in {}", path.display())))?;
        let mut settings = self.settings();

        if !settings.manual_clients.iter().any(|known| same_path(known, path)) {
            settings.manual_clients.push(path.to_path_buf());
        }

        settings.selected_client = Some(path.to_path_buf());
        self.save_settings(settings)?;

        Ok(client)
    }

    pub fn select_client(&self, path: &Path) -> AppResult<ManagerSettings> {
        let mut settings = self.settings();

        settings.selected_client = Some(path.to_path_buf());
        self.save_settings(settings)
    }

    pub fn catalog(&self) -> Option<LoadedCatalog> {
        catalog::load(LoadInput { cache: &self.layout.catalog_cache(), bundled: self.bundled.catalog.as_deref() })
    }

    pub fn client(&self, path: Option<&Path>) -> AppResult<GameClient> {
        let clients = self.detect();
        let not_found = || AppError::coded(ErrorCode::ClientNotFound, "no game client found");

        if let Some(path) = path {
            return detect::find_client(&clients, path)
                .cloned()
                .or_else(|| detect::inspect(path, detect::ClientSource::Manual))
                .ok_or_else(not_found);
        }

        detect::default_client(&clients, self.settings().selected_client.as_deref()).cloned().ok_or_else(not_found)
    }

    pub fn scope(&self, path: Option<&Path>) -> AppResult<ClientScope> {
        let client = self.client(path)?;
        let catalog = self.catalog().ok_or_else(|| AppError::coded(ErrorCode::ReleaseUnavailable, "no component catalog yet"))?;

        Ok(ClientScope { client_dir: self.layout.client_dir(&client.path), client, catalog })
    }
}
