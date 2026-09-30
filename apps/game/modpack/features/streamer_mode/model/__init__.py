from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import PRIVATE_HANGAR_LABELS

# Fair play: this component only hides things (the mod's own panels, the battle chat of others); it reads nothing.


def blocked_labels(settings):
    """The hangar labels a private stream keeps off the screen."""
    return PRIVATE_HANGAR_LABELS if settings.get('private') and settings.get('hide_hangar_stats') else ()


def hides_chat(settings, in_battle):
    return bool(in_battle and settings.get('private') and settings.get('hide_chat'))


class PanelToggle(object):
    """The hotkey's state: the mod's panels on or off the screen; a new battle starts with them on unless kept off."""

    def __init__(self):
        self.hidden = False

    def toggle(self):
        self.hidden = not self.hidden
        return self.hidden

    def battle_started(self, keep_hidden):
        if not keep_hidden:
            self.hidden = False
        return self.hidden
