use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

use chrono::{DateTime, Local};
use zip::write::SimpleFileOptions;
use zip::{CompressionMethod, ZipWriter};

use crate::detect::GameClient;
use crate::error::{AppError, AppResult, ErrorCode};
use crate::fsx::list_files;
use crate::paths::{configs_dir, Layout};
use crate::state::{client_key, disabled_dir, CLIENT_INI, MANIFEST_INI};

pub const ZIP_PREFIX: &str = "otmetki-logs-";
pub const STAMP_FORMAT: &str = "%Y%m%d-%H%M%S";
pub const CLIENT_FILES: [&str; 3] = ["python.log", "version.xml", "paths.xml"];
pub const CONFIG_FILES: [&str; 3] = ["config.json", "components.json", "profiles.json"];
pub const MAX_LOG_BYTES: u64 = 16 * 1024 * 1024;

pub struct CollectInput<'a> {
    pub layout: &'a Layout,
    pub clients: &'a [GameClient],
    pub output_dir: &'a Path,
    pub now: DateTime<Local>,
}

struct Bundle {
    writer: ZipWriter<File>,
    options: SimpleFileOptions,
}

impl Bundle {
    fn add_bytes(&mut self, name: &str, bytes: &[u8]) -> AppResult<()> {
        self.writer.start_file(name, self.options).map_err(|error| AppError::coded(ErrorCode::Io, error.to_string()))?;
        self.writer.write_all(bytes)?;

        Ok(())
    }

    fn add_file(&mut self, name: &str, path: &Path) -> AppResult<()> {
        let small_enough = fs::metadata(path).is_ok_and(|metadata| metadata.is_file() && metadata.len() <= MAX_LOG_BYTES);

        if small_enough {
            self.add_bytes(name, &fs::read(path)?)?;
        }

        Ok(())
    }
}

fn listing(dirs: &[(&str, PathBuf)]) -> String {
    dirs.iter()
        .map(|(label, dir)| {
            let files: Vec<String> = list_files(dir)
                .iter()
                .map(|path| {
                    let size = fs::metadata(path).map(|metadata| metadata.len()).unwrap_or_default();

                    format!("  {} ({size} B)", path.file_name().unwrap_or_default().to_string_lossy())
                })
                .collect();

            format!("{label}: {}\n{}\n", dir.display(), files.join("\n"))
        })
        .collect()
}

pub fn collect(input: CollectInput) -> AppResult<PathBuf> {
    let zip_path = input.output_dir.join(format!("{ZIP_PREFIX}{}.zip", input.now.format(STAMP_FORMAT)));

    fs::create_dir_all(input.output_dir)?;

    let mut bundle = Bundle {
        writer: ZipWriter::new(File::create(&zip_path)?),
        options: SimpleFileOptions::default().compression_method(CompressionMethod::Deflated),
    };

    for log in list_files(&input.layout.logs_dir()) {
        let name = log.file_name().unwrap_or_default().to_string_lossy().into_owned();

        bundle.add_file(&format!("manager/{name}"), &log)?;
    }

    bundle.add_file("manager/settings.json", &input.layout.settings_file())?;

    for client in input.clients {
        let key = client_key(&client.path);
        let state_dir = input.layout.client_dir(&client.path);
        let prefix = format!("clients/{key}");
        let dirs = [("mods", client.mods_dir.clone()), ("res_mods", client.res_mods_dir.clone()), ("disabled", disabled_dir(&state_dir))];

        bundle.add_bytes(&format!("{prefix}/client.txt"), format!("{}\n{}\n", client.path.display(), client.version).as_bytes())?;
        bundle.add_bytes(&format!("{prefix}/listing.txt"), listing(&dirs).as_bytes())?;

        for name in CLIENT_FILES {
            bundle.add_file(&format!("{prefix}/{name}"), &client.path.join(name))?;
        }

        for name in CONFIG_FILES {
            bundle.add_file(&format!("{prefix}/configs/{name}"), &configs_dir(&client.path).join(name))?;
        }

        for name in [MANIFEST_INI, CLIENT_INI] {
            bundle.add_file(&format!("{prefix}/state/{name}"), &state_dir.join(name))?;
        }
    }

    bundle.writer.finish().map_err(|error| AppError::coded(ErrorCode::Io, error.to_string()))?;

    Ok(zip_path)
}

#[cfg(test)]
mod tests;
