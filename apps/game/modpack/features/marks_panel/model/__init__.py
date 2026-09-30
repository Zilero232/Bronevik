# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, counted, font
from ....core.moe import combined_damage, moe_color, moe_macros, moe_state, rating_to_percent
from ....core.templates import render
from .constants import KINDS, LINE_SEPARATOR, TARGET_SEPARATOR, TITLE_SIZE_STEP

__all__ = ('BattleTotals', 'format_panel', 'panel_state')


class BattleTotals(object):
    """The player's own damage and assist of this battle, raised to the client's summary of the server's totals."""

    def __init__(self):
        self.values = dict((kind, 0) for kind in KINDS)
        self.summary = {}

    def add(self, kind, amount):
        if kind not in KINDS or not is_number(amount) or amount <= 0:
            return False
        self.values[kind] += amount
        return True

    def apply_summary(self, damage=None, stun=None):
        changed = False
        for key, value in (('damage', damage), ('stun', stun)):
            if is_number(value) and value >= 0 and self.summary.get(key) != int(value):
                self.summary[key] = int(value)
                changed = True
        return changed

    def get(self, kind):
        return max(self.values[kind], self.summary.get(kind, 0))

    def combined(self):
        return combined_damage(self.get('damage'), self.get('radio'), self.get('track'), self.get('stun'))


def panel_state(snapshot, combined, curve, pace, settings):
    return moe_state(snapshot['moving_avg_damage'], rating_to_percent(snapshot.get('damage_rating')), combined, curve, pace,
                     float(settings.get('step')), snapshot.get('marks_on_gun'))


def _targets(state, values, translate):
    items = []
    for level in sorted(state['need']):
        if level == 100 and state['next_level'] != 100:
            continue
        items.append(render(translate('marks_panel_line_target'), {'level': u'%d' % level, 'need': values['need%d' % level]}))
    return TARGET_SEPARATOR.join(items)


def _extended(state, values, settings, translate, color, size):
    lines = [font(render(translate('marks_panel_line_head'), values), color, size + TITLE_SIZE_STEP)]
    if settings.get('show_battle'):
        lines.append(font(render(translate('marks_panel_line_battle'), values), COLOR_NEUTRAL, size))
    if settings.get('show_targets') and state['need']:
        lines.append(font(_targets(state, values, translate), COLOR_NEUTRAL, size))
    extra = []
    if settings.get('show_step') and state['step_need'] is not None:
        extra.append(render(translate('marks_panel_line_step'), values))
    if settings.get('show_battles') and state['next_level'] is not None:
        extra.append(render(translate('marks_panel_line_battles'), values))
    if extra:
        lines.append(font(TARGET_SEPARATOR.join(extra), COLOR_MUTED, size))
    return lines


def format_panel(state, settings, translate):
    """The panel text in the chosen style; `custom` renders the player's template with every macro."""
    values = moe_macros(state)
    values['title'] = translate('marks_panel_title')
    values['battles_count'] = counted(state['battles'], 'battles', translate) if state['battles'] is not None else values['battles']
    color = moe_color(state, settings.get('color_mode'))
    size = settings.get('font_size')
    style = settings.get('style')
    if style == 'custom' and settings.get('template'):
        return font(render(settings.get('template'), values), color, size)
    if not state['has_curve']:
        return font(render(translate('marks_panel_line_no_curve'), values), COLOR_MUTED, size)
    if style == 'minimal':
        return font(render(translate('marks_panel_line_minimal'), values), color, size)
    if style == 'compact':
        return font(render(translate('marks_panel_line_compact'), values), color, size)
    return LINE_SEPARATOR.join(_extended(state, values, settings, translate, color, size))
