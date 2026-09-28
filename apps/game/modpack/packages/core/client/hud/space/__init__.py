"""Which GUI space the client is in: a label created in the hangar belongs to the hangar, one created in
battle to the battle (GUIFlash 0.6 keeps the same split)."""
from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ....hud.surface import SPACE_BATTLE, SPACE_LOBBY


def current_space():
    # GUIFlash's own test: the avatar has an arena, the account does not.
    return SPACE_BATTLE if hasattr(BigWorld.player(), 'arena') else SPACE_LOBBY


def cursor_events():
    """The client's (show, hide) cursor events on the global event bus, or None when they cannot be read."""
    try:
        from gui.shared import EVENT_BUS_SCOPE, events, g_eventBus
    except ImportError:
        return None
    game_event = getattr(events, 'GameEvent', None)
    show, hide = getattr(game_event, 'SHOW_CURSOR', None), getattr(game_event, 'HIDE_CURSOR', None)
    if show is None or hide is None:
        return None
    return g_eventBus, EVENT_BUS_SCOPE.GLOBAL, show, hide
