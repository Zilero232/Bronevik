from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_epoch, format_number
from .constants import ACTION_DELETE, ACTION_FOLDER, ACTION_REFRESH, ACTION_RENAME, SITE_LIST_PATH, SITE_REPLAY_PATH
from .filters import arrange


def _megabytes(size):
    return '%.1f MB' % (size / (1024.0 * 1024.0))


def _vehicle_label(vehicle):
    if not vehicle:
        return None
    name = vehicle.split('-', 1)[-1]
    parts = name.split('_', 1)
    return parts[1] if len(parts) > 1 and parts[0][:1].isalpha() and any(ch.isdigit() for ch in parts[0]) else name


def outcome_text(header, translate):
    parts = []
    if header.get('result'):
        parts.append(translate('replay_manager_result_%s' % header['result']))
    if header.get('damage') is not None:
        parts.append(translate('replay_manager_damage', damage=format_number(header['damage'])))
    return ', '.join(parts)


def badge_of(replay_id, analysed, translate):
    if not replay_id:
        return None
    return translate('replay_manager_analysed') if replay_id in analysed else translate('replay_manager_uploaded')


def row_of(replay, replay_id, translate, analysed=()):
    header = replay['header'] or {}
    title = ' - '.join(part for part in (header.get('map_title') or header.get('map_name'), _vehicle_label(header.get('vehicle'))) if part)
    actions = [
        {'id': ACTION_RENAME, 'label': translate('replay_manager_rename'), 'input': replay['name'].rsplit('.', 1)[0], 'confirm': None},
        {'id': ACTION_DELETE, 'label': translate('replay_manager_delete'), 'confirm': translate('replay_manager_delete_confirm',
                                                                                              name=replay['name'])},
    ]
    link = None
    if replay_id:
        link = SITE_REPLAY_PATH % replay_id
        actions.insert(0, {'id': 'site', 'label': translate('replay_manager_open_site'), 'link': link, 'confirm': None})
    return {
        'id': replay['name'],
        'title': title or replay['name'],
        'subtitle': replay['name'],
        'meta': ' / '.join(part for part in (format_epoch(header.get('date_time') or replay['mtime']), outcome_text(header, translate),
                                             _megabytes(replay['size'])) if part),
        'badge': badge_of(replay_id, analysed, translate),
        'link': link,
        'actions': actions,
    }


def build_page(replays, index, translate, max_rows, uploaded_only, settings=None, now=None, analysed=()):
    rows = []
    for replay in (arrange(replays, settings, now) if settings is not None else replays):
        arena = (replay['header'] or {}).get('arena_unique_id')
        replay_id = index.get(arena) if arena else None
        if uploaded_only and not replay_id:
            continue
        rows.append(row_of(replay, replay_id, translate, analysed))
        if len(rows) >= max_rows:
            break
    empty = 'replay_manager_nothing_found' if replays and not rows else 'replay_manager_empty'
    return {'kind': 'list', 'empty': translate(empty), 'rows': rows}


def page_actions(translate):
    return [
        {'id': ACTION_REFRESH, 'label': translate('replay_manager_refresh'), 'confirm': None},
        {'id': ACTION_FOLDER, 'label': translate('replay_manager_folder'), 'confirm': None},
        {'id': 'site_list', 'label': translate('replay_manager_site_list'), 'link': SITE_LIST_PATH, 'confirm': None},
    ]
