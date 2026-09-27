use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use crate::error::AppResult;

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Localized {
    pub ru: String,
    pub en: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Category {
    pub id: String,
    pub title: Localized,
    #[serde(default)]
    pub description: Localized,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Preset {
    pub id: String,
    pub title: Localized,
    #[serde(default)]
    pub description: Localized,
    #[serde(default)]
    pub custom: bool,
}

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Preview {
    pub image: Option<String>,
    pub video: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CatalogComponent {
    pub id: String,
    pub package_id: String,
    pub version: String,
    pub file: String,
    pub category: String,
    pub title: Localized,
    #[serde(default)]
    pub description: Localized,
    #[serde(default)]
    pub fair_play: Localized,
    #[serde(default)]
    pub required: bool,
    #[serde(default)]
    pub default: bool,
    #[serde(default)]
    pub presets: Vec<String>,
    #[serde(default)]
    pub preview: Preview,
    #[serde(default)]
    pub dependencies: Vec<String>,
    #[serde(default = "catalogued_default")]
    pub catalogued: bool,
    #[serde(default)]
    pub sha256: Option<String>,
    #[serde(default)]
    pub size: Option<u64>,
}

fn catalogued_default() -> bool {
    true
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Catalog {
    pub schema_version: u32,
    pub modpack_version: String,
    #[serde(default)]
    pub platform: String,
    #[serde(default)]
    pub extension: String,
    #[serde(default)]
    pub categories: Vec<Category>,
    #[serde(default)]
    pub presets: Vec<Preset>,
    #[serde(default)]
    pub components: Vec<CatalogComponent>,
    #[serde(default)]
    pub owned_patterns: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CatalogSource {
    Downloaded,
    Bundled,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadedCatalog {
    #[serde(flatten)]
    pub catalog: Catalog,
    pub source: CatalogSource,
    pub previews_dir: Option<PathBuf>,
}

pub struct LoadInput<'a> {
    pub cache: &'a Path,
    pub bundled: Option<&'a Path>,
}

pub fn parse(text: &str) -> AppResult<Catalog> {
    Ok(serde_json::from_str(text.trim_start_matches('\u{feff}'))?)
}

fn read_catalog(path: &Path) -> Option<Catalog> {
    fs::read_to_string(path).ok().and_then(|text| parse(&text).ok())
}

fn newer(left: &Catalog, right: &Catalog) -> bool {
    match (semver::Version::parse(&left.modpack_version), semver::Version::parse(&right.modpack_version)) {
        (Ok(left), Ok(right)) => left >= right,
        _ => true,
    }
}

pub fn load(input: LoadInput) -> Option<LoadedCatalog> {
    let downloaded = read_catalog(input.cache).map(|catalog| (catalog, CatalogSource::Downloaded, input.cache));
    let bundled = input.bundled.and_then(|path| read_catalog(path).map(|catalog| (catalog, CatalogSource::Bundled, path)));
    let (catalog, source, path) = match (downloaded, bundled) {
        (Some(downloaded), Some(bundled)) if !newer(&downloaded.0, &bundled.0) => bundled,
        (Some(downloaded), _) => downloaded,
        (None, bundled) => bundled?,
    };
    let previews_dir = path.parent().map(Path::to_path_buf).filter(|dir| dir.join("previews").is_dir());

    Some(LoadedCatalog { catalog, source, previews_dir })
}

impl Catalog {
    pub fn component(&self, id: &str) -> Option<&CatalogComponent> {
        self.components.iter().find(|component| component.id == id)
    }

    pub fn with_dependencies<'a>(&self, ids: impl IntoIterator<Item = &'a str>) -> BTreeSet<String> {
        let mut result = BTreeSet::new();
        let mut pending: Vec<String> = ids.into_iter().map(str::to_owned).collect();

        while let Some(id) = pending.pop() {
            let Some(component) = self.component(&id) else {
                continue;
            };

            if result.insert(id) {
                pending.extend(component.dependencies.iter().cloned());
            }
        }

        result
    }

    pub fn with_dependents(&self, id: &str) -> BTreeSet<String> {
        let mut result = BTreeSet::from([id.to_owned()]);
        let mut changed = true;

        while changed {
            changed = false;

            for component in &self.components {
                let depends_on_result = component.dependencies.iter().any(|dependency| result.contains(dependency));

                if depends_on_result && result.insert(component.id.clone()) {
                    changed = true;
                }
            }
        }

        result
    }

    pub fn is_owned_file(&self, file_name: &str) -> bool {
        self.owned_patterns.iter().any(|pattern| wildcard_match(pattern, file_name))
    }

    pub fn component_for_file(&self, file_name: &str) -> Option<&CatalogComponent> {
        let lowered = file_name.to_lowercase();

        self.components.iter().find(|component| {
            let prefix = format!("{}_", component.package_id.to_lowercase());
            let extension = Path::new(&component.file).extension().map(|ext| ext.to_string_lossy().to_lowercase());

            lowered == component.file.to_lowercase()
                || (lowered.starts_with(&prefix) && Path::new(&lowered).extension().map(|ext| ext.to_string_lossy().to_lowercase()) == extension)
        })
    }
}

pub fn wildcard_match(pattern: &str, text: &str) -> bool {
    let pattern: Vec<char> = pattern.to_lowercase().chars().collect();
    let text: Vec<char> = text.to_lowercase().chars().collect();
    let (mut p, mut t) = (0, 0);
    let mut backtrack: Option<(usize, usize)> = None;

    while t < text.len() {
        match pattern.get(p) {
            Some('*') => {
                backtrack = Some((p, t));
                p += 1;
            }
            Some(&c) if c == '?' || c == text[t] => {
                p += 1;
                t += 1;
            }
            _ => match backtrack {
                Some((star, matched)) => {
                    p = star + 1;
                    t = matched + 1;
                    backtrack = Some((star, matched + 1));
                }
                None => return false,
            },
        }
    }

    pattern[p..].iter().all(|&c| c == '*')
}

#[cfg(test)]
pub mod fixtures;

#[cfg(test)]
mod tests;
