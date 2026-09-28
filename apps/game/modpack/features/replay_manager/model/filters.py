from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import to_text
from .constants import ALL, PERIOD_SECONDS, SORT_KEYS, UNKNOWN_RESULT


def replay_time(replay):
    return (replay.get('header') or {}).get('date_time') or replay['mtime']


def haystack(replay):
    header = replay.get('header') or {}
    parts = (replay['name'], header.get('map_title'), header.get('map_name'), header.get('vehicle'))
    return u' '.join(to_text(part) for part in parts if part).lower()


def matches(replay, settings, now):
    search = to_text(settings.get('search') or u'').strip().lower()
    if search and search not in haystack(replay):
        return False
    wanted = settings.get('filter_result')
    result = (replay.get('header') or {}).get('result') or UNKNOWN_RESULT
    if wanted != ALL and wanted != result:
        return False
    period = PERIOD_SECONDS.get(settings.get('period'))
    return period is None or now is None or now - replay_time(replay) <= period


def arrange(replays, settings, now):
    picked = [replay for replay in replays if matches(replay, settings, now)]
    key, reverse = SORT_KEYS.get(settings.get('sort'), SORT_KEYS['newest'])
    if key == 'time':
        picked.sort(key=replay_time, reverse=reverse)
    elif key == 'damage':
        picked.sort(key=lambda replay: (replay.get('header') or {}).get('damage') or 0, reverse=reverse)
    else:
        picked.sort(key=lambda replay: replay['size'], reverse=reverse)
    return picked
