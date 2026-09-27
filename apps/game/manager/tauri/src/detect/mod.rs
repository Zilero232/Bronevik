pub mod client;
pub mod lgc;
mod version;

use std::path::{Path, PathBuf};

pub use client::{inspect, ClientSource, GameClient};
pub use lgc::{lgc_dir, read_preferences};
pub use version::GameVersion;

use crate::paths::same_path;

pub const PROGRAM_DATA_ENV: &str = "PROGRAMDATA";
pub const PROGRAM_DATA_FALLBACK: &str = r"C:\ProgramData";

pub struct DetectInput<'a> {
    pub program_data: &'a Path,
    pub manual: &'a [PathBuf],
}

pub fn program_data() -> PathBuf {
    std::env::var_os(PROGRAM_DATA_ENV).map(PathBuf::from).unwrap_or_else(|| PathBuf::from(PROGRAM_DATA_FALLBACK))
}

pub fn detect_clients(input: DetectInput) -> Vec<GameClient> {
    let preferences = lgc_dir(input.program_data).map(|dir| read_preferences(&dir)).unwrap_or_default();
    let from_lgc = preferences.clients.iter().map(|path| (path, ClientSource::Lgc));
    let manual = input.manual.iter().map(|path| (path, ClientSource::Manual));
    let mut clients: Vec<GameClient> = Vec::new();

    for (path, source) in from_lgc.chain(manual) {
        if clients.iter().any(|known| same_path(&known.path, path)) {
            continue;
        }

        if let Some(mut client) = inspect(path, source) {
            client.preferred = preferences.selected.as_deref().is_some_and(|selected| same_path(selected, path));
            clients.push(client);
        }
    }

    clients
}

pub fn find_client<'a>(clients: &'a [GameClient], path: &Path) -> Option<&'a GameClient> {
    clients.iter().find(|client| same_path(&client.path, path))
}

pub fn default_client<'a>(clients: &'a [GameClient], selected: Option<&Path>) -> Option<&'a GameClient> {
    let usable = |client: &&GameClient| client.problem.is_none();

    selected
        .and_then(|path| find_client(clients, path))
        .or_else(|| clients.iter().filter(usable).find(|client| client.preferred))
        .or_else(|| clients.iter().find(usable))
}

#[cfg(test)]
pub mod fixtures;

#[cfg(test)]
mod tests;
