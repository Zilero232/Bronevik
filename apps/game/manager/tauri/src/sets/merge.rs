use std::collections::BTreeMap;

use super::{ComponentSet, SetsFile, Tombstone, MAX_SETS, MAX_TOMBSTONES};

fn newest_first(left: &ComponentSet, right: &ComponentSet) -> std::cmp::Ordering {
    right.updated.total_cmp(&left.updated).then_with(|| left.id.cmp(&right.id))
}

pub fn merge(local: &SetsFile, remote: &SetsFile) -> SetsFile {
    let mut deleted: BTreeMap<String, f64> = BTreeMap::new();

    for tombstone in local.deleted.iter().chain(&remote.deleted) {
        let entry = deleted.entry(tombstone.id.clone()).or_insert(tombstone.deleted);

        *entry = entry.max(tombstone.deleted);
    }

    let mut sets: BTreeMap<String, ComponentSet> = BTreeMap::new();

    for set in local.sets.iter().chain(&remote.sets) {
        if deleted.get(&set.id).is_some_and(|at| *at >= set.updated) {
            continue;
        }

        match sets.get(&set.id) {
            Some(known) if known.updated >= set.updated => {}
            _ => {
                sets.insert(set.id.clone(), set.clone());
            }
        }
    }

    let mut merged: Vec<ComponentSet> = sets.into_values().collect();
    let mut tombstones: Vec<Tombstone> = deleted.into_iter().map(|(id, deleted)| Tombstone { id, deleted }).collect();

    merged.sort_by(newest_first);
    merged.truncate(MAX_SETS);
    merged.sort_by(|left, right| left.created.total_cmp(&right.created).then_with(|| left.id.cmp(&right.id)));
    tombstones.sort_by(|left, right| left.deleted.total_cmp(&right.deleted));

    let excess = tombstones.len().saturating_sub(MAX_TOMBSTONES);

    tombstones.drain(..excess);

    let synced_at = match (local.synced_at, remote.synced_at) {
        (Some(left), Some(right)) => Some(left.max(right)),
        (left, right) => left.or(right),
    };

    SetsFile { version: local.version, sets: merged, deleted: tombstones, synced_at }
}
