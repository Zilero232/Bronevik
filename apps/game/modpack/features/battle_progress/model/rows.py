from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from .constants import BEATEN_BY, ESTIMATE, MAIN_GUN_LOOKS, OF_TARGET, REACHED, ROWS
from .wn8 import rating_color

# One row per target, as plain data both renderers read: the card row of the Gameface page (model/widget.py) and the
# GUIFlash line (model/text.py).


def _row(kind, text, value, **style):
    row = {
        'kind': kind,
        'text': text,
        'value': value,
        'tone': 'text',
        'color': None,
        'note': None,
        'detail': None,
        'progress': None,
        'progress_tone': 'gold',
    }
    row.update(style)
    return row


def _share(state, translate):
    return translate('bp_share', share=state['share'], team=format_number(state['team']))


def main_gun_row(state, settings, translate, view):
    main_gun = state['main_gun']
    if main_gun is None:
        return None
    look = MAIN_GUN_LOOKS[main_gun['status']]
    detail = _share(main_gun, translate) if settings.get('main_gun_share') or view['extended'] else None
    text = translate('bp_main_gun')
    if look['word'] is not None:
        return _row('main_gun', text, translate(look['word']), tone=look['tone'], detail=detail)

    damage, need = main_gun['damage'], main_gun['need']
    settled = main_gun['status'] == REACHED and view['settled']
    return _row(
        'main_gun',
        text,
        format_number(damage),
        tone=look['tone'],
        note=OF_TARGET % format_number(need),
        detail=detail,
        progress=None if settled else min(1.0, float(damage) / need),
        progress_tone=look['bar'],
    )


def record_row(state, settings, translate, view):
    metric = settings.get('record_metric')
    best = state['record'].get(metric)
    if not best:
        return None
    current = state['counts'].get(metric, 0)
    text = translate('bp_record_' + metric)
    if current > best:
        return _row(
            'record',
            text,
            format_number(current),
            tone='good',
            note=BEATEN_BY % format_number(current - best),
            progress=1.0,
            progress_tone='good',
        )
    return _row(
        'record',
        text,
        format_number(current),
        note=OF_TARGET % format_number(best),
        progress=float(current) / best,
    )


def wn8_row(state, settings, translate, view):
    wn8 = state['wn8']
    if wn8 is None:
        return None
    tank_wn8 = wn8['tank_wn8']
    return _row(
        'wn8',
        translate('bp_wn8'),
        ESTIMATE % format_number(wn8['wn8']),
        color=rating_color(wn8['wn8']) if settings.get('colored') else None,
        note=translate('bp_tank_wn8', wn8=format_number(tank_wn8)) if tank_wn8 is not None else None,
    )


ROW_BUILDERS = {'main_gun': main_gun_row, 'record': record_row, 'wn8': wn8_row}


def progress_rows(state, settings, translate, extended=False):
    view = {'extended': extended, 'settled': state['settled']}
    rows = []
    for kind in ROWS:
        if settings.get('row_' + kind):
            rows.append(ROW_BUILDERS[kind](state, settings, translate, view))
    return [row for row in rows if row is not None]
