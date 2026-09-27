use std::fs;
use std::path::{Path, PathBuf};

use super::{inspect, ClientSource, GameClient};

pub fn write_version_xml(dir: &Path, version: &str, realm: &str) {
    fs::create_dir_all(dir).unwrap();
    fs::write(
        dir.join("version.xml"),
        format!("<version.xml>\n\t<version>\tv.{version} #8259\t</version>\n\t<meta>\n\t\t<realm>\t{realm}\t</realm>\n\t</meta>\n</version.xml>\n"),
    )
    .unwrap();
}

pub fn write_paths_xml(dir: &Path, version: &str) {
    fs::write(
        dir.join("paths.xml"),
        format!(
            "<root>\n\t<Paths>\n\t\t<Path>./res_mods/{version}</Path>\n\t\t<Packages>\n\t\t\t<Root>./mods/{version}</Root>\n\t\t\t<Mask>*.mtmod</Mask>\n\t\t</Packages>\n\t\t<Path>./res</Path>\n\t</Paths>\n</root>\n"
        ),
    )
    .unwrap();
}

pub fn lesta_client_dir(root: &Path, name: &str, version: &str) -> PathBuf {
    let dir = root.join(name);

    write_version_xml(&dir, version, "RU");
    write_paths_xml(&dir, version);
    fs::write(dir.join("Tanki.exe"), b"").unwrap();
    fs::create_dir_all(dir.join("mods").join(version)).unwrap();

    dir
}

pub fn lesta_client(root: &Path, version: &str) -> GameClient {
    let dir = lesta_client_dir(root, "Мир танков", version);

    inspect(&dir, ClientSource::Lgc).unwrap()
}

pub fn patch_client(dir: &Path, version: &str) -> GameClient {
    write_version_xml(dir, version, "RU");
    write_paths_xml(dir, version);
    fs::create_dir_all(dir.join("mods").join(version)).unwrap();

    inspect(dir, ClientSource::Lgc).unwrap()
}

pub fn write_lgc(program_data: &Path, lgc: &Path, clients: &[&Path], selected: Option<&Path>) {
    let data = program_data.join("Lesta").join("GameCenter").join("data");
    let games: String = clients.iter().map(|path| format!("<game><working_dir>{}</working_dir></game>", path.display())).collect();
    let selected = selected.map(|path| format!("<selectedGames><WOT>{}</WOT></selectedGames>", path.display())).unwrap_or_default();

    fs::create_dir_all(&data).unwrap();
    fs::create_dir_all(lgc).unwrap();
    fs::write(data.join("lgc_path.dat"), lgc.display().to_string()).unwrap();
    fs::write(
        lgc.join("preferences.xml"),
        format!("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<protocol name=\"lgc_preferences\"><application><games_manager><games>{games}</games>{selected}</games_manager></application></protocol>\n"),
    )
    .unwrap();
}
