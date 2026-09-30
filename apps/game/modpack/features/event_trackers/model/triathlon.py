# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number, string_types, to_text
from .constants import BEST_BATTLES, MAX_NAME, MAX_ROUND_BATTLES, MAX_ROUNDS, MIN_TIER, RANDOM_BONUS_TYPE, ROUND_S

# Fair play: only the player's own battle results (clean XP of their own battles); nothing about the other players of the
# competition group, whose places only the game's own event page shows.


def _int(value):
    return int(value) if is_number(value) and not isinstance(value, bool) else None


def _name(value):
    if not isinstance(value, string_types):
        return None
    return to_text(value).strip()[:MAX_NAME] or None


def clean_event(raw):
    """The competition the client lists (`client/reads.py`), or None."""
    if not isinstance(raw, dict):
        return None
    cardinality = _int(raw.get('cardinality'))
    tier = _int(raw.get('min_tier'))
    return {
        'name': _name(raw.get('name')),
        'cardinality': cardinality if cardinality and 0 < cardinality <= 10 else BEST_BATTLES,
        'start': _int(raw.get('start')),
        'end': _int(raw.get('end')),
        'min_tier': tier if tier and 1 <= tier <= 11 else MIN_TIER,
    }


def counts(event, min_tier=MIN_TIER):
    """Whether an own battle event (`battle_event`) takes part in a round: a Random Battle on a tier high enough."""
    if not isinstance(event, dict) or event.get('bonus_type') != RANDOM_BONUS_TYPE:
        return False
    tier = (event.get('vehicle') or {}).get('tier')
    return is_int(tier) and tier >= min_tier


def _battle(item):
    if not isinstance(item, dict):
        return None
    at, xp = _int(item.get('at')), _int(item.get('xp'))
    if at is None or xp is None or xp < 0:
        return None
    return {'arena': to_text(item.get('arena') or u''), 'at': at, 'xp': xp, 'tank': _name(item.get('tank'))}


def _round(item):
    if not isinstance(item, dict) or _int(item.get('start')) is None:
        return None
    battles = [battle for battle in (_battle(entry) for entry in item.get('battles') or ()) if battle]
    return {'start': _int(item['start']), 'battles': battles[-MAX_ROUND_BATTLES:]} if battles else None


class TriathlonRounds(object):
    """The own rounds: a round starts with a battle that counts and takes every battle that started within ROUND_S of it."""

    def __init__(self, data=None):
        items = data.get('rounds') if isinstance(data, dict) else None
        self.rounds = [found for found in (_round(item) for item in items or ()) if found][-MAX_ROUNDS:]

    def add(self, event, min_tier=MIN_TIER, tank=None):
        """Record an own battle; `tank` is the name to show (the carousel's short name), the event's own by default."""
        if not counts(event, min_tier):
            return False
        at = _int(event.get('arena_created_at')) or _int(event.get('occurred_at'))
        xp = _int((event.get('stats') or {}).get('original_xp'))
        arena = to_text(event.get('arena_unique_id') or u'')
        if at is None or xp is None:
            return False
        if any(battle['arena'] == arena for item in self.rounds for battle in item['battles'] if arena):
            return False
        last = self.rounds[-1] if self.rounds else None
        if last is None or at >= last['start'] + ROUND_S or at < last['start']:
            last = {'start': at, 'battles': []}
            self.rounds = (self.rounds + [last])[-MAX_ROUNDS:]
        battle = _battle({'arena': arena, 'at': at, 'xp': xp, 'tank': tank or (event.get('vehicle') or {}).get('name')})
        last['battles'] = (last['battles'] + [battle])[-MAX_ROUND_BATTLES:]
        return True

    def last(self):
        return self.rounds[-1] if self.rounds else None

    def best_score(self, cardinality, since=None):
        """The best round score from `since` on (the competition's start), or None."""
        scores = [score(item, cardinality) for item in self.rounds if since is None or item['start'] >= since]
        return max(scores) if scores else None

    def dump(self):
        return {'rounds': self.rounds}


def best_battles(item, cardinality):
    return sorted(item['battles'], key=lambda battle: (-battle['xp'], battle['at']))[:cardinality]


def score(item, cardinality):
    return sum(battle['xp'] for battle in best_battles(item, cardinality))


def left_s(item, now):
    """Seconds left of a round at `now` (0 once it is over)."""
    return max(0, int(item['start'] + ROUND_S - now))
