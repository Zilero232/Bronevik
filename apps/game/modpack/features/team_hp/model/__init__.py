from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from ....core.templates import render
from ....core.teams import TeamHp  # noqa: F401
from ..settings.constants import OVERLAY_STYLES, UNDER_STOCK_Y
from .constants import BAR_CHAR, COMPACT_STYLES, PAIR_PARTS, SCORE_KEYS, SIDE_COLORS, STRIP_STYLES
from .strip import strip_rows


def replaces_stock(settings):
    return bool(settings.get('replace_stock')) and settings.get('style') not in OVERLAY_STYLES


def pinned_y(settings):
    return settings.get('y') if replaces_stock(settings) else UNDER_STOCK_Y


def bar(value, maximum, width, color):
    filled = int(round(width * value / maximum)) if maximum > 0 else 0
    filled = max(0, min(width, filled))
    return font(BAR_CHAR * filled, color) + font(BAR_CHAR * (width - filled), COLOR_MUTED)


def signed(value):
    return ('+' if value > 0 else '') + format_number(value)


def score_pair(values, settings):
    allies_key, enemies_key = SCORE_KEYS[bool(settings.get('show_alive'))]
    return values[allies_key], values[enemies_key]


def score_text(values, settings):
    return font('%d : %d' % score_pair(values, settings), COLOR_NEUTRAL)


def icon_part(vehicle, tier, width, color):
    part = bar(vehicle['hp'], vehicle['max'], width, color)
    if tier is None:
        return part
    return font(tier, COLOR_MUTED) + u' ' + part


def icon_row(rows, width, color):
    return u' '.join(icon_part(vehicle, tier, width, color) for vehicle, tier in rows)


def format_icons(teams, settings, options):
    width = settings.get('icon_width')
    parts = [icon_row(strip_rows(teams, True, options), width, settings.get('ally_color'))]
    if settings.get('show_score'):
        parts.append(score_text(teams.values(), settings))
    parts.append(icon_row(strip_rows(teams, False, options), width, settings.get('enemy_color')))
    return font(u'   '.join(parts), COLOR_NEUTRAL, settings.get('font_size'))


def format_panel(teams, settings, translate, options):
    if settings.get('style') in STRIP_STYLES and not settings.get('template'):
        return format_icons(teams, settings, options)
    return format_team_hp(teams.values(), settings, translate)


def side_parts(values, settings, side, shown):
    color = settings.get(SIDE_COLORS[side])
    parts = []
    if shown['bars']:
        parts.append(bar(values[side + '_hp'], values[side + '_max'], settings.get('bar_width'), color))
    if shown['numbers']:
        parts.append(font(format_number(values[side + '_hp']), color))
    return parts


def score_parts(values, settings, style):
    if settings.get('show_score'):
        return [score_text(values, settings)]
    if style == 'compact':
        return [font(':', COLOR_MUTED)]
    return []


def number_parts(values, settings, style):
    shown = PAIR_PARTS[style]
    allies = side_parts(values, settings, 'allies', shown)
    enemies = side_parts(values, settings, 'enemies', shown)
    return allies + score_parts(values, settings, style) + list(reversed(enemies))


def format_team_hp(values, settings, translate):
    size = settings.get('font_size')
    if settings.get('template'):
        return font(render(settings.get('template'), values), COLOR_NEUTRAL, size)

    style = 'compact' if settings.get('style') in COMPACT_STYLES else settings.get('style')
    lines = [font('  '.join(number_parts(values, settings, style)), COLOR_NEUTRAL, size)]
    if settings.get('show_diff') and style != 'compact':
        color = settings.get('ally_color') if values['diff'] >= 0 else settings.get('enemy_color')
        lines.append(font(translate('team_hp_diff', diff=signed(values['diff'])), color, max(8, size - 2)))
    return '\n'.join(lines)
