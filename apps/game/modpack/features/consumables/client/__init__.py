from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import ammo, call, equipments
from ....core.client.game import client_attr
from ....core.client.hud.panel import BattlePanel
from ....core.client.timer import Ticker
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import Loadout, format_panel, shot_speed
from ..model.constants import PREVIEW_SIZE, TICK_S
from ..model.preview import preview_text, preview_widget
from ..model.widget import consumables_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import PROJECTILE_SPEED_FACTOR, VEHICLES_CACHE, VEHICLES_MODULE


def projectile_speed_factor():
    cache = client_attr(VEHICLES_MODULE, VEHICLES_CACHE)
    try:
        return cache.commonConfig['miscParams'][PROJECTILE_SPEED_FACTOR]
    except Exception:
        return None


def shell_stats(descriptor, gun_settings, int_cd):
    """(penetration, damage, velocity) of an own shell as the vanilla shell tooltip reads them (RU 1.45 source)."""
    return (call(gun_settings, 'getPiercingPower', None, int_cd), getattr(descriptor, 'avgDamage', None),
            shot_speed(call(gun_settings, 'getShotSpeed', None, int_cd), projectile_speed_factor()))


def item_name(item):
    descriptor = call(item, 'getDescriptor')
    return getattr(descriptor, 'shortUserString', None) or getattr(descriptor, 'userString', None)


def descriptor_icon(descriptor):
    """`descriptor.icon[0]`, the name the stock consumables panel builds its icon path from (RU 1.45 source)."""
    icon = getattr(descriptor, 'icon', None)
    return icon[0] if isinstance(icon, (tuple, list)) and icon else None


class ConsumablesPanel(BattlePanel):
    """The own vehicle's consumables and shells from the client's own controllers (RU 1.45 source:
    guiSessionProvider.shared.equipments / .ammo, the ones the vanilla consumables panel listens to)."""

    def __init__(self, app):
        self.loadout = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        self.loadout = Loadout()
        for int_cd, item in call(equipments(), 'getOrderedEquipmentsLayout', []) or []:
            self._set_item(int_cd, item)
        for int_cd, descriptor, quantity, _, gun_settings in call(ammo(), 'getOrderedShellsLayout', []) or []:
            self.loadout.set_shell(int_cd, shell_code(getattr(descriptor, 'kind', None)), quantity, descriptor_icon(descriptor))
            self.loadout.set_stats(int_cd, *shell_stats(descriptor, gun_settings, int_cd))
        self.loadout.set_current(call(ammo(), 'getCurrentShellCD'))
        self.hooks.add(equipments, 'onEquipmentAdded', self._on_equipment)
        self.hooks.add(equipments, 'onEquipmentUpdated', self._on_equipment)
        self.hooks.add(ammo, 'onShellsAdded', self._on_shells_added)
        self.hooks.add(ammo, 'onShellsUpdated', self._on_shells_updated)
        self.hooks.add(ammo, 'onCurrentShellChanged', self._on_current_shell)
        self.ticker.start()
        self.render()

    def stop(self):
        self.ticker.stop()
        self.loadout = None

    def _set_item(self, int_cd, item):
        if item is None:
            return False
        return self.loadout.set_item(int_cd, item_name(item), call(item, 'getQuantity', 0), getattr(item, 'isReady', False),
                                     call(item, 'getTimeRemaining', 0), descriptor_icon(call(item, 'getDescriptor')),
                                     call(item, 'getTotalTime', 0))

    def _on_equipment(self, int_cd, item):
        if self.loadout is not None and self._set_item(int_cd, item):
            self.ticker.restart_elapsed()
            self.render()

    def _on_shells_added(self, int_cd, descriptor, quantity, *args):
        if self.loadout is None:
            return
        changed = self.loadout.set_shell(int_cd, shell_code(getattr(descriptor, 'kind', None)), quantity, descriptor_icon(descriptor))
        gun_settings = args[1] if len(args) > 1 else call(ammo(), 'getGunSettings')
        if self.loadout.set_stats(int_cd, *shell_stats(descriptor, gun_settings, int_cd)) or changed:
            self.render()

    def _on_current_shell(self, int_cd, *args):
        if self.loadout is not None and self.loadout.set_current(int_cd):
            self.render()

    def _on_shells_updated(self, int_cd, quantity, *args):
        if self.loadout is None or int_cd not in self.loadout.shells:
            return
        if self.loadout.set_shell(int_cd, self.loadout.shells[int_cd]['code'], quantity):
            self.render()

    def _on_tick(self):
        if self.loadout is None:
            return False
        if self.loadout.tick(self.ticker.elapsed()):
            self.render()
        return True

    @safe
    def render(self):
        if self.loadout is None:
            return
        text = format_panel(self.loadout, self.settings, self.app.translate)
        if text:
            self.show(text, consumables_widget(self.loadout, self.settings, self.app.translate))
        else:
            self.hide()
