use std::fs;
use std::path::{Path, PathBuf};

use walkdir::WalkDir;

use crate::error::{AppError, AppResult, ErrorCode};

pub const STAGING_SUFFIX: &str = ".otm-new";
pub const RETIRED_SUFFIX: &str = ".otm-old";
pub const MIN_SAFE_PATH_LENGTH: usize = 4;

pub fn ensure_removable(path: &Path) -> AppResult<()> {
    if !path.is_absolute() || path.to_string_lossy().trim_end_matches(['\\', '/']).len() < MIN_SAFE_PATH_LENGTH {
        return Err(AppError::coded(ErrorCode::InvalidPath, format!("refusing to delete {}", path.display())));
    }

    Ok(())
}

pub fn remove_path(path: &Path) -> AppResult<()> {
    ensure_removable(path)?;

    if path.is_dir() {
        fs::remove_dir_all(path)?;
    } else if path.exists() {
        fs::remove_file(path)?;
    }

    Ok(())
}

pub fn move_file(from: &Path, to: &Path) -> AppResult<()> {
    if let Some(parent) = to.parent() {
        fs::create_dir_all(parent)?;
    }

    if to.exists() {
        fs::remove_file(to)?;
    }

    if fs::rename(from, to).is_err() {
        fs::copy(from, to)?;
        fs::remove_file(from)?;
    }

    Ok(())
}

pub fn copy_dir(from: &Path, to: &Path) -> AppResult<u64> {
    let mut bytes = 0;

    fs::create_dir_all(to)?;

    for entry in WalkDir::new(from).min_depth(1).follow_links(false) {
        let entry = entry.map_err(|error| AppError::coded(ErrorCode::Io, error.to_string()))?;
        let relative = entry.path().strip_prefix(from).map_err(|error| AppError::coded(ErrorCode::Io, error.to_string()))?;
        let target = to.join(relative);

        if entry.file_type().is_dir() {
            fs::create_dir_all(&target)?;
        } else if entry.file_type().is_file() {
            bytes += fs::copy(entry.path(), &target)?;
        }
    }

    Ok(bytes)
}

fn sibling(path: &Path, suffix: &str) -> PathBuf {
    let name = path.file_name().map(|name| name.to_string_lossy().into_owned()).unwrap_or_default();

    path.with_file_name(format!("{name}{suffix}"))
}

pub fn mirror_dir(from: &Path, to: &Path) -> AppResult<()> {
    ensure_removable(to)?;

    let staging = sibling(to, STAGING_SUFFIX);
    let retired = sibling(to, RETIRED_SUFFIX);

    remove_path(&staging)?;
    remove_path(&retired)?;
    copy_dir(from, &staging)?;

    if to.exists() {
        fs::rename(to, &retired)?;
    }

    if let Err(error) = fs::rename(&staging, to) {
        if retired.exists() {
            fs::rename(&retired, to)?;
        }

        return Err(error.into());
    }

    remove_path(&retired)
}

pub fn dir_size(path: &Path) -> u64 {
    WalkDir::new(path)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
        .filter_map(|entry| entry.metadata().ok())
        .map(|metadata| metadata.len())
        .sum()
}

pub fn list_files(dir: &Path) -> Vec<PathBuf> {
    fs::read_dir(dir)
        .map(|entries| {
            entries.filter_map(Result::ok).filter(|entry| entry.file_type().is_ok_and(|kind| kind.is_file())).map(|entry| entry.path()).collect()
        })
        .unwrap_or_default()
}

#[cfg(test)]
mod tests;
