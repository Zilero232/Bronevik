mod codec;

use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

pub use codec::{decode, encode, CODE_PREFIX};

use crate::durable::{now_seconds, MirroredFile};
use crate::error::{AppError, AppResult, ErrorCode};

pub const FILE_NAME: &str = "profiles.json";
pub const CONFIG_JSON: &str = "config.json";
pub const COMPONENTS_JSON: &str = "components.json";
pub const FILE_VERSION: u32 = 1;
pub const MAX_PROFILES: usize = 12;
pub const NAME_MAX_LENGTH: usize = 40;
pub const ID_BYTES: usize = 6;
pub const EXCLUDED_CONFIG_KEYS: [&str; 3] = ["server_url", "bind_code", "settings_action"];

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct ProfileData {
    #[serde(default)]
    pub config: Map<String, Value>,
    #[serde(default)]
    pub components: Map<String, Value>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Profile {
    pub id: String,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated: Option<f64>,
    pub data: ProfileData,
    #[serde(flatten)]
    pub extra: Map<String, Value>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ProfilesFile {
    pub version: u32,
    pub active: Option<String>,
    pub profiles: Vec<Profile>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileSummary {
    pub id: String,
    pub name: String,
    pub created: Option<f64>,
    pub updated: Option<f64>,
    pub active: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfilesView {
    pub max: usize,
    pub active: Option<String>,
    pub profiles: Vec<ProfileSummary>,
}

impl Default for ProfilesFile {
    fn default() -> Self {
        Self { version: FILE_VERSION, active: None, profiles: Vec::new() }
    }
}

impl ProfilesFile {
    pub fn from_value(value: &Value) -> Self {
        let profiles: Vec<Profile> = value
            .get("profiles")
            .and_then(Value::as_array)
            .map(|items| items.iter().filter_map(|item| serde_json::from_value(item.clone()).ok()).take(MAX_PROFILES).collect())
            .unwrap_or_default();
        let active = value.get("active").and_then(Value::as_str).filter(|id| profiles.iter().any(|profile| profile.id == *id)).map(str::to_owned);

        Self { version: FILE_VERSION, active, profiles }
    }

    pub fn get(&self, id: &str) -> AppResult<&Profile> {
        self.profiles.iter().find(|profile| profile.id == id).ok_or_else(|| AppError::coded(ErrorCode::ProfileMissing, format!("no profile {id}")))
    }

    fn get_mut(&mut self, id: &str) -> AppResult<&mut Profile> {
        self.profiles
            .iter_mut()
            .find(|profile| profile.id == id)
            .ok_or_else(|| AppError::coded(ErrorCode::ProfileMissing, format!("no profile {id}")))
    }

    pub fn view(&self) -> ProfilesView {
        ProfilesView {
            max: MAX_PROFILES,
            active: self.active.clone(),
            profiles: self
                .profiles
                .iter()
                .map(|profile| ProfileSummary {
                    id: profile.id.clone(),
                    name: profile.name.clone(),
                    created: profile.created,
                    updated: profile.updated,
                    active: self.active.as_deref() == Some(profile.id.as_str()),
                })
                .collect(),
        }
    }
}

pub fn normalize_name(name: &str) -> AppResult<String> {
    let collapsed = name.split_whitespace().collect::<Vec<_>>().join(" ");
    let clipped: String = collapsed.chars().take(NAME_MAX_LENGTH).collect();
    let trimmed = clipped.trim();

    if trimmed.is_empty() {
        return Err(AppError::coded(ErrorCode::ProfileName, "empty profile name"));
    }

    Ok(trimmed.to_owned())
}

pub fn new_id() -> String {
    let mut bytes = [0; ID_BYTES];

    if getrandom::fill(&mut bytes).is_err() {
        let nanos = SystemTime::now().duration_since(UNIX_EPOCH).map(|time| time.as_nanos()).unwrap_or_default();

        bytes.copy_from_slice(&nanos.to_le_bytes()[..ID_BYTES]);
    }

    hex::encode(bytes)
}

pub struct ProfileStore {
    pub configs_dir: PathBuf,
    pub durable_dir: PathBuf,
}

fn as_object(value: Option<Value>) -> Map<String, Value> {
    value.and_then(|value| value.as_object().cloned()).unwrap_or_default()
}

impl ProfileStore {
    pub fn new(configs_dir: impl Into<PathBuf>, durable_dir: impl Into<PathBuf>) -> Self {
        Self { configs_dir: configs_dir.into(), durable_dir: durable_dir.into() }
    }

    fn file(&self, name: &'static str) -> MirroredFile {
        MirroredFile::new(name, &self.configs_dir, &self.durable_dir)
    }

    pub fn load(&self) -> AppResult<ProfilesFile> {
        Ok(self.file(FILE_NAME).read().filter(Value::is_object).map(|value| ProfilesFile::from_value(&value)).unwrap_or_default())
    }

    fn persist(&self, file: &ProfilesFile) -> AppResult<()> {
        self.file(FILE_NAME).write(file)
    }

    fn update<T>(&self, change: impl FnOnce(&mut ProfilesFile) -> AppResult<T>) -> AppResult<T> {
        let mut file = self.load()?;
        let result = change(&mut file)?;

        self.persist(&file)?;

        Ok(result)
    }

    pub fn take_snapshot(&self) -> ProfileData {
        let mut config = as_object(self.file(CONFIG_JSON).read());

        for key in EXCLUDED_CONFIG_KEYS {
            config.remove(key);
        }

        ProfileData { config, components: as_object(self.file(COMPONENTS_JSON).read()) }
    }

    fn add(file: &mut ProfilesFile, name: &str, data: ProfileData) -> AppResult<Profile> {
        if file.profiles.len() >= MAX_PROFILES {
            return Err(AppError::coded(ErrorCode::ProfileLimit, format!("at most {MAX_PROFILES} profiles")));
        }

        let now = now_seconds();
        let id = std::iter::repeat_with(new_id).find(|candidate| file.get(candidate).is_err()).unwrap_or_else(new_id);
        let profile = Profile { id, name: normalize_name(name)?, created: Some(now), updated: Some(now), data, extra: Map::new() };

        file.active = Some(profile.id.clone());
        file.profiles.push(profile.clone());

        Ok(profile)
    }

    pub fn save_current(&self, name: &str) -> AppResult<Profile> {
        let data = self.take_snapshot();

        self.update(|file| Self::add(file, name, data))
    }

    pub fn rename(&self, id: &str, name: &str) -> AppResult<()> {
        let name = normalize_name(name)?;

        self.update(|file| {
            let profile = file.get_mut(id)?;

            profile.name = name;
            profile.updated = Some(now_seconds());

            Ok(())
        })
    }

    pub fn delete(&self, id: &str) -> AppResult<()> {
        self.update(|file| {
            file.get(id)?;
            file.profiles.retain(|profile| profile.id != id);

            if file.active.as_deref() == Some(id) {
                file.active = None;
            }

            Ok(())
        })
    }

    pub fn activate(&self, id: &str) -> AppResult<()> {
        let file = self.load()?;
        let data = file.get(id)?.data.clone();

        self.apply(&data)?;
        self.update(|file| {
            file.get(id)?;
            file.active = Some(id.to_owned());

            Ok(())
        })
    }

    fn apply(&self, data: &ProfileData) -> AppResult<()> {
        let mut config = as_object(self.file(CONFIG_JSON).read());
        let mut components = as_object(self.file(COMPONENTS_JSON).read());

        for (key, value) in &data.config {
            if !EXCLUDED_CONFIG_KEYS.contains(&key.as_str()) {
                config.insert(key.clone(), value.clone());
            }
        }

        for (key, section) in &data.components {
            let Value::Object(section) = section else {
                continue;
            };

            match components.get_mut(key) {
                Some(Value::Object(existing)) => existing.extend(section.clone()),
                _ => {
                    components.insert(key.clone(), Value::Object(section.clone()));
                }
            }
        }

        self.file(CONFIG_JSON).write(&config)?;
        self.file(COMPONENTS_JSON).write(&components)
    }

    pub fn export(&self, id: &str) -> AppResult<String> {
        let file = self.load()?;
        let profile = file.get(id)?;

        encode(&profile.name, &profile.data)
    }

    pub fn import(&self, code: &str, name: Option<&str>) -> AppResult<Profile> {
        let (decoded_name, data) = decode(code)?;
        let name = name.filter(|name| !name.trim().is_empty()).unwrap_or(&decoded_name).to_owned();

        self.update(|file| Self::add(file, &name, data))
    }
}

#[cfg(test)]
mod tests;
