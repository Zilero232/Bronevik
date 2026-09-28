from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import font
from .constants import DETECTION_SOUND, DIM_SUFFIX, ICON_RENDITIONS, ICON_ROOT, LAMP_SOUND_INDEX, PULSE_PERIOD_S

# Fair play: follows the client's own sixth-sense lamp (the player's vehicle is spotted); nothing else.


class SixthSense(object):

    def __init__(self):
        self.lit_at = None
        self.count = 0

    @property
    def lit(self):
        return self.lit_at is not None

    def observed(self, is_observed, now):
        if is_observed and not self.lit:
            self.lit_at = now
            self.count += 1
            return 'show'
        if not is_observed and self.lit:
            self.lit_at = None
            return 'hide'
        return None

    def reset(self):
        self.lit_at = None

    def elapsed(self, now):
        return int(max(0, now - self.lit_at)) if self.lit else None

    def expired(self, now, hide_after_s):
        return self.lit and hide_after_s > 0 and now - self.lit_at >= hide_after_s

    def dimmed(self, now):
        """The pulse: every other half second of a lit lamp shows the dimmed frame."""
        return self.lit and int(max(0, now - self.lit_at) / PULSE_PERIOD_S) % 2 == 1


def icon_html(path, size):
    return '<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def rendition(size):
    for candidate in ICON_RENDITIONS:
        if size <= candidate:
            return candidate
    return ICON_RENDITIONS[-1]


def icon_path(settings, dimmed=False):
    """The client image path of the icon to show, or '' for none."""
    icon_set = settings.get('icon_set')
    if icon_set == 'custom':
        return settings.get('icon')
    suffix = DIM_SUFFIX if dimmed and settings.get('pulse') else ''
    return '%s/%s%s_%d.png' % (ICON_ROOT, icon_set, suffix, rendition(settings.get('icon_size')))


def format_sixth_sense(state, settings, translate, now):
    size = settings.get('font_size')
    color = settings.get('color')
    parts = []
    icon = icon_path(settings, state.dimmed(now))
    if icon:
        parts.append(icon_html(icon, settings.get('icon_size')))
    text = settings.get('text') or ('' if icon else translate('sixth_sense_text'))
    if text:
        parts.append(font(text, color, size))
    elapsed = state.elapsed(now)
    if settings.get('show_timer') and elapsed is not None:
        parts.append(font(translate('sixth_sense_timer', seconds=elapsed), color, max(8, size - 6)))
    return '\n'.join(parts)


def to_native(values):
    """The game's detection-sound setting for the chosen lamp sound; nothing while it is left to the game."""
    index = LAMP_SOUND_INDEX.get(values.get('lamp_sound'))
    return {DETECTION_SOUND: index} if index is not None else {}
