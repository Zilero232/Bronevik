use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use minisign_verify::{PublicKey, Signature};

use super::{Release, ReleasePackage};
use crate::error::{AppError, AppResult, ErrorCode};

pub const RELEASE_PUBLIC_KEY: &str = "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDk4RjE3QzUzQzAxMkEwNEEKUldSS29CTEFVM3p4bU9mc3dpaEcwcHdyT1VhaXlMbXVneXltMXBOQ3V1ZUF2dnhBRE1pd1VjcTAK";
pub const PAYLOAD_HEADER: &str = "otmetki-modpack-release/1";
pub const NO_CATALOG: &str = "-";
pub const ALLOW_UNSIGNED_ENV: &str = "OTMETKI_ALLOW_UNSIGNED";
pub const ALLOW_LEGACY_SIGNATURES: bool = true;

fn invalid(reason: impl std::fmt::Display) -> AppError {
    AppError::coded(ErrorCode::SignatureInvalid, format!("release signature: {reason}"))
}

pub fn signed_payload(release: &Release) -> String {
    let mut packages: Vec<&ReleasePackage> = release.packages.iter().collect();

    packages.sort_by(|left, right| left.id.cmp(&right.id));

    let catalog = release.catalog.as_ref().map_or_else(|| NO_CATALOG.to_owned(), |catalog| catalog.sha256.trim().to_ascii_lowercase());
    let mut lines = vec![
        PAYLOAD_HEADER.to_owned(),
        format!("version {}", release.version),
        format!("games {}", release.games.join(",")),
        format!("catalog {catalog}"),
    ];

    lines.extend(
        packages
            .iter()
            .map(|package| format!("package {} {} {} {}", package.id, package.file, package.size, package.sha256.trim().to_ascii_lowercase())),
    );

    format!("{}\n", lines.join("\n"))
}

fn decode_text(encoded: &str) -> AppResult<String> {
    let bytes = STANDARD.decode(encoded.trim()).map_err(invalid)?;

    String::from_utf8(bytes).map_err(invalid)
}

pub fn verify_release_with(release: &Release, public_key: &str) -> AppResult<()> {
    let encoded = release.signature.as_deref().filter(|signature| !signature.trim().is_empty()).ok_or_else(|| invalid("missing"))?;
    let key = PublicKey::decode(&decode_text(public_key)?).map_err(invalid)?;
    let signature = Signature::decode(&decode_text(encoded)?).map_err(invalid)?;

    key.verify(signed_payload(release).as_bytes(), &signature, ALLOW_LEGACY_SIGNATURES).map_err(invalid)
}

fn unsigned_allowed(release: &Release) -> bool {
    cfg!(debug_assertions) && release.signature.is_none() && std::env::var_os(ALLOW_UNSIGNED_ENV).is_some()
}

pub fn verify_release(release: &Release) -> AppResult<()> {
    if unsigned_allowed(release) {
        log::warn!("accepting the unsigned release {} ({ALLOW_UNSIGNED_ENV})", release.version);

        return Ok(());
    }

    verify_release_with(release, RELEASE_PUBLIC_KEY)
}
