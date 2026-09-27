from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import font

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


def icon_html(path, size):
    return '<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def format_sixth_sense(state, settings, translate, now):
    size = settings.get('font_size')
    color = settings.get('color')
    parts = []
    if settings.get('icon'):
        parts.append(icon_html(settings.get('icon'), settings.get('icon_size')))
    text = settings.get('text') or ('' if settings.get('icon') else translate('sixth_sense_text'))
    if text:
        parts.append(font(text, color, size))
    elapsed = state.elapsed(now)
    if settings.get('show_timer') and elapsed is not None:
        parts.append(font(translate('sixth_sense_timer', seconds=elapsed), color, max(8, size - 6)))
    return '\n'.join(parts)
