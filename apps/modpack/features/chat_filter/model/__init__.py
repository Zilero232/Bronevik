from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import string_types, to_text
from ....core.format import COLOR_MUTED, font, format_moment, single_spaces, strip_tags
from .constants import MAX_SENDERS, WORD_SEPARATORS

# Fair play: it only hides or annotates chat lines the client already received, never the player's own.


def normalize(text):
    if not isinstance(text, string_types):
        return u''
    return single_spaces(strip_tags(text, u' ')).lower()


def parse_words(value):
    return tuple(word for word in (normalize(part) for part in WORD_SEPARATORS.split(to_text(value or u''))) if word)


def stamp(text, fmt, now):
    if not fmt:
        return text
    return u'%s %s' % (font(u'[%s]' % format_moment(fmt, time.localtime(now)), COLOR_MUTED), to_text(text))


class ChatFilter(object):

    def __init__(self, settings):
        self.settings = settings
        self.lines = {}
        self.commands = {}
        self.hidden = 0

    def _recent(self, history, sender, now, window):
        entries = [entry for entry in history.get(sender, ()) if now - entry[0] < window]
        if sender not in history and len(history) >= MAX_SENDERS:
            history.pop(min(history, key=lambda key: history[key][-1][0] if history[key] else 0))
        history[sender] = entries
        return entries

    def _over_rate(self, entries):
        limit = self.settings.get('rate_limit')
        return bool(limit) and len(entries) >= limit

    def allow_message(self, sender, text, now):
        settings = self.settings
        window = max(settings.get('duplicate_window_s'), settings.get('rate_window_s'))
        entries = self._recent(self.lines, sender, now, window)
        line = normalize(text)
        allowed = True
        words = parse_words(settings.get('block_words'))
        if words and any(word in line for word in words):
            allowed = False
        elif settings.get('filter_duplicates') and any(entry[1] == line and now - entry[0] < settings.get('duplicate_window_s')
                                                       for entry in entries):
            allowed = False
        elif self._over_rate([entry for entry in entries if now - entry[0] < settings.get('rate_window_s')]):
            allowed = False
        entries.append((now, line))
        if not allowed:
            self.hidden += 1
        return allowed

    def allow_command(self, sender, now):
        if not self.settings.get('filter_commands'):
            return True
        entries = self._recent(self.commands, sender, now, self.settings.get('rate_window_s'))
        allowed = not self._over_rate(entries)
        entries.append((now, None))
        if not allowed:
            self.hidden += 1
        return allowed
