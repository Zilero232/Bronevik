from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.hud.icons import mark_icon
from ....core.hud.widget import widget
from ....core.moe import moe_color, moe_macros
from ....core.templates import render
from .constants import KIND

# Fair play: the player's own marks of excellence, from the own dossier and the own damage and assist of this battle.


def thresholds(state):
    items = []
    for level in sorted(state['need']):
        if level == 100 and state['next_level'] != 100:
            continue
        need = state['need'][level]
        items.append({'level': level, 'need': need, 'reached': need == 0})
    return items


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
    custom = style == 'custom' and settings.get('template')
    shown = state['projected'] if is_number(state['projected']) else state['percent']
    return widget(KIND, {
        'style': 'extended' if style == 'custom' else style,
        'has_curve': bool(state['has_curve']),
        'percent': round(shown, 2) if is_number(shown) else None,
        'delta': state['delta'],
        'marks': state['marks'],
        'mark': mark_icon(state['marks']),
        'color': moe_color(state, settings.get('color_mode')),
        'damage': state['damage'],
        'thresholds': thresholds(state) if settings.get('show_targets') else [],
        'step': {'step': state['step'], 'need': state['step_need']} if settings.get('show_step') and state['step_need'] is not None else None,
        'battles': ({'level': state['next_level'], 'count': state['battles']}
                    if settings.get('show_battles') and state['next_level'] is not None and state['battles'] is not None else None),
        'up': _up(state, settings),
        'source': _source(state, translate),
        'detail': _detail(state, settings, translate),
        'text': render(settings.get('template'), moe_macros(state)) if custom else None,
    })
