use std::fs::File;
use std::io::Read;
use std::path::{Path, PathBuf};

use walkdir::WalkDir;

use crate::catalog::PACKAGE_EXTENSIONS;
use crate::dependencies::SEARCH_DEPTH;

pub const META_XML: &str = "meta.xml";
pub const META_ID: &str = "id";
pub const MAX_META_BYTES: u64 = 64 * 1024;
pub const MAX_ENTRIES: usize = 100_000;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModPackage {
    pub path: PathBuf,
    pub name: String,
    pub package_id: String,
    pub entries: Vec<String>,
}

pub fn package_files(mods_dir: &Path) -> Vec<PathBuf> {
    let mut found: Vec<PathBuf> = WalkDir::new(mods_dir)
        .max_depth(SEARCH_DEPTH)
        .follow_links(false)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
        .map(|entry| entry.into_path())
        .filter(|path| {
            path.extension()
                .map(|extension| extension.to_string_lossy().to_lowercase())
                .is_some_and(|extension| PACKAGE_EXTENSIONS.contains(&extension.as_str()))
        })
        .collect();

    found.sort();
    found
}

pub fn id_from_name(name: &str) -> String {
    let stem = Path::new(name).file_stem().map(|stem| stem.to_string_lossy().to_lowercase()).unwrap_or_default();

    match stem.rsplit_once('_') {
        Some((id, version)) if !id.is_empty() && version.starts_with(|c: char| c.is_ascii_digit()) => id.to_owned(),
        _ => stem,
    }
}

fn meta_id(text: &str) -> Option<String> {
    let document = roxmltree::Document::parse(text.trim_start_matches('\u{feff}')).ok()?;
    let id = document.descendants().find(|node| node.has_tag_name(META_ID))?.text()?.trim().to_lowercase();

    (!id.is_empty()).then_some(id)
}

fn read_archive(path: &Path) -> Option<(Option<String>, Vec<String>)> {
    let mut archive = zip::ZipArchive::new(File::open(path).ok()?).ok()?;
    let entries: Vec<String> = archive.file_names().take(MAX_ENTRIES).map(|name| name.replace('\\', "/")).collect();
    let mut text = String::new();
    let id = archive.by_name(META_XML).ok().and_then(|meta| meta.take(MAX_META_BYTES).read_to_string(&mut text).ok()).and_then(|_| meta_id(&text));

    Some((id, entries))
}

pub fn read_package(path: &Path) -> ModPackage {
    let name = path.file_name().map(|name| name.to_string_lossy().into_owned()).unwrap_or_default();
    let (id, entries) = read_archive(path).unwrap_or_default();

    ModPackage { path: path.to_path_buf(), package_id: id.unwrap_or_else(|| id_from_name(&name)), name, entries }
}
