# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_number
from ..format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, MARK_COLORS, format_number
from .constants import MACRO_MISSING, MARK_LEVELS, REACHED, STAR, TARGET_LEVELS, UNREACHABLE


def _percent(value):
    return u'%.2f' % value if is_number(value) else MACRO_MISSING


def _signed(value):
    return u'%+.2f' % value if is_number(value) else MACRO_MISSING


def _need(value):
    if not is_number(value):
        return MACRO_MISSING
    return REACHED if value <= 0 else format_number(value)


def _battles(state):
    if not state['has_curve'] or state['next_level'] is None:
        return MACRO_MISSING
    if state['battles'] is not None:
        return format_number(state['battles'])
    return MACRO_MISSING if state['pace'] is None else UNREACHABLE


def moe_macros(state):
    """The `{macro}` values of the marks templates as text (README «marks_panel» lists them)."""
    marks = state['marks']
    values = {
        'percent': _percent(state['percent']),
        'projected': _percent(state['projected']),
        'delta': _signed(state['delta']),
        'damage': format_number(state['damage']),
        'ema': format_number(state['ema']),
        'ema_projected': format_number(state['ema_projected']),
        'marks': u'%d' % marks if is_number(marks) else MACRO_MISSING,
        'stars': STAR * int(marks) if is_number(marks) else u'',
        'next': u'%d' % state['next_level'] if state['next_level'] is not None else MACRO_MISSING,
        'need_next': _need(state['need_next']),
        'target_next': format_number(state['target_avg'][state['next_level']]) if state['next_level'] in state['target_avg'] else MACRO_MISSING,
        'step': u'%g' % state['step'] if is_number(state['step']) else MACRO_MISSING,
        'step_need': _need(state['step_need']),
        'battles': _battles(state),
        'pace': format_number(state['pace']) if state['pace'] is not None else MACRO_MISSING,
    }
    for level in (int(value) for value in TARGET_LEVELS):
        values['need%d' % level] = _need(state['need'].get(level))
        values['target%d' % level] = format_number(state['target_avg'][level]) if level in state['target_avg'] else MACRO_MISSING
    return values


def moe_color(state, mode):
    """The colour of a marks view: by the change (`delta`), by the mark the percent is at (`mark`), or none."""
    if mode == 'off':
        return COLOR_NEUTRAL
    if mode == 'mark':
        shown = state['projected'] if is_number(state['projected']) else state['percent']
        if not is_number(shown):
            return COLOR_MUTED
        return MARK_COLORS[len([level for level in MARK_LEVELS if shown >= level])]
    delta = state['delta']
    if not is_number(delta) or delta == 0:
        return COLOR_NEUTRAL
    return COLOR_UP if delta > 0 else COLOR_DOWN
