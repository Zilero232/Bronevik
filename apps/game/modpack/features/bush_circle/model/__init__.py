from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import COLORS, HOTKEYS, RADIUS_M

# Fair play: a circle of a fixed radius around the player's own tank, drawn on the ground like the game's own area
# markers. It is placed from the own vehicle only and says nothing about other vehicles; nothing is changed in the game.


def color_of(name):
    return COLORS.get(name, COLORS['white'])


def hotkey_of(choice):
    """(Keys name, modifiers) of a hotkey choice; (None, ()) for none or an unknown one."""
    return HOTKEYS.get(choice, HOTKEYS['none'])


def diameter():
    return RADIUS_M * 2


class CircleState(object):
    """Whether the circle is wanted: the mode, the hotkey toggle and whether the own tank is alive."""

    def __init__(self, mode):
        self.mode = mode
        self.toggled = False
        self.alive = True

    def toggle(self):
        if self.mode != 'hotkey':
            return False
        self.toggled = not self.toggled
        return True

    def killed(self):
        changed = self.alive
        self.alive = False
        return changed

    def wanted(self):
        return self.alive and (self.mode == 'always' or self.toggled)
