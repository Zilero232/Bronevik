use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use crate::error::AppResult;

pub const CHECK_INTERVAL_MINUTES: [u32; 5] = [15, 30, 60, 180, 720];
pub const DEFAULT_CHECK_INTERVAL: u32 = 30;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Language {
    #[default]
    Auto,
    Ru,
    En,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Locale {
    Ru,
    En,
}

impl Language {
    pub fn resolve(self, system: Option<&str>) -> Locale {
        match self {
            Self::Ru => Locale::Ru,
            Self::En => Locale::En,
            Self::Auto if system.is_some_and(|tag| !tag.to_lowercase().starts_with("ru")) => Locale::En,
            Self::Auto => Locale::Ru,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ManagerSettings {
    pub autostart: bool,
    pub notifications: bool,
    pub auto_migrate: bool,
    pub check_interval_minutes: u32,
    pub language: Language,
    pub selected_client: Option<PathBuf>,
    pub manual_clients: Vec<PathBuf>,
}

impl Default for ManagerSettings {
    fn default() -> Self {
        Self {
            autostart: true,
            notifications: true,
            auto_migrate: true,
            check_interval_minutes: DEFAULT_CHECK_INTERVAL,
            language: Language::Auto,
            selected_client: None,
            manual_clients: Vec::new(),
        }
    }
}

impl ManagerSettings {
    pub fn normalized(mut self) -> Self {
        if !CHECK_INTERVAL_MINUTES.contains(&self.check_interval_minutes) {
            self.check_interval_minutes = DEFAULT_CHECK_INTERVAL;
        }

        self.manual_clients.dedup();
        self
    }

    pub fn load(path: &Path) -> Self {
        fs::read_to_string(path).ok().and_then(|text| serde_json::from_str::<Self>(&text).ok()).unwrap_or_default().normalized()
    }

    pub fn save(&self, path: &Path) -> AppResult<()> {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }

        fs::write(path, serde_json::to_string_pretty(self)?)?;

        Ok(())
    }
}

#[cfg(test)]
mod tests;
