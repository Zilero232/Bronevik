from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from ....core.templates import render
from ....core.teams import TeamHp  # noqa: F401
from .constants import BAR_CHAR, COMPACT_STYLES, STRIP_STYLES


def bar(value, maximum, width, color):
    filled = int(round(width * value / maximum)) if maximum > 0 else 0
    filled = max(0, min(width, filled))
    return font(BAR_CHAR * filled, color) + font(BAR_CHAR * (width - filled), COLOR_MUTED)


def signed(value):
    return ('+' if value > 0 else '') + format_number(value)


def icon_row(vehicles, width, color):
    return u' '.join(bar(vehicle['hp'], vehicle['max'], width, color) for vehicle in vehicles)


def format_icons(teams, settings):
    width = settings.get('icon_width')
    values = teams.values()
    parts = [icon_row(teams.team(True), width, settings.get('ally_color'))]
    if settings.get('show_score'):
        parts.append(font('%d : %d' % (values['allies_frags'], values['enemies_frags']), COLOR_NEUTRAL))
    parts.append(icon_row(teams.team(False), width, settings.get('enemy_color')))
    return font(u'   '.join(parts), COLOR_NEUTRAL, settings.get('font_size'))


def format_panel(teams, settings, translate):
    if settings.get('style') in STRIP_STYLES and not settings.get('template'):
        return format_icons(teams, settings)
    return format_team_hp(teams.values(), settings, translate)


def format_team_hp(values, settings, translate):
    if settings.get('template'):
        return font(render(settings.get('template'), values), COLOR_NEUTRAL, settings.get('font_size'))
    style = 'compact' if settings.get('style') in COMPACT_STYLES else settings.get('style')
    ally = settings.get('ally_color')
    enemy = settings.get('enemy_color')
    width = settings.get('bar_width')
    allies_hp = font(format_number(values['allies_hp']), ally)
    enemies_hp = font(format_number(values['enemies_hp']), enemy)
    parts = []
    if style in ('full', 'bars'):
        parts.append(bar(values['allies_hp'], values['allies_max'], width, ally))
    if style in ('full', 'numbers', 'compact'):
        parts.append(allies_hp)
    if settings.get('show_score'):
        parts.append(font('%d : %d' % (values['allies_frags'], values['enemies_frags']), COLOR_NEUTRAL))
    elif style == 'compact':
        parts.append(font(':', COLOR_MUTED))
    if style in ('full', 'numbers', 'compact'):
        parts.append(enemies_hp)
    if style in ('full', 'bars'):
        parts.append(bar(values['enemies_hp'], values['enemies_max'], width, enemy))
    lines = [font('  '.join(parts), COLOR_NEUTRAL, settings.get('font_size'))]
    if settings.get('show_diff') and style != 'compact':
        color = ally if values['diff'] >= 0 else enemy
        lines.append(font(translate('team_hp_diff', diff=signed(values['diff'])), color, max(8, settings.get('font_size') - 2)))
    return '\n'.join(lines)
