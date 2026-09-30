# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int
from ....core.format import count_phrase, format_number
from ....core.hud.modes import MODE_COMP7, battle_mode
from .constants import KEPT_BATTLES, MIN_STREAK, RESULT_TONES, SHOWN_BATTLES

# Fair play: only the player's own Onslaught battles, from the own battle results the client already shows (the
# `personal` block: the own vehicle's team and the rating change of the post-battle screen). Nothing about other
# players is read or kept.


def _int(value):
    return value if is_int(value) and not isinstance(value, bool) else None


def _own_vehicle(personal):
    for key, value in personal.items():
        if key == 'avatar':
            continue
        entry = value[0] if isinstance(value, list) and value else value
        if isinstance(entry, dict) and 'typeCompDescr' in entry:
            return entry
    return {}


def _outcome(winner_team, team):
    if winner_team == 0:
        return 'draw'
    return 'win' if winner_team == team else 'loss'


def own_battle(arena_id, results):
    """The own Onslaught battle of `results` ({arena, result, delta, t}), or None for another battle type."""
    if not isinstance(results, dict) or _int(arena_id) is None:
        return None
    common = results.get('common') or {}
    if battle_mode(common.get('guiType'), common.get('bonusType')) != MODE_COMP7:
        return None
    personal = results.get('personal') or {}
    avatar = personal.get('avatar') or {}
    team = _int(_own_vehicle(personal).get('team')) or _int(avatar.get('team'))
    winner = _int(common.get('winnerTeam'))
    if team is None or winner is None:
        return None
    return {
        'arena': arena_id,
        'result': _outcome(winner, team),
        'delta': _int(avatar.get('comp7RatingDelta')),
        't': _int(common.get('arenaCreateTime')) or 0,
    }


def clean_history(raw):
    if not isinstance(raw, list):
        return []
    kept = [entry for entry in raw if isinstance(entry, dict) and entry.get('result') in RESULT_TONES]
    return kept[-KEPT_BATTLES:]


def record(history, battle):
    if battle is None or any(entry.get('arena') == battle['arena'] for entry in history):
        return history
    return (history + [battle])[-KEPT_BATTLES:]


def streak(history):
    """(result, length) of the run of equal results the newest battle ends; a draw ends every run."""
    if not history or history[-1]['result'] == 'draw':
        return None, 0
    result = history[-1]['result']
    length = 0
    for entry in reversed(history):
        if entry['result'] != result:
            break
        length += 1
    return result, length


def recent(history):
    return history[-SHOWN_BATTLES:]


def recent_delta(history):
    deltas = [entry['delta'] for entry in recent(history) if entry.get('delta') is not None]
    return sum(deltas) if deltas else None


def signed(value):
    return (u'+' if value > 0 else u'') + format_number(value)


def streak_text(history, translate):
    result, length = streak(history)
    if length < MIN_STREAK:
        return None
    battles = count_phrase(length, translate('comp7_helper_forms_%s' % result))
    return translate('comp7_helper_streak', count=battles)


def recent_text(history, translate):
    shown = recent(history)
    if not shown:
        return None
    marks = u''.join(translate('comp7_helper_mark_%s' % entry['result']) for entry in shown)
    delta = recent_delta(history)
    if delta is None:
        return translate('comp7_helper_recent', marks=marks)
    return translate('comp7_helper_recent_delta', marks=marks, delta=signed(delta))


def battle_lines(history, translate):
    return [line for line in (streak_text(history, translate), recent_text(history, translate)) if line]


def strip(history):
    return [RESULT_TONES[entry['result']] for entry in recent(history)]
