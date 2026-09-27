use std::path::{Path, PathBuf};

use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, RefreshKind, System, UpdateKind};

use crate::error::{AppError, AppResult, ErrorCode};
use crate::paths::normalized;

pub fn is_inside(path: &Path, dir: &Path) -> bool {
    let path = normalized(path);
    let dir = normalized(dir);

    path.len() > dir.len() && path.starts_with(&dir) && path[dir.len()..].starts_with('\\')
}

pub fn running_executables() -> Vec<PathBuf> {
    let refresh = ProcessRefreshKind::nothing().with_exe(UpdateKind::OnlyIfNotSet);
    let mut system = System::new_with_specifics(RefreshKind::nothing().with_processes(refresh));

    system.refresh_processes_specifics(ProcessesToUpdate::All, true, refresh);
    system.processes().values().filter_map(|process| process.exe().map(Path::to_path_buf)).collect()
}

pub fn is_client_running(client_path: &Path) -> bool {
    running_executables().iter().any(|exe| is_inside(exe, client_path))
}

pub fn ensure_closed(client_path: &Path) -> AppResult<()> {
    if is_client_running(client_path) {
        return Err(AppError::coded(ErrorCode::ClientRunning, format!("the game is running from {}", client_path.display())));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_executables_inside_the_client_folder_only() {
        assert!(is_inside(Path::new(r"D:\Игры\Танки\Tanki.exe"), Path::new(r"d:\игры\танки\")));
        assert!(is_inside(Path::new(r"D:\Games\Tanki\win64\WorldOfTanks.exe"), Path::new(r"D:\Games\Tanki")));
        assert!(!is_inside(Path::new(r"D:\Games\Tanki2\Tanki.exe"), Path::new(r"D:\Games\Tanki")));
        assert!(!is_inside(Path::new(r"D:\Games\Tanki"), Path::new(r"D:\Games\Tanki")));
    }
}
