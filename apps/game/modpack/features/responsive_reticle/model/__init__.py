from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number
from .constants import (
    FOLLOW_SMOOTH,
    LESTA_REALMS,
    MAX_FRAME_DIFF_S,
    MIN_FRAME_DIFF_S,
    REALM_LESTA,
    REALM_WG,
    ROTATE_ARGUMENTS,
    SERVER_TICK_S,
    SKIP_ARTILLERY,
    SKIP_FIXED_YAW,
    SKIP_REPLAY,
    SMOOTH_RELAX_S,
    SPG_TAG,
)

# Fair play: only the own gun marker is drawn more often, from the client's own prediction of the own gun. The aim sent
# to the server, the dispersion and the stock shot-result colour stay at the server tick; nothing is aimed, nothing
# about other vehicles is read, the shot is untouched.


def realm_of(current_realm):
    return REALM_LESTA if current_realm in LESTA_REALMS else REALM_WG


def argument_names(function):
    """The names of a function's (or an unbound method's) arguments after self."""
    function = getattr(function, '__func__', function)
    code = getattr(function, '__code__', None)
    if code is None:
        return ()
    return tuple(code.co_varnames[1:code.co_argcount])


def supports_rotate(names, realm):
    return tuple(names) == ROTATE_ARGUMENTS.get(realm)


def skip_reason(is_replay, class_tags, static_yaw):
    if is_replay:
        return SKIP_REPLAY
    if SPG_TAG in (class_tags or ()):
        return SKIP_ARTILLERY
    if static_yaw is not None:
        return SKIP_FIXED_YAW
    return None


def server_tick(now):
    if not is_number(now):
        return None
    return int(math.floor(now / SERVER_TICK_S))


def frame_time_diff(now, last):
    if not is_number(now) or not is_number(last):
        return None
    diff = now - last
    if diff < MIN_FRAME_DIFF_S:
        return None
    return min(diff, MAX_FRAME_DIFF_S)


def relax_time(follow, time_diff):
    if follow == FOLLOW_SMOOTH:
        return max(SMOOTH_RELAX_S, time_diff)
    return time_diff


class TickCache(object):
    """One value per server tick: `get(tick, compute)` computes it on the tick's first call and hands it back after."""

    def __init__(self):
        self.tick = None
        self.value = None

    def get(self, tick, compute):
        if tick is None or tick != self.tick:
            self.value = compute()
            self.tick = tick
        return self.value

    def clear(self):
        self.tick = None
        self.value = None


class TickGate(object):
    """Lets the first call of each key through once per server tick."""

    def __init__(self):
        self.ticks = {}

    def allow(self, key, tick):
        if tick is None:
            return True
        if self.ticks.get(key) == tick:
            return False
        self.ticks[key] = tick
        return True

    def clear(self):
        self.ticks.clear()
