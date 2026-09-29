use super::Manager;
use crate::error::AppResult;
use crate::sets::{SetStore, SetsFile, SetsView};

impl Manager {
    pub fn set_store(&self) -> SetStore {
        SetStore::new(self.layout.sets_file())
    }

    pub fn sets_view(&self) -> SetsView {
        self.set_store().load().view()
    }

    pub async fn change_sets(&self, change: impl FnOnce(&mut SetsFile) -> AppResult<()>) -> AppResult<SetsView> {
        let _guard = self.write_guard().await?;
        let store = self.set_store();

        store.update(change)?;

        Ok(store.load().view())
    }
}
