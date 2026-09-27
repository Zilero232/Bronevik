use serde::Serialize;

use crate::profiles::CODE_PREFIX;

pub const SCHEME: &str = "triotmetki";
pub const EVENT: &str = "deep-link";
pub const MAX_LINK_LENGTH: usize = 64 * 1024;
pub const PRESET_PATTERN_MAX: usize = 32;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum DeepLink {
    Open,
    Profile { code: String },
    Install { preset: Option<String> },
}

fn query_value<'a>(query: &'a str, key: &str) -> Option<&'a str> {
    query.split('&').filter_map(|pair| pair.split_once('=')).find(|(name, _)| *name == key).map(|(_, value)| value)
}

fn valid_preset(preset: &str) -> bool {
    !preset.is_empty() && preset.len() <= PRESET_PATTERN_MAX && preset.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_')
}

pub fn parse(url: &str) -> Option<DeepLink> {
    let url = url.trim();

    if url.len() > MAX_LINK_LENGTH {
        return None;
    }

    let (scheme, rest) = url.split_once("://")?;

    if !scheme.eq_ignore_ascii_case(SCHEME) {
        return None;
    }

    let (path, query) = rest.split_once('?').unwrap_or((rest, ""));
    let mut segments = path.trim_end_matches('/').splitn(2, '/');

    match (segments.next()?, segments.next()) {
        ("" | "open", None) => Some(DeepLink::Open),
        ("profile", Some(code)) if code.starts_with(CODE_PREFIX) => Some(DeepLink::Profile { code: code.to_owned() }),
        ("install", None) => {
            Some(DeepLink::Install { preset: query_value(query, "preset").filter(|preset| valid_preset(preset)).map(str::to_owned) })
        }
        _ => None,
    }
}

pub fn first_link<'a>(urls: impl IntoIterator<Item = &'a str>) -> Option<DeepLink> {
    urls.into_iter().find_map(parse)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn opens_the_app() {
        assert_eq!(parse("triotmetki://open"), Some(DeepLink::Open));
        assert_eq!(parse("triotmetki://"), Some(DeepLink::Open));
    }

    #[test]
    fn imports_a_profile_code() {
        assert_eq!(
            parse("triotmetki://profile/TM1.eJyrVkrLz1eyUkpKLFKqBQApfgT-"),
            Some(DeepLink::Profile { code: "TM1.eJyrVkrLz1eyUkpKLFKqBQApfgT-".into() })
        );
        assert_eq!(parse("triotmetki://profile/not-a-code"), None);
    }

    #[test]
    fn starts_an_install_with_a_preset() {
        assert_eq!(parse("triotmetki://install?preset=minimal"), Some(DeepLink::Install { preset: Some("minimal".into()) }));
        assert_eq!(parse("triotmetki://install"), Some(DeepLink::Install { preset: None }));
        assert_eq!(parse("triotmetki://install?preset=../x"), Some(DeepLink::Install { preset: None }));
    }

    #[test]
    fn ignores_other_schemes_and_paths() {
        assert_eq!(parse("https://triotmetki.ru/open"), None);
        assert_eq!(parse("triotmetki://uninstall"), None);
    }

    #[test]
    fn takes_the_first_valid_link_from_the_arguments() {
        let args = ["C:\\otmetki-manager.exe", "triotmetki://open"];

        assert_eq!(first_link(args), Some(DeepLink::Open));
    }
}
