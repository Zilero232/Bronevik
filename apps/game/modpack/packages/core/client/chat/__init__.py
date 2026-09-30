"""The battle chat classes the chat features override, and the check for the player's own lines (never touched)."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import call
from ..game import client_attr
from .constants import CONTROLLER_CLASS, CONTROLLERS_MODULE, EPIC_CONTROLLER_CLASS, LAYOUT_CLASS, LAYOUT_MODULE


def battle_layout():
    """The client's BattleLayout class (addMessage, addCommand), or None."""
    return client_attr(LAYOUT_MODULE, LAYOUT_CLASS)


def format_controllers():
    """Every battle channel controller class with its own _formatMessage: the base one and the Frontline team chat."""
    classes = [client_attr(CONTROLLERS_MODULE, name) for name in (CONTROLLER_CLASS, EPIC_CONTROLLER_CLASS)]
    return [owner for owner in classes if owner is not None and '_formatMessage' in getattr(owner, '__dict__', {})]


def is_own_command(command):
    """True for a quick command the player sent. RU 1.45 messenger/proto/entities.py:140: isSender() is False when the
    sender is not in the battle user storage, so the session id is checked too; a command that cannot tell counts as own."""
    sender = call(command, 'getSenderID')
    is_sender = getattr(command, 'isSender', None)
    if sender is None and is_sender is None:
        return True
    return bool(call(command, 'isSender')) or is_own(sender)


def is_own(session_id):
    """True for a line the player wrote."""
    try:
        from messenger.ext.player_helpers import isCurrentPlayer
        return bool(isCurrentPlayer(session_id))
    except Exception:
        return False
