use super::{LatestRelease, Release, ReleasePackage, ReleaseStatus};

pub fn release(version: &str) -> Release {
    Release {
        version: version.to_owned(),
        published_at: "2026-09-27T12:00:00.000Z".to_owned(),
        games: vec!["1.46.*".to_owned()],
        notes: None,
        catalog: None,
        packages: ["core", "companion"]
            .iter()
            .map(|id| ReleasePackage {
                id: (*id).to_owned(),
                file: format!("net.triotmetki.{id}_{version}.mtmod"),
                url: format!("https://cdn.triotmetki.ru/modpack/{version}/net.triotmetki.{id}_{version}.mtmod"),
                sha256: "0".repeat(64),
                size: 1,
            })
            .collect(),
    }
}

pub fn latest(game: &str, release: Option<Release>) -> LatestRelease {
    LatestRelease { game: game.to_owned(), status: if release.is_some() { ReleaseStatus::Compatible } else { ReleaseStatus::Waiting }, release }
}
