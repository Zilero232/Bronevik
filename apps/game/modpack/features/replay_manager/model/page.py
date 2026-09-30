from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.compat import is_int, to_text
from .constants import (BATTLE_TYPES, MAP_NAME, MAP_SMALL_ICON, MAP_STATS_ICON, MASTERY_ICON, MAX_MASTERY, OTHER_BATTLE_TYPE, PAGE_KIND, RESULTS,
                        SITE_ANALYSED, SITE_QUEUED, SITE_REPLAY_PATH, SITE_UPLOADED, STATUS_INDEXING, STATUS_NO_ACCOUNT, STATUS_READY,
                        VEHICLE_ICON, VEHICLE_NAME)
from .version import compatible

STAT_KEYS = ('assist', 'kills', 'xp', 'base_xp', 'credits', 'spotted', 'marks', 'shots', 'hits', 'pens', 'received', 'blocked', 'duration',
             'life_time')


def vehicle_parts(vehicle):
    """(nation, name) of the header's `playerVehicle` (`ussr-R04_T-34`), or (None, None)."""
    if not vehicle or not VEHICLE_NAME.match(vehicle):
        return None, None
    nation, name = vehicle.split('-', 1)
    return nation, name


def vehicle_label(vehicle):
    """A readable name from the vehicle's code name when the client has no localized one (`R04_T-34` -> `T-34`)."""
    name = vehicle_parts(vehicle)[1] or vehicle
    if not name:
        return None
    parts = name.split('_', 1)
    return parts[1].replace('_', ' ') if len(parts) > 1 and parts[0][:1].isalpha() and any(ch.isdigit() for ch in parts[0]) else name


def battle_type(header):
    kind = header.get('battle_type')
    return BATTLE_TYPES.get(kind, OTHER_BATTLE_TYPE) if is_int(kind) else OTHER_BATTLE_TYPE


def map_icons(map_name):
    if not map_name or not MAP_NAME.match(map_name):
        return None, None
    return MAP_STATS_ICON % map_name, MAP_SMALL_ICON % map_name


def mastery_icon(mastery):
    return MASTERY_ICON % mastery if is_int(mastery) and 1 <= mastery <= MAX_MASTERY else None


def site_state(header, index, queued, analysed):
    arena = header.get('arena_unique_id')
    replay_id = index.get(arena) if arena and index is not None else None
    if replay_id:
        return {'state': SITE_ANALYSED if replay_id in analysed else SITE_UPLOADED, 'link': SITE_REPLAY_PATH % replay_id}
    if arena and arena in queued:
        return {'state': SITE_QUEUED, 'link': None}
    return None


class PageContext(object):
    """What a page needs beside the replays: the account's index, the client, and the client lookups the glue passes in
    (`describe_vehicle(tank_id, vehicle)` -> {label, tier, cls}, `image(path)` -> an image string or None)."""

    def __init__(self, index=None, client_version=None, queued=(), analysed=(), upload=None, describe_vehicle=None, image=None):
        self.index = index
        self.client_version = client_version
        self.queued = queued
        self.analysed = analysed
        self.upload = upload
        self.describe_vehicle = describe_vehicle or (lambda tank_id, vehicle: {})
        self.image = image or (lambda path: None)


def item_of(replay, context):
    header = replay.get('header') or {}
    stats = header.get('stats') or {}
    vehicle = header.get('vehicle')
    nation = vehicle_parts(vehicle)[0]
    described = context.describe_vehicle(stats.get('tank_id'), vehicle) or {}
    big_map, small_map = map_icons(header.get('map_name'))
    arena = header.get('arena_unique_id')
    index = context.index
    item = {
        'id': replay['name'],
        'title': os.path.splitext(replay['name'])[0],
        'size': replay['size'],
        'time': int(header.get('date_time') or replay['mtime']),
        'arena': arena,
        'map': header.get('map_name'),
        'map_title': header.get('map_title') or header.get('map_name'),
        'map_image': context.image(big_map) if big_map else None,
        'map_thumb': context.image(small_map) if small_map else None,
        'vehicle': vehicle,
        'tank': described.get('label') or vehicle_label(vehicle),
        'tier': described.get('tier'),
        'cls': described.get('cls'),
        'nation': nation,
        'tank_image': context.image(VEHICLE_ICON % vehicle) if nation else None,
        'type': battle_type(header),
        'result': header.get('result') if header.get('result') in RESULTS else None,
        'damage': header.get('damage'),
        'survived': stats.get('survived'),
        'mastery': stats.get('mastery') if is_int(stats.get('mastery')) else None,
        'mastery_image': context.image(mastery_icon(stats.get('mastery'))) if mastery_icon(stats.get('mastery')) else None,
        'version': header.get('client_version'),
        'playable': compatible(header.get('client_version'), context.client_version),
        'favourite': bool(index is not None and index.is_favourite(arena or replay['name'])),
        'site': site_state(header, index, context.queued, context.analysed),
    }
    for key in STAT_KEYS:
        item[key] = stats.get(key) if is_int(stats.get(key)) else None
    return item


def page_status(account_id, library):
    if account_id is None:
        return STATUS_NO_ACCOUNT
    return STATUS_INDEXING if library.indexing() else STATUS_READY


def build_page(replays, context, status, progress, folder):
    done, total = progress
    return {
        'kind': PAGE_KIND,
        'status': status,
        'progress': {'done': done, 'total': total},
        'client': to_text(context.client_version or ''),
        'folder': to_text(folder or ''),
        'upload': context.upload,
        'items': [item_of(replay, context) for replay in replays],
    }
