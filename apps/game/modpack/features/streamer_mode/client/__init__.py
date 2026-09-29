from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.chat import battle_layout, is_own, is_own_command
from ....core.client.component import FeatureComponent
from ....core.client.hotkey import Hotkey
from ....core.client.hud import hud_layer
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import override
from ....core.log import log, safe
from ..i18n import STRINGS
from ..model import PanelToggle, blocked_labels, hides_chat, hotkey_of
from ..settings import SCHEMA, SECTION, SWITCH


class StreamerMode(FeatureComponent):
    """The hotkey that takes the mod's panels off the screen (the HUD layer and the hangar labels hold their texts) and
    the private mode: the hangar labels with the player's own numbers blocked, the battle chat of others not drawn."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.toggle = PanelToggle()
        self.hotkey = None
        self.hotkey_choice = None
        self.chat_hooked = self._hook_chat()
        bus = app.bus
        bus.on('hangar', self._on_hangar)
        bus.on('battle_ready', self._on_battle_ready)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _hook_chat(self):
        layout = battle_layout()
        if layout is None:
            log('streamer mode: battle chat classes not found, the chat stays')
            return False
        override(layout, 'addMessage')(self._add_message)
        override(layout, 'addCommand')(self._add_command)
        return True

    def _on_hangar(self):
        self._install_hotkey()
        self._apply_private()

    def _on_battle_ready(self, player):
        self._set_hidden(self.toggle.battle_started(self.enabled() and self.settings.get('keep_hidden')))

    def _on_settings(self, component_id, changed):
        if component_id == SECTION:
            self._install_hotkey()
            self._apply_private()

    def _install_hotkey(self):
        choice = self.settings.get('hotkey') if self.enabled() else 'none'
        if choice == self.hotkey_choice:
            return
        if self.hotkey is not None:
            self.hotkey.remove()
            self.hotkey = None
        self.hotkey_choice = choice
        key, modifiers = hotkey_of(choice)
        if key is not None:
            self.hotkey = Hotkey(key, modifiers, self._on_hotkey)
            self.hotkey.install()
        if key is None and self.toggle.hidden:
            self.toggle.hidden = False
            self._set_hidden(False)

    @safe
    def _on_hotkey(self):
        if not self.enabled():
            return
        hidden = self.toggle.toggle()
        self._set_hidden(hidden)
        if not self.app.in_battle:
            hotkey = self.app.translate('streamer_mode_hotkey_%s' % self.hotkey_choice)
            self.app.ui.notify(self.app.translate('streamer_mode_hidden' if hidden else 'streamer_mode_shown', hotkey=hotkey))

    def _set_hidden(self, hidden):
        hud_layer(self.app).set_muted(hidden)
        self.app.ui.set_muted(hidden)

    def _apply_private(self):
        self.app.ui.set_blocked(blocked_labels(self.settings) if self.enabled() else ())

    def _hides_chat(self):
        return self.enabled() and hides_chat(self.settings, self.app.in_battle)

    # The own lines and commands are never touched (a command that cannot tell counts as own); a hidden line skips the
    # client's addMessage like chat_filter's.
    def _add_message(self, original, layout, message, *args, **kwargs):
        if self._hides_chat() and not is_own(getattr(message, 'avatarSessionID', None)):
            return True
        return original(layout, message, *args, **kwargs)

    def _add_command(self, original, layout, command, *args, **kwargs):
        if self._hides_chat() and not is_own_command(command):
            return None
        return original(layout, command, *args, **kwargs)
