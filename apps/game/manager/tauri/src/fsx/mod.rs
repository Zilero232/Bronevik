pub mod faults;

use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

use sha2::{Digest, Sha256};
use walkdir::WalkDir;

use crate::error::{AppError, AppResult, ErrorCode};
use crate::paths::normalized;

pub const STAGING_SUFFIX: &str = ".otm-new";
pub const RETIRED_SUFFIX: &str = ".otm-old";
pub const PART_SUFFIX: &str = ".part";
pub const TEMP_SUFFIX: &str = ".otm-tmp";
pub const MIN_SAFE_PATH_LENGTH: usize = 4;
pub const HASH_BUFFER_BYTES: usize = 64 * 1024;

pub fn write_file(path: &Path, bytes: &[u8]) -> AppResult<()> {
    faults::check(path)?;
    fs::write(path, bytes)?;

    Ok(())
}

pub fn copy_file(from: &Path, to: &Path) -> AppResult<u64> {
    faults::check(to)?;

    Ok(fs::copy(from, to)?)
}

pub fn rename_file(from: &Path, to: &Path) -> AppResult<()> {
    faults::check(to)?;
    fs::rename(from, to)?;

    Ok(())
}

pub fn write_atomic(path: &Path, bytes: &[u8]) -> AppResult<()> {
    let parent = path.parent().filter(|parent| !parent.as_os_str().is_empty()).unwrap_or(Path::new("."));

    fs::create_dir_all(parent)?;

    let mut temp = tempfile::Builder::new().suffix(TEMP_SUFFIX).tempfile_in(parent)?;

    faults::check(temp.path())?;
    temp.write_all(bytes)?;
    faults::check(path)?;
    temp.persist(path).map_err(|error| error.error)?;

    Ok(())
}

pub fn file_sha256(path: &Path) -> AppResult<String> {
    let mut file = fs::File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = vec![0; HASH_BUFFER_BYTES];

    loop {
        let read = file.read(&mut buffer)?;

        if read == 0 {
            break;
        }

        hasher.update(&buffer[..read]);
    }

    Ok(hex::encode(hasher.finalize()))
}

pub fn same_content(left: &Path, right: &Path) -> bool {
    let size = |path: &Path| fs::metadata(path).ok().filter(fs::Metadata::is_file).map(|metadata| metadata.len());

    size(left).is_some_and(|left_size| size(right) == Some(left_size))
        && matches!((file_sha256(left), file_sha256(right)), (Ok(left), Ok(right)) if left == right)
}

pub fn copy_verified(from: &Path, to: &Path) -> AppResult<()> {
    copy_expected(from, to, None)
}

pub fn copy_expected(from: &Path, to: &Path, sha256: Option<&str>) -> AppResult<()> {
    let part = sibling(to, PART_SUFFIX);
    let copied = copy_file(from, &part).and_then(|_| {
        let intact = match sha256 {
            Some(expected) => file_sha256(&part).is_ok_and(|actual| actual.eq_ignore_ascii_case(expected)),
            None => same_content(from, &part),
        };

        if !intact {
            return Err(AppError::coded(ErrorCode::ChecksumMismatch, format!("the copy of {} differs", from.display())));
        }

        rename_file(&part, to)
    });

    if copied.is_err() {
        let _ = fs::remove_file(&part);
    }

    copied
}

pub fn available_space(path: &Path) -> Option<u64> {
    let target = normalized(path);
    let disks = sysinfo::Disks::new_with_refreshed_list();

    disks
        .list()
        .iter()
        .filter(|disk| target.starts_with(&normalized(disk.mount_point())))
        .max_by_key(|disk| disk.mount_point().as_os_str().len())
        .map(sysinfo::Disk::available_space)
}

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
            bytes += copy_file(entry.path(), &target)?;
        }
    }

    Ok(bytes)
}

pub fn sibling(path: &Path, suffix: &str) -> PathBuf {
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
