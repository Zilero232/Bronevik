from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.format import font
from .constants import (
    DETECTION_SOUND,
    DIM_SUFFIX,
    ENDED,
    ICON_RENDITIONS,
    ICON_ROOT,
    LAMP_DURATION_S,
    LAMP_SOUND_INDEX,
    MIN_TIMER_FONT_SIZE,
    OBSERVED,
    PULSE_PERIOD_S,
    TIMER_FONT_DECREASE,
)

# Fair play: follows the client's own sixth-sense lamp (the player's vehicle is spotted); nothing else.


def lamp_duration(hide_after_s, own_spotting_decrease):
    if hide_after_s > 0:
        return float(hide_after_s)

    return max(0.0, LAMP_DURATION_S - (own_spotting_decrease or 0.0))


class SixthSense(object):

    def __init__(self):
        self.lit_at = None
        self.duration = LAMP_DURATION_S
        self.shown_seconds = 0
        self.over = False

    @property
    def lit(self):
        return self.lit_at is not None

    def observed(self, is_observed, now, duration=LAMP_DURATION_S):
        if is_observed:
            return self._light(now, duration)
        if not self.lit:
            return None

        self.lit_at = None
        return 'hide'

    def _light(self, now, duration):
        if self.lit or self.over:
            return None

        self.lit_at = now
        self.duration = duration
        self.shown_seconds = int(math.ceil(duration))
        return 'show'

    def vehicle_state(self, state, value, now, duration=LAMP_DURATION_S):
        if state == ENDED:
            self.reset()
            return 'hide'
        if state == OBSERVED:
            return self.observed(bool(value), now, duration)
        return None

    def reset(self):
        self.lit_at = None

    def finish(self):
        self.over = True
        self.reset()

    def elapsed(self, now):
        if not self.lit:
            return None

        return int(max(0, now - self.lit_at))

    def seconds_left(self, now):
        if not self.lit:
            return None

        return max(0.0, self.duration - (now - self.lit_at))

    def tick_due(self, now):
        seconds_left = self.seconds_left(now)
        if seconds_left is None:
            return False

        shown_seconds = int(math.ceil(seconds_left))
        if not 0 < shown_seconds < self.shown_seconds:
            return False

        self.shown_seconds = shown_seconds
        return True

    def expired(self, now, hide_after_s):
        if not self.lit or hide_after_s <= 0:
            return False

        return now - self.lit_at >= hide_after_s

    def dimmed(self, now):
        if not self.lit:
            return False

        pulse_frame = int(max(0, now - self.lit_at) / PULSE_PERIOD_S)
        return pulse_frame % 2 == 1


def icon_html(path, size):
    return '<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def rendition(size):
    for candidate in ICON_RENDITIONS:
        if size <= candidate:
            return candidate
    return ICON_RENDITIONS[-1]


# The client image path of the icon to show; '' when a custom icon is left empty (the text shows instead).
def icon_path(settings, dimmed=False):
    icon_set = settings.get('icon_set')
    if icon_set == 'custom':
        return settings.get('icon')

    shows_dim_frame = dimmed and settings.get('pulse')
    suffix = DIM_SUFFIX if shows_dim_frame else ''
    return '%s/%s%s_%d.png' % (ICON_ROOT, icon_set, suffix, rendition(settings.get('icon_size')))


def lamp_text(settings, has_icon, translate):
    own_text = settings.get('text')
    if own_text:
        return own_text
    if has_icon:
        return ''

    return translate('sixth_sense_text')


def timer_line(state, settings, translate, now):
    elapsed = state.elapsed(now)
    if not settings.get('show_timer') or elapsed is None:
        return None

    size = max(MIN_TIMER_FONT_SIZE, settings.get('font_size') - TIMER_FONT_DECREASE)
    return font(translate('sixth_sense_timer', seconds=elapsed), settings.get('color'), size)


def format_sixth_sense(state, settings, translate, now):
    icon = icon_path(settings, state.dimmed(now))
    text = lamp_text(settings, bool(icon), translate)
    timer = timer_line(state, settings, translate, now)

    parts = []
    if icon:
        parts.append(icon_html(icon, settings.get('icon_size')))
    if text:
        parts.append(font(text, settings.get('color'), settings.get('font_size')))
    if timer:
        parts.append(timer)
    return '\n'.join(parts)


# The game's detection-sound setting for the chosen lamp sound; nothing while the sound is left to the game.
def to_native(values):
    index = LAMP_SOUND_INDEX.get(values.get('lamp_sound'))
    if index is None:
        return {}

    return {DETECTION_SOUND: index}
