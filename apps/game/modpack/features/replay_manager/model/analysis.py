from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number, string_types, to_text
from ....core.format import format_number
from ....core.me import owned
from .constants import ANALYSIS_FINAL, ANALYSIS_IDS_PER_READ, ANALYSIS_WATCH_S, PARSED


def parse_statuses(data, account_id):
    if not owned(data, account_id) or not isinstance(data.get('replays'), list):
        return {}
    statuses = {}
    for row in data['replays']:
        if not isinstance(row, dict) or not isinstance(row.get('id'), string_types) or not isinstance(row.get('status'), string_types):
            continue
        raw = row.get('highlights') if isinstance(row.get('highlights'), dict) else {}
        highlights = {
            'accuracy': raw.get('accuracy') if is_number(raw.get('accuracy')) else None,
            'damage': raw.get('damage') if is_int(raw.get('damage')) else None,
            'penetrations': raw.get('penetrations') if is_int(raw.get('penetrations')) else None,
        }
        statuses[to_text(row['id'])] = (to_text(row['status']), highlights)
    return statuses


class AnalysisWatch(object):
    """The replays this game session uploaded whose analysis the site has not finished yet, and the ones it has."""

    def __init__(self):
        self.pending = {}
        self.parsed = set()

    def add(self, replay_id, now):
        if isinstance(replay_id, string_types) and replay_id and replay_id not in self.parsed:
            self.pending[to_text(replay_id)] = now

    def due(self, now):
        for replay_id, uploaded_at in list(self.pending.items()):
            if now - uploaded_at > ANALYSIS_WATCH_S:
                del self.pending[replay_id]
        return sorted(self.pending, key=self.pending.get)[:ANALYSIS_IDS_PER_READ]

    def apply(self, statuses):
        finished = []
        for replay_id, (status, highlights) in statuses.items():
            if replay_id not in self.pending or status not in ANALYSIS_FINAL:
                continue
            del self.pending[replay_id]
            if status == PARSED:
                self.parsed.add(replay_id)
                finished.append((replay_id, highlights))
        return finished


def analysis_notice(highlights, translate):
    details = []
    if highlights.get('accuracy') is not None:
        details.append(translate('replay_manager_analysis_accuracy', accuracy=int(round(highlights['accuracy']))))
    if highlights.get('damage') is not None:
        details.append(translate('replay_manager_analysis_damage', damage=format_number(highlights['damage'])))
    if highlights.get('penetrations') is not None:
        details.append(translate('replay_manager_analysis_penetrations', penetrations=highlights['penetrations']))
    if not details:
        return translate('replay_manager_analysis_plain')
    return translate('replay_manager_analysis_ready', details=', '.join(details))
