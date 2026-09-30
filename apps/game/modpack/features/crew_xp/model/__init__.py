from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, counted, font, format_number
from .constants import MAX_CREW, MAX_LEVEL, MAX_TEXT, TITLE_SIZE_STEP

# Only the own crew and the own vehicle's average XP, the same figures the client's crew screens and battle results
# use (TankmanDossier: next skill cost over the average XP); nothing about other players.


def _number(value, low=0):
    if not is_number(value) or isinstance(value, bool) or value < low:
        return None
    return value


def _text(value):
    if not isinstance(value, string_types):
        return u''
    return to_text(value).strip()[:MAX_TEXT]


def battles_left(xp_left, avg_xp, factor=1.0):
    """Battles to earn `xp_left` at the vehicle's average XP times the crew XP factor, rounded up; None unknown."""
    if xp_left <= 0:
        return 0
    per_battle = (avg_xp or 0) * (factor or 0)
    if per_battle <= 0:
        return None
    return int(math.ceil(float(xp_left) / per_battle))


def clean_member(raw):
    if not isinstance(raw, dict):
        return None
    xp_left = _number(raw.get('xp_left'))
    if xp_left is None:
        return None
    level = _number(raw.get('level'))
    avg_xp = _number(raw.get('avg_xp'))
    return {
        'role': _text(raw.get('role')),
        'name': _text(raw.get('name')),
        'xp_left': int(xp_left),
        'level': min(MAX_LEVEL, level) if level is not None else None,
        'battles': battles_left(int(xp_left), avg_xp, _number(raw.get('factor')) or 1.0),
    }


def clean_crew(raw):
    members = [clean_member(item) for item in raw or ()] if isinstance(raw, (list, tuple)) else []
    return [member for member in members if member][:MAX_CREW]


def share(member):
    if member['level'] is None:
        return None
    return float(member['level']) / MAX_LEVEL


def battles_text(member, translate):
    if member['battles'] is None:
        return None
    return translate('crew_xp_battles', battles=counted(member['battles'], 'battles', translate))


def member_text(member, translate):
    if member['xp_left'] == 0:
        return translate('crew_xp_ready')
    xp = translate('crew_xp_left', xp=format_number(member['xp_left']))
    battles = battles_text(member, translate)
    return u'%s, %s' % (xp, battles) if battles else xp


def tooltip_text(member, translate):
    return translate('crew_xp_tooltip', text=member_text(member, translate))


def format_hangar(crew, settings, translate):
    if not crew:
        return None
    size = settings.get('font_size')
    lines = [font(translate('crew_xp_card_title'), COLOR_NEUTRAL, size + TITLE_SIZE_STEP)]
    for member in crew:
        color = COLOR_UP if member['xp_left'] == 0 else COLOR_MUTED
        lines.append(font(u'%s: %s' % (member['role'], member_text(member, translate)), color, size))
    return u'\n'.join(lines)
