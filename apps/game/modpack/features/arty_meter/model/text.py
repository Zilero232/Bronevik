from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_WARN, counted, font, format_number


def arty_text(battle, day, settings, translate):
    values = dict((key, format_number(value)) for key, value in battle.items())
    lines = [font(translate('arty_meter_line', **values), COLOR_WARN if battle['hits'] + battle['splash'] else COLOR_NEUTRAL)]
    if battle['modules'] or battle['stuns']:
        lines.append(font(translate('arty_meter_line_extra', **values), COLOR_MUTED))
    if settings.get('show_day') and day:
        lines.append(font(translate('arty_meter_day', battles=counted(day['battles'], 'battles', translate),
                                    total=counted(day['hits'] + day['splash'], 'times', translate),
                                    damage=format_number(day['damage'])), COLOR_MUTED))
    return u'\n'.join(lines)
