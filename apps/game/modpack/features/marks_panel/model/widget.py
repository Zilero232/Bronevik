# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import counted
from ....core.hud.icons import mark_icon
from ....core.hud.widget import widget
from ....core.moe import MARK_LEVELS, moe_macros
from ....core.templates import render
from . import target_levels
from .constants import APPROX, KIND, MARK_TONES, NO_ROWS, SOURCE_ESTIMATED

# Fair play: the player's own marks of excellence, from the own dossier and the own damage and assist of this battle.
#
# The plate (docs/specs/2026-09-30-hud-consolidation-and-design.md §8.4): the main row (mark, percent, change, the
# damage for the next goal) and, in the extended style or while Alt is held, the thresholds row and the average row
# under it. The page draws the rows it gets; the style only tells it a custom template's text from the plate.


def _shown_percent(state):
    shown = state['projected'] if is_number(state['projected']) else state['percent']
    if not is_number(shown):
        return None
    return round(shown, 2)


def percent_tone(state, mode):
    if mode == 'off':
        return 'text'
    shown = _shown_percent(state)
    if mode == 'mark':
        reached = len([level for level in MARK_LEVELS if is_number(shown) and shown >= level])
        return MARK_TONES[min(reached, len(MARK_TONES) - 1)]
    delta = state['delta']
    if not is_number(delta) or delta == 0:
        return 'text'
    return 'good' if delta > 0 else 'bad'


def thresholds(state):
    items = []
    for level in target_levels(state):
        need = state['need'][level]
        items.append({'level': level, 'need': need, 'reached': need == 0})
    return items


def _goal(state, settings):
    if settings.get('style') == 'minimal' or not state['has_curve']:
        return None
    if settings.get('show_up') and state['up_level'] is not None:
        return {'level': state['up_level'], 'need': state['up_need']}
    if state['next_level'] is None or state['need_next'] is None:
        return None
    return {'level': state['next_level'], 'need': state['need_next']}


def _step(state, settings):
    if not settings.get('show_step') or state['step_need'] is None:
        return None
    return {'step': state['step'], 'need': state['step_need']}


def _average_row(state, translate):
    label = translate('marks_panel_average_short')
    return {'label': label, 'ema': state['ema'], 'ema_projected': state['ema_projected']}


def _average(state, settings, translate):
    if not settings.get('show_battle'):
        return None
    return _average_row(state, translate)


def _battles(state, settings, translate):
    if not settings.get('show_battles') or state['next_level'] is None or state['battles'] is None:
        return None
    return {'level': state['next_level'], 'text': APPROX + counted(state['battles'], 'battles', translate)}


def _rows(state, settings, translate):
    return {
        'thresholds': thresholds(state) if settings.get('show_targets') else [],
        'step': _step(state, settings),
        'average': _average(state, settings, translate),
        'battles': _battles(state, settings, translate),
    }


# Without the site's thresholds the percent cannot be projected, but the average the percent follows can: the row of the
# damage average moving with the battle is the plate's live part then, and no thresholds row is drawn.
def _curveless_rows(state, translate):
    rows = dict(NO_ROWS)
    rows['average'] = _average_row(state, translate)
    return rows


def _detail_rows(state, style, settings, translate):
    if not state['has_curve']:
        return _curveless_rows(state, translate)
    return _rows(state, settings, translate) if style == 'extended' else NO_ROWS


def _style(settings):
    style = settings.get('style')
    if style == 'custom' and not settings.get('template'):
        return 'extended'
    return style


def marks_widget(state, settings, translate):
    style = _style(settings)
    data = {
        'style': style,
        'has_curve': bool(state['has_curve']),
        'percent': _shown_percent(state),
        'delta': state['delta'] if style != 'custom' else None,
        'estimated': state['source'] == SOURCE_ESTIMATED,
        'mark': mark_icon(state['marks']),
        'tone': percent_tone(state, settings.get('color_mode')),
        'goal': _goal(state, settings),
        'note': None,
        'text': render(settings.get('template'), moe_macros(state)) if style == 'custom' else None,
    }
    data.update(_detail_rows(state, style, settings, translate))
    return widget(KIND, data)
