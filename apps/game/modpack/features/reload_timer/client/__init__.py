from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call, shared
from ....core.client.hud.panel import BattlePanel
from ....core.client.timer import Ticker
from ....core.log import safe
from ..i18n import STRINGS
from ..model import GunState, format_panel
from ..model.constants import PREVIEW_SIZE, TICK_S
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


def ammo():
    return shared('ammo')


def clip_size(gun_settings):
    return getattr(getattr(gun_settings, 'clip', None), 'size', None)


class ReloadTimerPanel(BattlePanel):
    """The own gun's reload and magazine from the client's ammo controller (RU 1.45 source:
    guiSessionProvider.shared.ammo, onGunReloadTimeSet(shellCD, snapshot, skipAutoLoader) with the snapshot's
    getTimeLeft()/getBaseValue(), the gun settings' clip.size), what the vanilla reticle's reload indicator reads."""

    def __init__(self, app):
        self.gun = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.gun = GunState()
        controller = ammo()
        self.gun.set_clip(clip_size(call(controller, 'getGunSettings')))
        self._read_current()
        snapshot = call(controller, 'getGunReloadingState')
        self.gun.set_reload(call(snapshot, 'getTimeLeft', 0), call(snapshot, 'getBaseValue', 0))
        self.hooks.add(ammo, 'onGunReloadTimeSet', self._on_reload)
        self.hooks.add(ammo, 'onGunSettingsSet', self._on_gun_settings)
        self.hooks.add(ammo, 'onShellsUpdated', self._on_shells)
        self.hooks.add(ammo, 'onCurrentShellChanged', self._on_current_shell)
        self.ticker.start()
        self.render()

    def stop(self):
        self.ticker.stop()
        self.gun = None

    def _read_current(self):
        controller = ammo()
        shells = call(controller, 'getShells', None, call(controller, 'getCurrentShellCD'))
        return self.gun.set_in_clip(shells[1] if isinstance(shells, tuple) and len(shells) == 2 else None)

    def _on_reload(self, shell_cd, snapshot, *args):
        if self.gun is not None and self.gun.set_reload(call(snapshot, 'getTimeLeft', 0), call(snapshot, 'getBaseValue', 0)):
            self.render()

    def _on_gun_settings(self, gun_settings):
        if self.gun is not None and self.gun.set_clip(clip_size(gun_settings)):
            self.render()

    def _on_shells(self, int_cd, quantity, in_clip, *args):
        if self.gun is not None and int_cd == call(ammo(), 'getCurrentShellCD') and self.gun.set_in_clip(in_clip):
            self.render()

    def _on_current_shell(self, int_cd):
        if self.gun is not None and self._read_current():
            self.render()

    def _on_tick(self):
        if self.gun is None:
            return False
        if self.gun.tick(TICK_S):
            self.render()
        return True

    @safe
    def render(self):
        if self.gun is None:
            return
        text = format_panel(self.gun, self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()
