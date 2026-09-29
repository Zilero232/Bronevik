use std::path::Path;

use super::Manager;
use crate::error::AppResult;
use crate::paths::configs_dir;
use crate::process::ensure_closed;
use crate::profiles::{ProfileStore, ProfilesView};
use crate::snapshots::{self, CreateInput, RestoreInput, Snapshot, SnapshotKind};

impl Manager {
    pub fn profile_store(&self, client_path: Option<&Path>) -> AppResult<ProfileStore> {
        let client = self.client(client_path)?;

        Ok(ProfileStore::new(configs_dir(&client.path), self.layout.durable_dir()))
    }

    pub async fn change_profiles(&self, client_path: Option<&Path>, change: impl FnOnce(&ProfileStore) -> AppResult<()>) -> AppResult<ProfilesView> {
        let _guard = self.write_guard().await?;
        let client = self.client(client_path)?;
        let store = ProfileStore::new(configs_dir(&client.path), self.layout.durable_dir());

        ensure_closed(&client.path)?;
        change(&store)?;

        Ok(store.load()?.view())
    }

    pub fn list_snapshots(&self, client_path: Option<&Path>) -> AppResult<Vec<Snapshot>> {
        let client = self.client(client_path)?;

        Ok(snapshots::list(&self.layout.client_dir(&client.path)))
    }

    pub async fn create_snapshot(&self, client_path: Option<&Path>) -> AppResult<Vec<Snapshot>> {
        let _guard = self.write_guard().await?;
        let scope = self.owned_scope(client_path)?;

        snapshots::create_and_prune(CreateInput { context: scope.context(), kind: SnapshotKind::Manual, removed: &[], now: chrono::Local::now() })?;

        Ok(snapshots::list(&scope.client_dir))
    }

    pub async fn restore_snapshot(&self, client_path: Option<&Path>, id: &str) -> AppResult<Vec<Snapshot>> {
        let _guard = self.write_guard().await?;
        let scope = self.owned_scope(client_path)?;

        ensure_closed(&scope.client.path)?;
        snapshots::restore(RestoreInput { context: scope.context(), durable_dir: &self.layout.durable_dir(), id })?;
        self.sync_res_map(&scope.client);

        Ok(snapshots::list(&scope.client_dir))
    }

    pub async fn delete_snapshot(&self, client_path: Option<&Path>, id: &str) -> AppResult<Vec<Snapshot>> {
        let _guard = self.write_guard().await?;
        let client = self.client(client_path)?;
        let client_dir = self.layout.client_dir(&client.path);

        snapshots::delete(&client_dir, id)?;

        Ok(snapshots::list(&client_dir))
    }
}
