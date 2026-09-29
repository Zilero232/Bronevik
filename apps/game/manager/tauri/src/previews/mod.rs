use std::collections::BTreeSet;
use std::path::Path;

use crate::catalog::Catalog;
use crate::fsx::write_atomic;
use crate::paths::join_relative;
use crate::releases::{safe_file_name, FetchLimits, ReleasesClient};

pub const DIR: &str = "previews";
pub const MAX_PREVIEW_BYTES: u64 = 8 * 1024 * 1024;
pub const EXTENSIONS: [&str; 8] = ["png", "jpg", "jpeg", "webp", "gif", "mp3", "ogg", "wav"];

pub fn is_preview_file(file: &str) -> bool {
    let Some((dir, name)) = file.split_once('/') else {
        return false;
    };
    let extension = Path::new(name).extension().map(|extension| extension.to_string_lossy().to_lowercase());

    dir == DIR && safe_file_name(name).is_ok() && extension.is_some_and(|extension| EXTENSIONS.contains(&extension.as_str()))
}

pub fn files(catalog: &Catalog) -> Vec<String> {
    let listed: BTreeSet<&String> = catalog
        .components
        .iter()
        .flat_map(|component| [component.preview.image.as_ref(), component.preview.audio.as_ref()])
        .flatten()
        .filter(|file| is_preview_file(file))
        .collect();

    listed.into_iter().cloned().collect()
}

pub fn url(catalog_url: &str, file: &str) -> Option<String> {
    let (base, _) = catalog_url.split(['?', '#']).next()?.rsplit_once('/')?;

    Some(format!("{base}/{file}"))
}

pub struct PendingInput<'a> {
    pub root: &'a Path,
    pub files: Vec<String>,
    pub refresh: bool,
}

pub fn pending(input: PendingInput) -> Vec<String> {
    input.files.into_iter().filter(|file| input.refresh || join_relative(input.root, file).is_some_and(|path| !path.is_file())).collect()
}

pub struct DownloadInput<'a> {
    pub client: &'a ReleasesClient,
    pub root: &'a Path,
    pub catalog_url: &'a str,
    pub files: &'a [String],
}

pub async fn download(input: DownloadInput<'_>) -> usize {
    let mut written = 0;

    for file in input.files {
        let (Some(source), Some(path)) = (url(input.catalog_url, file), join_relative(input.root, file)) else {
            continue;
        };
        let fetched = input.client.fetch(&source, FetchLimits { expected_size: None, max_bytes: MAX_PREVIEW_BYTES }).await;

        match fetched.and_then(|bytes| write_atomic(&path, &bytes)) {
            Ok(()) => written += 1,
            Err(error) => log::warn!("preview {file}: {error}"),
        }
    }

    written
}

#[cfg(test)]
mod tests;
