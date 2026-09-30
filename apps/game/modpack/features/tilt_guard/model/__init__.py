from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from .constants import (
    DAMAGE_DROP_SHARE,
    MAX_BATTLES,
    MIN_EARLIER,
    RANDOM_BONUS_TYPE,
    RECENT_BATTLES,
    SESSION_IDLE_S,
)

# Fair play: the player's own battle results of this session only; a soft suggestion, nothing is blocked.


def average(values):
    if not values:
        return 0.0
    return float(sum(values)) / len(values)


class TiltWatch(object):

    def __init__(self, idle_s=SESSION_IDLE_S):
        self.idle_s = idle_s
        self.reset(None)

    def reset(self, now):
        self.battles = []
        self.streak = 0
        self.given = set()
        self.last_at = now

    def add(self, event, now, settings):
        if event.get('bonus_type') != RANDOM_BONUS_TYPE:
            return []
        if self.last_at is not None and now - self.last_at > self.idle_s:
            self.reset(now)
        self.last_at = now
        self._record(event)

        notices = [key for key in self._due_notices(settings) if key not in self.given]
        self.given.update(notices)
        return notices

    def _record(self, event):
        damage = (event.get('stats') or {}).get('damage_dealt')
        self.battles.append(damage if is_number(damage) else 0)
        del self.battles[:-MAX_BATTLES]

        if event.get('result') == 'loss':
            self.streak += 1
        else:
            self.streak = 0
            self.given.discard('streak')

    def _due_notices(self, settings):
        notices = []
        streak_limit = settings.get('loss_streak')
        if streak_limit and self.streak >= streak_limit:
            notices.append('streak')
        long_after = settings.get('session_battles')
        if long_after and len(self.battles) >= long_after:
            notices.append('long')
        if settings.get('damage_drop') and 'damage' not in self.given and self.damage_dropped():
            notices.append('damage')
        return notices

    def _earlier(self):
        return self.battles[:-RECENT_BATTLES]

    def _recent(self):
        return self.battles[-RECENT_BATTLES:]

    def damage_dropped(self):
        earlier = self._earlier()
        recent = self._recent()
        if len(earlier) < MIN_EARLIER or len(recent) < RECENT_BATTLES:
            return False
        base = average(earlier)
        return base > 0 and average(recent) < DAMAGE_DROP_SHARE * base

    def summary(self):
        return {
            'battles': len(self.battles),
            'streak': self.streak,
            'recent': int(round(average(self._recent()))),
            'earlier': int(round(average(self._earlier()))),
        }


def notice_text(key, summary, translate):
    return translate('tilt_guard_' + key, **summary)
