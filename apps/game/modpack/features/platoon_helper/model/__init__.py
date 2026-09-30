# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, COLOR_WARN, counted, font, format_number
from .constants import (
    CLAN_BONUS_TYPES,
    MAX_MEMBERS,
    MAX_NAME,
    READY_MARK,
    SESSION_IDLE_S,
    TITLE_SIZE_STEP,
    WAITING_MARK,
)

# Fair play: the platoon mates' names and ready marks exactly as the platoon window shows them, and the player's own
# battle results of the session. No statistics of the mates or of anyone else are read.


def _has_name(item):
    return isinstance(item, dict) and isinstance(item.get('name'), string_types) and bool(item['name'])


def clean_members(items):
    members = [
        {'name': to_text(item['name'])[:MAX_NAME], 'ready': bool(item.get('ready')), 'self': bool(item.get('self'))}
        for item in list(items or [])
        if _has_name(item)
    ]
    return members[:MAX_MEMBERS]


def ready_count(members):
    return len([member for member in members if member['ready']])


# The own battles of the session in a platoon and in clan modes (battles, wins, damage).
class OwnSession(object):

    def __init__(self, idle_s=SESSION_IDLE_S):
        self.idle_s = idle_s
        self.reset(None)

    def reset(self, now):
        self.platoon = {'battles': 0, 'wins': 0, 'damage': 0}
        self.clan = {'battles': 0, 'wins': 0, 'damage': 0}
        self.last_at = now

    def add(self, event, now):
        if self.last_at is not None and now - self.last_at > self.idle_s:
            self.reset(now)
        self.last_at = now

        targets = []
        if event.get('platoon'):
            targets.append(self.platoon)
        if event.get('bonus_type') in CLAN_BONUS_TYPES:
            targets.append(self.clan)

        damage = (event.get('stats') or {}).get('damage_dealt')
        is_win = event.get('result') == 'win'
        for totals in targets:
            totals['battles'] += 1
            totals['wins'] += 1 if is_win else 0
            totals['damage'] += int(damage) if is_number(damage) else 0
        return bool(targets)

    def played(self):
        return [(key, totals) for key, totals in (('platoon', self.platoon), ('clan', self.clan)) if totals['battles']]


def totals_text(totals):
    battles = totals['battles']
    return {
        'battles': battles,
        'wins': int(round(100.0 * totals['wins'] / battles)) if battles else 0,
        'damage': format_number(float(totals['damage']) / battles) if battles else u'-',
    }


def member_text(member, size):
    mark, mark_color = (READY_MARK, COLOR_UP) if member['ready'] else (WAITING_MARK, COLOR_WARN)
    name_color = COLOR_NEUTRAL if member['self'] else COLOR_MUTED
    return u'%s %s' % (font(member['name'], name_color, size), font(mark, mark_color, size))


def _member_lines(members, translate, size):
    title = translate('platoon_helper_title', ready=ready_count(members), total=len(members))
    return [
        font(title, COLOR_NEUTRAL, size + TITLE_SIZE_STEP),
        u'   '.join(member_text(member, size) for member in members),
    ]


def _session_line(key, totals, translate, size):
    values = dict(totals_text(totals), battles=counted(totals['battles'], 'battles', translate))
    return font(translate('platoon_helper_session_' + key, **values), COLOR_MUTED, size)


def format_hangar(members, session, settings, translate):
    size = settings.get('font_size')
    lines = []
    if settings.get('show_members') and members:
        lines.extend(_member_lines(members, translate, size))
    if settings.get('show_session'):
        lines.extend(_session_line(key, totals, translate, size) for key, totals in session.played())
    if not lines:
        return None
    return u'\n'.join(lines)
