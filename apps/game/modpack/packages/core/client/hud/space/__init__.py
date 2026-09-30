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


def cursor_visible():
    """Whether the client shows the mouse cursor (RU 1.45 client source: CursorManager.show/hide set `GUI.mcursor().visible`
    and fire SHOW_CURSOR/HIDE_CURSOR; Ctrl in battle, Tab, the chat), or None when it cannot be read."""
    try:
        import GUI
        return bool(GUI.mcursor().visible)
    except Exception:
        return None


def gui_spaces():
    """(app loader, its GuiGlobalSpaceID) or (None, None) when the client has neither."""
    try:
        from helpers import dependency
        from skeletons.gui.app_loader import GuiGlobalSpaceID, IAppLoader
    except ImportError:
        return None, None
    return dependency.instance(IAppLoader), GuiGlobalSpaceID
