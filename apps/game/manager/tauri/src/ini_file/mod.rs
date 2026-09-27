use std::fs;
use std::path::Path;

use ini::{EscapePolicy, Ini, LineSeparator, ParseOption, WriteOption};

use crate::error::{AppError, AppResult, ErrorCode};

const UTF16_LE_BOM: [u8; 2] = [0xFF, 0xFE];
const UTF16_BE_BOM: [u8; 2] = [0xFE, 0xFF];
const UTF8_BOM: [u8; 3] = [0xEF, 0xBB, 0xBF];

pub fn decode_text(bytes: &[u8]) -> String {
    if bytes.starts_with(&UTF16_LE_BOM) {
        return decode_utf16(&bytes[2..], u16::from_le_bytes);
    }

    if bytes.starts_with(&UTF16_BE_BOM) {
        return decode_utf16(&bytes[2..], u16::from_be_bytes);
    }

    let body = bytes.strip_prefix(&UTF8_BOM).unwrap_or(bytes);

    String::from_utf8_lossy(body).into_owned()
}

fn decode_utf16(bytes: &[u8], read: fn([u8; 2]) -> u16) -> String {
    let units: Vec<u16> = bytes.chunks_exact(2).map(|pair| read([pair[0], pair[1]])).collect();

    String::from_utf16_lossy(&units)
}

pub fn parse(text: &str) -> AppResult<Ini> {
    let options = ParseOption { enabled_quote: false, enabled_escape: false, ..ParseOption::default() };

    Ini::load_from_str_opt(text, options).map_err(|error| AppError::coded(ErrorCode::Io, format!("ini: {error}")))
}

pub fn read(path: &Path) -> AppResult<Option<Ini>> {
    if !path.is_file() {
        return Ok(None);
    }

    let text = decode_text(&fs::read(path)?);

    parse(&text).map(Some)
}

pub fn to_text(ini: &Ini) -> AppResult<String> {
    let mut buffer = Vec::new();
    let options = WriteOption { escape_policy: EscapePolicy::Nothing, line_separator: LineSeparator::CRLF, ..WriteOption::default() };

    ini.write_to_opt(&mut buffer, options)?;

    Ok(String::from_utf8_lossy(&buffer).into_owned())
}

pub fn write(path: &Path, ini: &Ini) -> AppResult<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }

    let text = to_text(ini)?;
    let mut bytes = UTF16_LE_BOM.to_vec();

    bytes.extend(text.encode_utf16().flat_map(u16::to_le_bytes));
    fs::write(path, bytes)?;

    Ok(())
}

pub fn get<'a>(ini: &'a Ini, section: &str, key: &str) -> Option<&'a str> {
    ini.section(Some(section)).and_then(|values| values.get(key)).map(str::trim)
}

pub fn get_bool(ini: &Ini, section: &str, key: &str) -> bool {
    matches!(get(ini, section, key).map(str::to_ascii_lowercase).as_deref(), Some("1" | "true" | "yes"))
}

#[cfg(test)]
mod tests;
