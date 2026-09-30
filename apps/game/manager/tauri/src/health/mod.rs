use std::path::Path;

use serde::Serialize;

use crate::report::{read_tail, Redactor};

pub const PREFIX: &str = "[OTMETKI]";
pub const REGISTER_FAILED: &str = "failed to register ";
pub const START_FAILED: &str = "failed to start";
pub const COMPANION: &str = "companion";
pub const ENTRY_PREFIX: &str = "mod_otmetki_";
pub const COMPANION_ENTRY: &str = "mod_otmetki.py";
pub const SCAN_BYTES: u64 = 4 * 1024 * 1024;
pub const MAX_EXCERPT_CHARS: usize = 240;
pub const OUTDATED_MARKERS: [&str; 3] = ["bad magic number", "bad marshal data", "unknown opcode"];
pub const DEPENDENCY_MARKERS: [&str; 4] = ["gambiter", "openwg", "gameface", "guiflash"];
pub const TRACEBACK: &str = "Traceback (most recent call last)";
pub const TRACEBACK_WINDOW: usize = 40;
pub const EXCEPTION_WINDOW: usize = 60;
pub const MISSING_MODULE: &str = "no module named";
pub const OUR_MODULE: &str = "otmetki";

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum FailureKind {
    Outdated,
    Dependency,
    Install,
    Error,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum LogSource {
    PythonLog,
    OtmetkiLog,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadFailure {
    pub component: String,
    pub kind: FailureKind,
    pub source: LogSource,
    pub excerpt: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthReport {
    pub log_time: Option<String>,
    pub stale: bool,
    pub failures: Vec<LoadFailure>,
}

fn is_component_id(id: &str) -> bool {
    !id.is_empty() && id.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_')
}

fn entry_component(line: &str) -> Option<String> {
    let lower = line.to_lowercase();

    if lower.contains(COMPANION_ENTRY) {
        return Some(COMPANION.to_owned());
    }

    let rest = &lower[lower.find(ENTRY_PREFIX)? + ENTRY_PREFIX.len()..];
    let id: String = rest.chars().take_while(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || *c == '_').collect();

    is_component_id(&id).then_some(id)
}

fn marker_component(line: &str) -> Option<String> {
    let rest = line[line.find(PREFIX)? + PREFIX.len()..].trim_start();

    if rest.starts_with(START_FAILED) {
        return Some(COMPANION.to_owned());
    }

    let id = rest.strip_prefix(REGISTER_FAILED)?.split_whitespace().next()?;

    is_component_id(id).then(|| id.to_owned())
}

fn is_exception_line(line: &str) -> bool {
    let trimmed = line.trim_end();

    !trimmed.is_empty()
        && !line.starts_with([' ', '\t'])
        && !trimmed.contains(TRACEBACK)
        && !trimmed.contains(PREFIX)
        && trimmed.split(':').next().is_some_and(|head| head.ends_with("Error") || head.ends_with("Exception") || head.contains('.'))
        && trimmed.contains(':')
}

pub fn classify(exception: &str) -> FailureKind {
    let lower = exception.to_lowercase();

    if OUTDATED_MARKERS.iter().any(|marker| lower.contains(marker)) {
        return FailureKind::Outdated;
    }

    if lower.contains(MISSING_MODULE) {
        if DEPENDENCY_MARKERS.iter().any(|marker| lower.contains(marker)) {
            return FailureKind::Dependency;
        }

        if lower.contains(OUR_MODULE) {
            return FailureKind::Install;
        }
    }

    FailureKind::Error
}

fn excerpt(text: &str, redactor: &Redactor) -> String {
    redactor.redact(text.trim()).0.chars().take(MAX_EXCERPT_CHARS).collect()
}

pub fn scan_text(text: &str, source: LogSource, redactor: &Redactor) -> Vec<LoadFailure> {
    let lines: Vec<&str> = text.lines().collect();
    let mut failures: Vec<LoadFailure> = Vec::new();
    let mut index = 0;

    while index < lines.len() {
        let line = lines[index];
        let from_marker = marker_component(line);
        let in_traceback = from_marker.is_none()
            && line.trim_start().starts_with("File ")
            && lines[..index].iter().rev().take(TRACEBACK_WINDOW).any(|prior| prior.contains(TRACEBACK));
        let component = from_marker.clone().or_else(|| in_traceback.then(|| entry_component(line)).flatten());

        index += 1;

        let Some(component) = component else {
            continue;
        };

        let exception = lines[index..].iter().take(EXCEPTION_WINDOW).find(|candidate| is_exception_line(candidate)).copied().unwrap_or(line);

        if !failures.iter().any(|known| known.component == component) {
            failures.push(LoadFailure { component, kind: classify(exception), source, excerpt: excerpt(exception, redactor) });
        }
    }

    failures
}

pub fn scan_file(path: &Path, source: LogSource, redactor: &Redactor) -> Vec<LoadFailure> {
    read_tail(path, SCAN_BYTES).map(|(text, _)| scan_text(&text, source, redactor)).unwrap_or_default()
}

pub fn merge_failures(groups: Vec<Vec<LoadFailure>>, known: Option<&[String]>) -> Vec<LoadFailure> {
    let mut merged: Vec<LoadFailure> = Vec::new();

    for failure in groups.into_iter().flatten() {
        let catalogued = known.is_none_or(|ids| ids.contains(&failure.component));

        if catalogued && !merged.iter().any(|item| item.component == failure.component) {
            merged.push(failure);
        }
    }

    merged
}

#[cfg(test)]
mod tests;
