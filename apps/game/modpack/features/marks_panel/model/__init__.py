# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, counted, font
from ....core.moe import combined_damage, moe_color, moe_macros, moe_state, rating_to_percent
from ....core.templates import render
from .constants import (APPROX, KINDS, LINE_SEPARATOR, SOURCE_ESTIMATED, SOURCE_VERIFIED, TARGET_SEPARATOR,
                        TITLE_SIZE_STEP)
from .view import PanelView

__all__ = ('BattleTotals', 'PanelView', 'format_panel', 'panel_state', 'percent_source')


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


def percent_source(snapshot, curve):
    """`verified` when the starting percent is the client's own damageRating (the dossier read when the tank was
    selected, updated from the own battle results since): the server's value, not ours. `estimated` when the dossier
    has none (missing or 0) and the percent is the site curve at the dossier's EMA."""
    rating = snapshot.get('damage_rating')
    if is_number(rating) and rating > 0:
        return SOURCE_VERIFIED
    return SOURCE_ESTIMATED if curve is not None else None


def panel_state(snapshot, combined, curve, pace, settings):
    moving_avg = snapshot['moving_avg_damage']
    source = percent_source(snapshot, curve)
    is_verified = source == SOURCE_VERIFIED
    percent = rating_to_percent(snapshot.get('damage_rating')) if is_verified else None
    step = float(settings.get('step'))

    state = moe_state(moving_avg, percent, combined, curve, pace, step, snapshot.get('marks_on_gun'))
    state['source'] = source
    if source == SOURCE_ESTIMATED:
        state['percent'] = round(curve.percent_for(moving_avg), 2)
    return state


def _shows_up(state, settings):
    if not settings.get('show_up'):
        return False
    return state['up_level'] is not None


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
    if _shows_up(state, settings):
        extra.append(render(translate('marks_panel_line_up'), values))
    if settings.get('show_step') and state['step_need'] is not None:
        extra.append(render(translate('marks_panel_line_step'), values))
    if settings.get('show_battles') and state['next_level'] is not None:
        extra.append(render(translate('marks_panel_line_battles'), values))
    if extra:
        lines.append(font(TARGET_SEPARATOR.join(extra), COLOR_MUTED, size))
    if settings.get('detail'):
        lines.append(font(_detail(state, values, translate), COLOR_MUTED, size))
    return lines


def _detail(state, values, translate):
    items = [values['source']] if values['source'] else []
    if state['next_level'] in state['target_avg']:
        items.append(render(translate('marks_panel_line_target_avg'), values))
    return TARGET_SEPARATOR.join(items)


def _values(state, translate):
    values = moe_macros(state)
    values['title'] = translate('marks_panel_title')
    if state['battles'] is not None:
        values['battles_count'] = counted(state['battles'], 'battles', translate)
    else:
        values['battles_count'] = values['battles']
    values['source'] = translate('marks_panel_source_%s' % state['source']) if state['source'] else u''
    values['approx'] = APPROX if state['source'] == SOURCE_ESTIMATED else u''
    return values


def format_panel(state, settings, translate):
    """The panel text in the style of `settings` (a PanelView); `custom` renders the player's template with every
    macro."""
    values = _values(state, translate)
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
        key = 'marks_panel_line_compact_up' if _shows_up(state, settings) else 'marks_panel_line_compact'
        return font(render(translate(key), values), color, size)
    return LINE_SEPARATOR.join(_extended(state, values, settings, translate, color, size))
