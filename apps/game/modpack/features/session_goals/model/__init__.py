from __future__ import absolute_import, division, print_function, unicode_literals

# Fair play: the player's own goals and own progress; in battle only the own damage of this battle is added.

from .goals import Announced, damage_needed, is_done, parse_goals, progress  # noqa: F401
from .text import format_battle, format_done, format_hangar, page_actions  # noqa: F401
