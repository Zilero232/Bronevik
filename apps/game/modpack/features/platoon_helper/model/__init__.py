# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, COLOR_WARN, font, format_number
from .constants import CLAN_BONUS_TYPES, MAX_MEMBERS, MAX_NAME, READY_MARK, SESSION_IDLE_S, TITLE_SIZE_STEP, WAITING_MARK

# Fair play: the platoon mates' names and ready marks exactly as the platoon window shows them, and the player's own
# battle results of the session. No statistics of the mates or of anyone else are read.


def clean_members(items):
    members = []
    for item in list(items or []):
        if not isinstance(item, dict) or not isinstance(item.get('name'), string_types) or not item['name']:
            continue
        members.append({'name': to_text(item['name'])[:MAX_NAME], 'ready': bool(item.get('ready')), 'self': bool(item.get('self'))})
    return members[:MAX_MEMBERS]


class OwnSession(object):
    """The own battles of the session in a platoon and in clan modes (battles, wins, damage)."""

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
        for totals in targets:
            totals['battles'] += 1
            totals['wins'] += 1 if event.get('result') == 'win' else 0
            totals['damage'] += int(damage) if is_number(damage) else 0
        return bool(targets)


def totals_text(totals):
    battles = totals['battles']
    return {
        'battles': battles,
        'wins': int(round(100.0 * totals['wins'] / battles)) if battles else 0,
        'damage': format_number(float(totals['damage']) / battles) if battles else u'-',
    }


def member_text(member, size):
    mark = font(READY_MARK if member['ready'] else WAITING_MARK, COLOR_UP if member['ready'] else COLOR_WARN, size)
    return u'%s %s' % (font(member['name'], COLOR_NEUTRAL if member['self'] else COLOR_MUTED, size), mark)


def format_hangar(members, session, settings, translate):
    size = settings.get('font_size')
    lines = []
    if settings.get('show_members') and members:
        ready = len([member for member in members if member['ready']])
        lines.append(font(translate('platoon_helper_title', ready=ready, total=len(members)), COLOR_NEUTRAL, size + TITLE_SIZE_STEP))
        lines.append(u'   '.join(member_text(member, size) for member in members))
    if settings.get('show_session'):
        for key, totals in (('platoon', session.platoon), ('clan', session.clan)):
            if totals['battles']:
                lines.append(font(translate('platoon_helper_session_' + key, **totals_text(totals)), COLOR_MUTED, size))
    return u'\n'.join(lines) if lines else None
