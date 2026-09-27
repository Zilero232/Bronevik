use std::fs;
use std::path::{Path, PathBuf};
use std::time::Duration;

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::catalog::Localized;
use crate::error::{AppError, AppResult, ErrorCode};

pub const DEFAULT_API_URL: &str = "https://api.triotmetki.ru";
pub const API_URL_ENV: &str = "OTMETKI_API_URL";
pub const LATEST_PATH: &str = "/modpack/releases/latest";
pub const REQUEST_TIMEOUT: Duration = Duration::from_secs(30);
pub const DOWNLOAD_TIMEOUT: Duration = Duration::from_secs(300);
pub const PART_SUFFIX: &str = ".part";

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReleaseStatus {
    Compatible,
    Waiting,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleasePackage {
    pub id: String,
    pub file: String,
    pub url: String,
    pub sha256: String,
    pub size: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseCatalog {
    pub url: String,
    pub sha256: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Release {
    pub version: String,
    pub published_at: String,
    pub games: Vec<String>,
    #[serde(default)]
    pub notes: Option<Localized>,
    #[serde(default)]
    pub catalog: Option<ReleaseCatalog>,
    pub packages: Vec<ReleasePackage>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LatestRelease {
    pub game: String,
    pub status: ReleaseStatus,
    pub release: Option<Release>,
}

impl Release {
    pub fn package(&self, id: &str) -> Option<&ReleasePackage> {
        self.packages.iter().find(|package| package.id == id)
    }
}

pub fn api_url() -> String {
    std::env::var(API_URL_ENV)
        .ok()
        .filter(|url| !url.trim().is_empty())
        .unwrap_or_else(|| DEFAULT_API_URL.to_owned())
        .trim_end_matches('/')
        .to_owned()
}

pub fn sha256_hex(bytes: &[u8]) -> String {
    hex::encode(Sha256::digest(bytes))
}

pub fn verify_sha256(bytes: &[u8], expected: &str) -> AppResult<()> {
    let actual = sha256_hex(bytes);

    if !actual.eq_ignore_ascii_case(expected.trim()) {
        return Err(AppError::coded(ErrorCode::ChecksumMismatch, format!("expected {expected}, got {actual}")));
    }

    Ok(())
}

pub fn safe_file_name(name: &str) -> AppResult<&str> {
    let valid = !name.is_empty() && !name.contains(['/', '\\', ':']) && name != "." && name != "..";

    if !valid {
        return Err(AppError::coded(ErrorCode::InvalidPath, format!("bad package file name {name}")));
    }

    Ok(name)
}

pub fn write_verified(input: WriteVerifiedInput) -> AppResult<PathBuf> {
    let name = safe_file_name(input.file_name)?;
    let target = input.dir.join(name);
    let part = input.dir.join(format!("{name}{PART_SUFFIX}"));

    verify_sha256(input.bytes, input.sha256)?;
    fs::create_dir_all(input.dir)?;
    fs::write(&part, input.bytes)?;
    fs::rename(&part, &target)?;

    Ok(target)
}

pub struct WriteVerifiedInput<'a> {
    pub dir: &'a Path,
    pub file_name: &'a str,
    pub bytes: &'a [u8],
    pub sha256: &'a str,
}

#[derive(Clone)]
pub struct ReleasesClient {
    base_url: String,
    http: reqwest::Client,
}

impl ReleasesClient {
    pub fn new(base_url: impl Into<String>) -> AppResult<Self> {
        let http =
            reqwest::Client::builder().user_agent(concat!("Three Marks manager/", env!("CARGO_PKG_VERSION"))).timeout(DOWNLOAD_TIMEOUT).build()?;

        Ok(Self { base_url: base_url.into(), http })
    }

    pub async fn latest(&self, game: &str) -> AppResult<LatestRelease> {
        let response = self
            .http
            .get(format!("{}{LATEST_PATH}", self.base_url))
            .query(&[("game", game)])
            .timeout(REQUEST_TIMEOUT)
            .send()
            .await?
            .error_for_status()?;

        Ok(response.json().await?)
    }

    pub async fn fetch(&self, url: &str) -> AppResult<Vec<u8>> {
        if !url.starts_with("https://") && !url.starts_with(&self.base_url) {
            return Err(AppError::coded(ErrorCode::ReleaseUnavailable, format!("refusing a non-https download {url}")));
        }

        let response = self.http.get(url).send().await?.error_for_status()?;

        Ok(response.bytes().await?.to_vec())
    }
}

#[cfg(test)]
pub mod fixtures;

#[cfg(test)]
mod tests;
