from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import ammo, call
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.timer import Ticker
from ....core.log import safe
from ..i18n import STRINGS
from ..model import GunState, format_panel
from ..model.constants import PREVIEW_SIZE, TICK_S
from ..model.preview import preview_text, preview_widget
from ..model.widget import reload_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


def clip_size(gun_settings):
    return getattr(getattr(gun_settings, 'clip', None), 'size', None)


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


# Fair play: the own gun's reload and magazine only, what the vanilla reticle's reload indicator reads from the
# client's ammo controller (RU 1.45 source: guiSessionProvider.shared.ammo, getCurrentShells() (quantity, inClip) or
# SHELL_QUANTITY_UNKNOWN (-1) pairs while no shell is current, onGunReloadTimeSet(shellCD, snapshot, skipAutoLoader)
# with the snapshot's getTimeLeft()/getBaseValue(), the gun settings' clip.size).
class ReloadTimerPanel(BattlePanel):

    def __init__(self, app):
        self.gun = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_SPEC)

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
        shells = call(ammo(), 'getCurrentShells')
        in_clip = None
        if isinstance(shells, tuple) and len(shells) == 2:
            _quantity, in_clip = shells
        return self.gun.set_in_clip(in_clip)

    def _on_reload(self, _shell_cd, snapshot, *args):
        if self.gun is None:
            return
        changed = self.gun.set_reload(call(snapshot, 'getTimeLeft', 0), call(snapshot, 'getBaseValue', 0))
        self.ticker.restart_elapsed()
        if changed:
            self.render()

    def _on_gun_settings(self, gun_settings):
        if self.gun is None:
            return
        if self.gun.set_clip(clip_size(gun_settings)):
            self.render()

    def _on_shells(self, int_cd, _quantity, in_clip, *args):
        if self.gun is None or int_cd != call(ammo(), 'getCurrentShellCD'):
            return
        if self.gun.set_in_clip(in_clip):
            self.render()

    def _on_current_shell(self, _int_cd):
        if self.gun is None:
            return
        if self._read_current():
            self.render()

    def _on_tick(self):
        if self.gun is None:
            return False
        if self.gun.tick(self.ticker.elapsed()):
            self.render()
        return True

    @safe
    def render(self):
        if self.gun is None:
            return
        text = format_panel(self.gun, self.settings, self.app.translate)
        if text:
            self.show(text, reload_widget(self.gun, self.settings))
        else:
            self.hide()
