use std::fs;
use std::path::{Path, PathBuf};

use crate::components::{is_owned, sync_manifest, ClientContext};
use crate::dependencies::{carry, CarryInput};
use crate::error::AppResult;
use crate::fsx::{copy_verified, list_files, same_content};
use crate::state::save_client_state;

pub struct MigrateInput<'a> {
    pub context: ClientContext<'a>,
    pub from_mods_dir: &'a Path,
}

fn undo(copied: &[PathBuf]) {
    for path in copied {
        if let Err(error) = fs::remove_file(path) {
            log::warn!("migrate rollback: {}: {error}", path.display());
        }
    }
}

pub fn migrate(input: MigrateInput) -> AppResult<Vec<String>> {
    let catalog = input.context.catalog;
    let target = &input.context.client.mods_dir;
    let mut copied: Vec<PathBuf> = Vec::new();

    fs::create_dir_all(target)?;

    for file in list_files(input.from_mods_dir) {
        let Some(name) = file.file_name().map(|name| name.to_string_lossy().into_owned()) else {
            continue;
        };
        let destination = target.join(&name);

        if !is_owned(catalog, &name) || same_content(&file, &destination) {
            continue;
        }

        if let Err(error) = copy_verified(&file, &destination) {
            undo(&copied);

            return Err(error);
        }

        copied.push(destination);
    }

    let carried = carry(CarryInput { context: input.context, from_mods_dir: input.from_mods_dir });

    if let Err(error) = carried {
        undo(&copied);

        return Err(error);
    }

    sync_manifest(input.context)?;
    save_client_state(input.context.client_dir, input.context.client)?;

    Ok(copied.iter().filter_map(|path| path.file_name()).map(|name| name.to_string_lossy().into_owned()).collect())
}
