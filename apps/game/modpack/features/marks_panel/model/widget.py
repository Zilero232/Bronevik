from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.hud.icons import mark_icon
from ....core.hud.widget import widget
from ....core.moe import moe_color, moe_macros
from ....core.templates import render
from . import target_levels
from .constants import KIND

# Fair play: the player's own marks of excellence, from the own dossier and the own damage and assist of this battle.


def thresholds(state):
    items = []
    for level in target_levels(state):
        need = state['need'][level]
        items.append({'level': level, 'need': need, 'reached': need == 0})
    return items


def _shown_percent(state):
    shown = state['projected'] if is_number(state['projected']) else state['percent']
    if not is_number(shown):
        return None
    return round(shown, 2)


def _step(state, settings):
    if not settings.get('show_step') or state['step_need'] is None:
        return None
    return {'step': state['step'], 'need': state['step_need']}


def _battles(state, settings):
    if not settings.get('show_battles'):
        return None
    if state['next_level'] is None or state['battles'] is None:
        return None
    return {'level': state['next_level'], 'count': state['battles']}


def _up(state, settings):
    if not settings.get('show_up') or state['up_level'] is None:
        return None
    return {'level': state['up_level'], 'need': state['up_need']}


def _source(state, translate):
    if state['source'] is None:
        return None
    return {'kind': state['source'], 'label': translate('marks_panel_source_%s' % state['source'])}


def _detail(state, settings, translate):
    if not settings.get('detail'):
        return None
    level = state['next_level']
    return {
        'label': translate('marks_panel_average'),
        'ema': state['ema'],
        'ema_projected': state['ema_projected'],
        'level': level,
        'target': state['target_avg'].get(level) if level is not None else None,
    }


def marks_widget(state, settings, translate):
    style = settings.get('style')
    template = settings.get('template')
    is_custom = style == 'custom' and bool(template)

    return widget(KIND, {
        'style': 'extended' if style == 'custom' else style,
        'has_curve': bool(state['has_curve']),
        'percent': _shown_percent(state),
        'delta': state['delta'],
        'marks': state['marks'],
        'mark': mark_icon(state['marks']),
        'color': moe_color(state, settings.get('color_mode')),
        'damage': state['damage'],
        'thresholds': thresholds(state) if settings.get('show_targets') else [],
        'step': _step(state, settings),
        'battles': _battles(state, settings),
        'up': _up(state, settings),
        'source': _source(state, translate),
        'detail': _detail(state, settings, translate),
        'text': render(template, moe_macros(state)) if is_custom else None,
    })
