from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from .constants import DAMAGE_DROP_SHARE, MAX_BATTLES, MIN_EARLIER, RANDOM_BONUS_TYPE, RECENT_BATTLES, SESSION_IDLE_S

# Fair play: the player's own battle results of this session only; a soft suggestion, nothing is blocked.


def average(values):
    return float(sum(values)) / len(values) if values else 0.0


class TiltWatch(object):
    """The own random battles of the session and which break reminders were already given."""

    def __init__(self, idle_s=SESSION_IDLE_S):
        self.idle_s = idle_s
        self.reset(None)

    def reset(self, now):
        self.battles = []
        self.streak = 0
        self.given = set()
        self.last_at = now

    def add(self, event, now, settings):
        """The reminders this battle brings: 'streak', 'long', 'damage' (each once per streak or session)."""
        if event.get('bonus_type') != RANDOM_BONUS_TYPE:
            return []
        if self.last_at is not None and now - self.last_at > self.idle_s:
            self.reset(now)
        self.last_at = now
        damage = (event.get('stats') or {}).get('damage_dealt')
        self.battles.append(damage if is_number(damage) else 0)
        del self.battles[:-MAX_BATTLES]
        if event.get('result') == 'loss':
            self.streak += 1
        else:
            self.streak = 0
            self.given.discard('streak')
        notices = []
        limit = settings.get('loss_streak')
        if limit and self.streak >= limit and 'streak' not in self.given:
            notices.append('streak')
        long_after = settings.get('session_battles')
        if long_after and len(self.battles) >= long_after and 'long' not in self.given:
            notices.append('long')
        if settings.get('damage_drop') and 'damage' not in self.given and self.damage_dropped():
            notices.append('damage')
        self.given.update(notices)
        return notices

    def damage_dropped(self):
        earlier, recent = self.battles[:-RECENT_BATTLES], self.battles[-RECENT_BATTLES:]
        if len(earlier) < MIN_EARLIER or len(recent) < RECENT_BATTLES:
            return False
        base = average(earlier)
        return base > 0 and average(recent) < DAMAGE_DROP_SHARE * base

    def summary(self):
        return {'battles': len(self.battles), 'streak': self.streak, 'recent': int(round(average(self.battles[-RECENT_BATTLES:]))),
                'earlier': int(round(average(self.battles[:-RECENT_BATTLES])))}


def notice_text(key, summary, translate):
    return translate('tilt_guard_' + key, **summary)
