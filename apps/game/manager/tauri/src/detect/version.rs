use std::cmp::Ordering;
use std::fmt;

use serde::{Serialize, Serializer};

pub const MIN_SUPPORTED: GameVersion = GameVersion([1, 35, 0, 0]);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct GameVersion(pub [u32; 4]);

impl GameVersion {
    pub fn parse(text: &str) -> Option<Self> {
        let trimmed = text.trim();
        let body = trimmed.strip_prefix("v.").unwrap_or(trimmed);
        let token = body.split(|c: char| c.is_whitespace() || c == '#').next()?;
        let parts: Vec<u32> = token.split('.').map(|part| part.trim().parse().ok()).collect::<Option<_>>()?;

        if parts.len() < 2 || parts.len() > 4 {
            return None;
        }

        let mut numbers = [0; 4];

        numbers[..parts.len()].copy_from_slice(&parts);

        Some(Self(numbers))
    }

    pub fn is_supported(&self) -> bool {
        self.0[0] == MIN_SUPPORTED.0[0] && *self >= MIN_SUPPORTED
    }
}

impl Ord for GameVersion {
    fn cmp(&self, other: &Self) -> Ordering {
        self.0.cmp(&other.0)
    }
}

impl PartialOrd for GameVersion {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl fmt::Display for GameVersion {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let [major, minor, patch, build] = self.0;

        write!(formatter, "{major}.{minor}.{patch}.{build}")
    }
}

impl Serialize for GameVersion {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.collect_str(self)
    }
}
