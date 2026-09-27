from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import as_int, is_int, to_text
from ....core.templates import render
from .constants import AUTO_NAME_GIVE_UP_S, AUTO_NAME_MATCH_S, AUTO_NAME_SETTLE_S
from .errors import ReplayActionError
from .names import rename_target

# A replay is matched to its battle by its header, never by its file name; a file still being written, missing,
# or whose target name exists is left as it is.


def name_values(event, map_label, vehicle_label, result_label):
    moment = time.localtime(event.get('arena_created_at') or event.get('occurred_at') or 0)
    stats = event.get('stats') or {}
    vehicle = event.get('vehicle') or {}
    return {
        'date': to_text(time.strftime('%Y-%m-%d', moment)),
        'time': to_text(time.strftime('%H-%M', moment)),
        'map': map_label or event.get('map_name') or u'',
        'vehicle': vehicle_label or u'',
        'tier': vehicle.get('tier') or u'',
        'result': result_label or u'',
        'damage': as_int(stats.get('damage_dealt')),
        'xp': as_int(stats.get('xp')),
        'frags': as_int(stats.get('frags')),
        'arena': event.get('arena_unique_id') or u'',
    }


def render_name(template, values, old_name):
    plain = dict((key, value if not is_int(value) else str(value)) for key, value in values.items())
    try:
        return rename_target(old_name, render(template, plain))
    except ReplayActionError:
        return None


class AutoNamer(object):

    def __init__(self):
        self.pending = []

    def queue(self, event, values, now):
        arena = event.get('arena_unique_id')
        if not arena or any(item['arena'] == arena for item in self.pending):
            return False
        started = event.get('arena_created_at') or event.get('occurred_at')
        self.pending.append({'arena': arena, 'started': started, 'values': values, 'queued': now})
        return True

    def _matches(self, item, replay):
        header = replay.get('header') or {}
        if header.get('arena_unique_id'):
            return to_text(header['arena_unique_id']) == to_text(item['arena'])
        started = header.get('date_time')
        return started is not None and item['started'] is not None and abs(started - item['started']) <= AUTO_NAME_MATCH_S

    def plan(self, replays, template, now):
        renames = []
        keep = []
        for item in self.pending:
            replay = next((candidate for candidate in replays if self._matches(item, candidate)), None)
            if replay is None:
                if now - item['queued'] < AUTO_NAME_GIVE_UP_S:
                    keep.append(item)
                continue
            if now - replay['mtime'] < AUTO_NAME_SETTLE_S:
                keep.append(item)
                continue
            name = render_name(template, item['values'], replay['name'])
            if name and name != replay['name']:
                renames.append((replay, name))
        self.pending = keep
        return renames
