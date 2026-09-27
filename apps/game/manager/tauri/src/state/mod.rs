use std::path::{Path, PathBuf};

use ini::Ini;
use sha2::{Digest, Sha256};

use crate::detect::GameClient;
use crate::error::AppResult;
use crate::ini_file;

pub const MANIFEST_INI: &str = "manifest.ini";
pub const CLIENT_INI: &str = "client.ini";
pub const DISABLED_DIR: &str = "disabled";
pub const KEY_LENGTH: usize = 16;

pub fn client_key(path: &Path) -> String {
    let text = path.to_string_lossy();
    let trimmed = if text.len() > 3 { text.trim_end_matches('\\') } else { &text };
    let lowered = trimmed.to_ascii_lowercase();
    let bytes: Vec<u8> = lowered.encode_utf16().flat_map(u16::to_le_bytes).collect();
    let digest = hex::encode(Sha256::digest(bytes));

    digest[..KEY_LENGTH].to_owned()
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Manifest {
    pub client: PathBuf,
    pub version: String,
    pub mods_dir: PathBuf,
    pub installer: String,
    pub modpack: String,
    pub date: String,
    pub components: Vec<String>,
    pub files: Vec<PathBuf>,
    pub disabled: Vec<String>,
    pub manager: Option<String>,
}

impl Manifest {
    pub fn path(client_dir: &Path) -> PathBuf {
        client_dir.join(MANIFEST_INI)
    }

    pub fn read(client_dir: &Path) -> AppResult<Option<Self>> {
        let Some(ini) = ini_file::read(&Self::path(client_dir))? else {
            return Ok(None);
        };
        let text = |section: &str, key: &str| ini_file::get(&ini, section, key).unwrap_or_default().to_owned();
        let count: usize = text("files", "count").parse().unwrap_or(0);
        let files = (0..count)
            .filter_map(|index| ini_file::get(&ini, "files", &index.to_string()))
            .filter(|path| !path.is_empty())
            .map(PathBuf::from)
            .collect();

        Ok(Some(Self {
            client: PathBuf::from(text("install", "client")),
            version: text("install", "version"),
            mods_dir: PathBuf::from(text("install", "mods")),
            installer: text("install", "installer"),
            modpack: text("install", "modpack"),
            date: text("install", "date"),
            components: split_csv(&text("install", "components")),
            files,
            disabled: split_csv(&text("manager", "disabled")),
            manager: ini_file::get(&ini, "manager", "version").filter(|version| !version.is_empty()).map(str::to_owned),
        }))
    }

    pub fn write(&self, client_dir: &Path) -> AppResult<()> {
        let mut ini = Ini::new();

        ini.with_section(Some("install"))
            .set("client", self.client.to_string_lossy())
            .set("version", &self.version)
            .set("mods", self.mods_dir.to_string_lossy())
            .set("installer", &self.installer)
            .set("modpack", &self.modpack)
            .set("date", &self.date)
            .set("components", self.components.join(","));

        let mut files = ini.with_section(Some("files"));

        files.set("count", self.files.len().to_string());

        for (index, file) in self.files.iter().enumerate() {
            files.set(index.to_string(), file.to_string_lossy());
        }

        ini.with_section(Some("manager")).set("version", self.manager.clone().unwrap_or_default()).set("disabled", self.disabled.join(","));

        ini_file::write(&Self::path(client_dir), &ini)
    }

    pub fn component_ids(&self) -> Vec<String> {
        self.components.iter().map(|name| component_id(name).to_owned()).collect()
    }
}

pub fn component_id(inno_name: &str) -> &str {
    inno_name.rsplit(['\\', '/']).next().unwrap_or(inno_name)
}

pub fn inno_name(category: &str, id: &str) -> String {
    format!("{category}\\{id}")
}

pub fn split_csv(text: &str) -> Vec<String> {
    text.split(',').map(str::trim).filter(|item| !item.is_empty()).map(str::to_owned).collect()
}

pub fn save_client_state(client_dir: &Path, client: &GameClient) -> AppResult<()> {
    let mut ini = Ini::new();

    ini.with_section(Some("client"))
        .set("path", client.path.to_string_lossy())
        .set("version", client.version.to_string())
        .set("mods", client.mods_dir.to_string_lossy())
        .set("res_mods", client.res_mods_dir.to_string_lossy());

    ini_file::write(&client_dir.join(CLIENT_INI), &ini)
}

pub fn disabled_dir(client_dir: &Path) -> PathBuf {
    client_dir.join(DISABLED_DIR)
}

#[cfg(test)]
mod tests;
