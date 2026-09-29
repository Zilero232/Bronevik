"""Per-battle counters of the player's own feedback for the python.log line that shows what the client reported:
own hit markers, own battle events (damage, blocked, assist, stun, received) and the vanilla totals of the personal
efficiency controller. Pure: the events are the client's objects, read only through their public getters."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_number
from .constants import CRIT_KEYS, DAMAGE_KEYS, EFFICIENCY_KEYS, ENEMY_ONLY_KEYS, EVENT_KEYS, MARKER_OUTCOMES, PEN_OUTCOMES

__all__ = ('BattleTally', 'EFFICIENCY_KEYS', 'EVENT_KEYS', 'MARKER_OUTCOMES', 'efficiency_totals', 'extra_amount')


def _call(target, name, default=None):
    method = getattr(target, name, None)
    if method is None:
        return default
    try:
        return method()
    except Exception:
        return default


def extra_amount(extra, name='getDamage'):
    """The positive int the extra reports through `name`, else 0."""
    value = _call(extra, name, 0)
    return int(value) if is_number(value) and value > 0 else 0


def efficiency_totals(totals, keys_by_type):
    """{'dealt': .., 'assist': .., ...} from the controller's {PERSONAL_EFFICIENCY_TYPE: total}; only the types it
    holds (onTotalEfficiencyUpdated sends the changed ones)."""
    picked = {}
    for efficiency_type, value in (totals or {}).items():
        key = keys_by_type.get(efficiency_type)
        if key is not None and is_number(value) and value >= 0:
            picked[key] = int(value)
    return picked


class BattleTally(object):
    """What the client reported this battle; `summary()` gives the two python.log lines."""

    def __init__(self):
        self.markers = {}
        self.events = dict((key, 0) for _, key in EVENT_KEYS)
        self.event_counts = dict((key, 0) for _, key in EVENT_KEYS)
        self.vanilla = {}
        self.batches = 0
        self.hooks = []

    def add_marker(self, outcome):
        if outcome is None:
            return False
        self.markers[outcome] = self.markers.get(outcome, 0) + 1
        return True

    def add_events(self, events, keys_by_kind, is_enemy):
        """Counts one onPlayerFeedbackReceived batch; `is_enemy(vehicle_id)` decides the enemy-only keys."""
        self.batches += 1
        added = 0
        for event in events or ():
            key = keys_by_kind.get(_call(event, 'getBattleEventType'))
            if key is None:
                continue
            if key in ENEMY_ONLY_KEYS and not is_enemy(_call(event, 'getTargetID')):
                continue
            extra = _call(event, 'getExtra')
            if key in DAMAGE_KEYS:
                amount = extra_amount(extra)
            elif key in CRIT_KEYS:
                amount = extra_amount(extra, 'getCritsCount')
            else:
                amount = 1
            self.events[key] += amount
            self.event_counts[key] += 1
            added += 1
        return added

    def apply_vanilla(self, totals):
        changed = False
        for key, value in totals.items():
            if self.vanilla.get(key) != value:
                self.vanilla[key] = value
                changed = True
        return changed

    def hooked(self, name, attached):
        self.hooks.append((name, bool(attached)))

    def values(self):
        markers = self.markers
        values = {
            'hits': sum(markers.values()),
            'pens': sum(markers.get(outcome, 0) for outcome in PEN_OUTCOMES),
            'ricochets': markers.get('ricochet', 0),
            'damaging_hits': self.event_counts['dealt'],
        }
        for key in DAMAGE_KEYS:
            values[key] = max(self.events[key], self.vanilla.get(key, 0))
        return values

    def summary(self):
        values = self.values()
        hooks = ', '.join('%s %s' % (name, 'ok' if attached else 'MISSING') for name, attached in self.hooks) or 'none'
        vanilla = ', '.join('%s %d' % (key, self.vanilla[key]) for key in sorted(self.vanilla)) or 'none'
        markers = ', '.join('%s %d' % (key, self.markers[key]) for key in sorted(self.markers)) or 'none'
        return ('battle: hits %(hits)d, pens %(pens)d, dealt %(dealt)d, blocked %(blocked)d, assist %(assist)d, stun %(stun)d, '
                'received %(received)d' % values,
                'battle detail: markers [%s]; events %d batches, damaging hits %d, crits %d, kills %d; vanilla totals [%s]; hooks [%s]'
                % (markers, self.batches, values['damaging_hits'], self.events['crits'], self.events['kills'], vanilla, hooks))
