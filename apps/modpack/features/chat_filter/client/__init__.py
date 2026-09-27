from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import client_attr
from ....core.hooks import override
from ....core.log import log
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ChatFilter, stamp
from ..settings import SCHEMA, SWITCH
from .constants import CONTROLLER_CLASS, CONTROLLERS_MODULE, LAYOUT_CLASS, LAYOUT_MODULE


def _is_own(session_id):
    try:
        from messenger.ext.player_helpers import isCurrentPlayer
        return bool(isCurrentPlayer(session_id))
    except Exception:
        return False


class ChatFilterFeature(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.filter = None
        self.installed = self._install()
        app.bus.on('battle_ready', self._on_battle_ready)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _install(self):
        layout = client_attr(LAYOUT_MODULE, LAYOUT_CLASS)
        controller = client_attr(CONTROLLERS_MODULE, CONTROLLER_CLASS)
        if layout is None or controller is None:
            log('chat filter: battle chat classes not found, feature off')
            return False
        override(layout, 'addMessage')(self._add_message)
        override(layout, 'addCommand')(self._add_command)
        override(controller, '_formatMessage')(self._format_message)
        return True

    def _on_battle_ready(self, player):
        self.filter = ChatFilter(self.settings) if self.enabled() else None

    def _on_battle_leave(self):
        if self.filter is not None and self.filter.hidden:
            log('chat filter: %d lines hidden' % self.filter.hidden)
        self.filter = None

    def _add_message(self, original, layout, message, *args, **kwargs):
        chat = self.filter
        session_id = getattr(message, 'avatarSessionID', None)
        if chat is not None and not _is_own(session_id) and not chat.allow_message(session_id, getattr(message, 'text', ''), time.time()):
            return True
        return original(layout, message, *args, **kwargs)

    def _add_command(self, original, layout, command, *args, **kwargs):
        chat = self.filter
        if chat is not None and not command.isSender() and not chat.allow_command(command.getSenderID(), time.time()):
            return None
        return original(layout, command, *args, **kwargs)

    def _format_message(self, original, controller, message, doFormatting=True):
        result = original(controller, message, doFormatting)
        fmt = self.settings.get('timestamp_format')
        if self.filter is None or not doFormatting or not fmt:
            return result
        is_current, text = result
        return is_current, stamp(text, fmt, time.time())
