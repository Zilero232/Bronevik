use super::{SetsFile, MAX_SETS, MAX_TOMBSTONES};
use crate::sync::{merge_items, Side};

pub fn merge(local: &SetsFile, remote: &SetsFile) -> SetsFile {
    let merged = merge_items(
        &Side { items: &local.sets, deleted: &local.deleted },
        &Side { items: &remote.sets, deleted: &remote.deleted },
        MAX_SETS,
        MAX_TOMBSTONES,
    );
    let synced_at = match (local.synced_at, remote.synced_at) {
        (Some(left), Some(right)) => Some(left.max(right)),
        (left, right) => left.or(right),
    };

    SetsFile { version: local.version, sets: merged.items, deleted: merged.deleted, synced_at, revision: local.revision }
}
