use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use serde_json::{json, Map, Value};

use crate::durable::MirroredFile;
use crate::error::AppResult;

pub const FILE_NAME: &str = "credentials.json";
pub const ACCOUNTS_KEY: &str = "accounts";
pub const MIN_SECRET_LENGTH: usize = 32;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Credentials {
    pub device_id: String,
    pub secret: String,
    pub account_id: u64,
    #[serde(default)]
    pub bound_at: Option<f64>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountBinding {
    pub account_id: u64,
    pub device_id: String,
    pub bound_at: Option<f64>,
}

impl Credentials {
    pub fn is_valid(&self) -> bool {
        !self.device_id.is_empty() && self.secret.len() >= MIN_SECRET_LENGTH && self.account_id > 0
    }

    pub fn binding(&self) -> AccountBinding {
        AccountBinding { account_id: self.account_id, device_id: self.device_id.clone(), bound_at: self.bound_at }
    }
}

pub fn parse(value: &Value) -> Vec<Credentials> {
    let mut accounts: Vec<Credentials> = value
        .get(ACCOUNTS_KEY)
        .and_then(Value::as_object)
        .into_iter()
        .flatten()
        .filter_map(|(_, entry)| serde_json::from_value::<Credentials>(entry.clone()).ok())
        .filter(Credentials::is_valid)
        .collect();

    accounts.sort_by(|left, right| {
        right.bound_at.unwrap_or_default().total_cmp(&left.bound_at.unwrap_or_default()).then(left.account_id.cmp(&right.account_id))
    });
    accounts.dedup_by_key(|credentials| credentials.account_id);
    accounts
}

pub fn with_account(value: Option<Value>, credentials: &Credentials) -> AppResult<Value> {
    let mut root = value.filter(Value::is_object).unwrap_or_else(|| json!({}));
    let object = root.as_object_mut().map(|object| object.entry(ACCOUNTS_KEY).or_insert_with(|| Value::Object(Map::new())));

    match object {
        Some(Value::Object(accounts)) => {
            accounts.insert(credentials.account_id.to_string(), serde_json::to_value(credentials)?);
        }
        Some(other) => *other = json!({ credentials.account_id.to_string(): credentials }),
        None => {}
    }

    Ok(root)
}

pub struct CredentialStore {
    pub configs_dir: PathBuf,
    pub durable_dir: PathBuf,
}

impl CredentialStore {
    pub fn new(configs_dir: impl Into<PathBuf>, durable_dir: impl Into<PathBuf>) -> Self {
        Self { configs_dir: configs_dir.into(), durable_dir: durable_dir.into() }
    }

    fn file(&self) -> MirroredFile {
        MirroredFile::new(FILE_NAME, &self.configs_dir, &self.durable_dir)
    }

    pub fn load(&self) -> Vec<Credentials> {
        self.file().read().map(|value| parse(&value)).unwrap_or_default()
    }

    pub fn find(&self, account_id: Option<u64>) -> Option<Credentials> {
        let accounts = self.load();

        account_id.and_then(|id| accounts.iter().find(|credentials| credentials.account_id == id).cloned()).or_else(|| accounts.into_iter().next())
    }

    pub fn save(&self, credentials: &Credentials) -> AppResult<()> {
        let file = self.file();

        file.write(&with_account(file.read(), credentials)?)
    }
}

#[cfg(test)]
mod tests;
