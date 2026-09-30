# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, counted, font, format_number
from .constants import DAY_S, HOUR_S, MINUTE_S, TIER_NUMERALS, TITLE_SIZE_STEP
from .triathlon import best_battles, left_s, score

# Fair play: the Trading Caravan card shows the own token count the client keeps for the caravan page and the event's end
# the hangar entry point shows; the Triathlon card only the player's own battles.


def remaining(seconds, translate):
    """`3 дня 4 часа`, `5 часов`, `23 минуты`: the time left, coarse."""
    seconds = max(0, int(seconds))
    if seconds >= DAY_S:
        days, hours = seconds // DAY_S, (seconds % DAY_S) // HOUR_S
        text = counted(days, 'days', translate)
        return u'%s %s' % (text, counted(hours, 'hours', translate)) if hours else text
    if seconds >= HOUR_S:
        return counted(seconds // HOUR_S, 'hours', translate)
    return counted(max(1, (seconds + MINUTE_S - 1) // MINUTE_S), 'minutes', translate)


def clean_caravan(raw):
    """The caravan reads (`client/reads.py`), or None outside the event."""
    if not isinstance(raw, dict):
        return None
    coins, finish = raw.get('coins'), raw.get('finish')
    return {'coins': int(coins) if is_number(coins) and coins > 0 else 0, 'finish': int(finish) if is_number(finish) and finish > 0 else None}


def triathlon_view(rounds, event, now, translate):
    """What the Triathlon card shows: title, score, state line, the best battles, the battle count, the best round, rule."""
    cardinality = event['cardinality']
    last = rounds.last()
    running = last is not None and left_s(last, now) > 0
    if last is None:
        state = translate('event_trackers_round_none')
    elif running:
        state = translate('event_trackers_round_left', time=remaining(left_s(last, now), translate))
    else:
        state = translate('event_trackers_round_over')
    best = rounds.best_score(cardinality, event['start'])
    return {
        'title': event['name'] or translate('event_trackers_triathlon'),
        'score': score(last, cardinality) if last is not None else None,
        'state': state,
        'running': running,
        'battles': best_battles(last, cardinality) if last is not None else [],
        'count': len(last['battles']) if last is not None else 0,
        'best': best,
        'rule': translate('event_trackers_triathlon_rule', count=cardinality, tier=TIER_NUMERALS.get(event['min_tier'], u'')),
    }


def format_triathlon(view, settings, translate):
    size = settings.get('font_size')
    value = format_number(view['score']) if view['score'] is not None else u'-'
    lines = [font(u'%s: %s' % (view['title'], value), COLOR_NEUTRAL, size + TITLE_SIZE_STEP),
             font(view['state'], COLOR_UP if view['running'] else COLOR_MUTED, size)]
    for place, battle in enumerate(view['battles'], 1):
        lines.append(font(u'%d. %s — %s' % (place, battle['tank'] or u'-', format_number(battle['xp'])), COLOR_NEUTRAL, size))
    if view['count']:
        lines.append(font(translate('event_trackers_round_battles', battles=counted(view['count'], 'battles', translate)), COLOR_MUTED, size))
    if view['best'] is not None:
        lines.append(font(translate('event_trackers_best_round_line', score=format_number(view['best'])), COLOR_MUTED, size))
    return u'\n'.join(lines)


def format_caravan(caravan, now, settings, translate):
    size = settings.get('font_size')
    lines = [font(translate('event_trackers_caravan_line', tokens=counted(caravan['coins'], 'tokens', translate)), COLOR_NEUTRAL, size + TITLE_SIZE_STEP)]
    if caravan['finish'] is not None and caravan['finish'] > now:
        lines.append(font(translate('event_trackers_ends_in', time=remaining(caravan['finish'] - now, translate)), COLOR_MUTED, size))
    return u'\n'.join(lines)
