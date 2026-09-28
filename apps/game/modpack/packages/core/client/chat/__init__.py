"""The battle chat classes the chat features override, and the check for the player's own lines (never touched)."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..game import client_attr
from .constants import CONTROLLER_CLASS, CONTROLLERS_MODULE, LAYOUT_CLASS, LAYOUT_MODULE


def battle_layout():
    """The client's BattleLayout class (addMessage, addCommand), or None."""
    return client_attr(LAYOUT_MODULE, LAYOUT_CLASS)


def channel_controller():
    """The client's battle _ChannelController class (_formatMessage), or None."""
    return client_attr(CONTROLLERS_MODULE, CONTROLLER_CLASS)


def is_own(session_id):
    """True for a line the player wrote."""
    try:
        from messenger.ext.player_helpers import isCurrentPlayer
        return bool(isCurrentPlayer(session_id))
    except Exception:
        return False
