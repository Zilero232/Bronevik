use std::fs;
use std::path::Path;

use crate::components::{sync_manifest, ClientContext};
use crate::error::AppResult;
use crate::fsx::list_files;
use crate::state::save_client_state;

pub struct MigrateInput<'a> {
    pub context: ClientContext<'a>,
    pub from_mods_dir: &'a Path,
}

pub fn migrate(input: MigrateInput) -> AppResult<Vec<String>> {
    let catalog = input.context.catalog;
    let target = &input.context.client.mods_dir;
    let mut copied = Vec::new();

    fs::create_dir_all(target)?;

    for file in list_files(input.from_mods_dir) {
        let Some(name) = file.file_name().map(|name| name.to_string_lossy().into_owned()) else {
            continue;
        };
        let ours = catalog.component_for_file(&name).is_some() || catalog.is_owned_file(&name);
        let destination = target.join(&name);

        if ours && !destination.exists() {
            fs::copy(&file, &destination)?;
            copied.push(name);
        }
    }

    sync_manifest(input.context)?;
    save_client_state(input.context.client_dir, input.context.client)?;

    Ok(copied)
}
