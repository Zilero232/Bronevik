from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import ammo, call, equipments
from ....core.client.game import client_attr
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.timer import Ticker
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import ItemReading, Loadout, format_panel, shot_speed
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


# (penetration, damage, velocity) of an own shell as the vanilla shell tooltip reads them (RU 1.45 source).
def shell_stats(descriptor, gun_settings, int_cd):
    penetration = call(gun_settings, 'getPiercingPower', None, int_cd)
    damage = getattr(descriptor, 'avgDamage', None)
    speed = shot_speed(call(gun_settings, 'getShotSpeed', None, int_cd), projectile_speed_factor())
    return penetration, damage, speed


# `descriptor.icon[0]` is the name the stock consumables panel builds its icon path from (RU 1.45 source).
def descriptor_icon(descriptor):
    icon = getattr(descriptor, 'icon', None)
    return icon[0] if isinstance(icon, (tuple, list)) and icon else None


def item_reading(item):
    descriptor = call(item, 'getDescriptor')
    name = getattr(descriptor, 'shortUserString', None) or getattr(descriptor, 'userString', None)
    return ItemReading(
        name=name,
        quantity=call(item, 'getQuantity', 0),
        ready=getattr(item, 'isReady', False),
        remaining=call(item, 'getTimeRemaining', 0),
        icon=descriptor_icon(descriptor),
        total=call(item, 'getTotalTime', 0),
    )


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


# The own vehicle's consumables and shells from the client's own controllers (RU 1.45 source:
# guiSessionProvider.shared.equipments / .ammo, the ones the vanilla consumables panel listens to).
class ConsumablesPanel(BattlePanel):

    def __init__(self, app):
        self.loadout = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self, player):
        self.loadout = Loadout()
        self._read_layouts()
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

    def _read_layouts(self):
        for int_cd, item in call(equipments(), 'getOrderedEquipmentsLayout', []) or []:
            self._set_item(int_cd, item)
        for int_cd, descriptor, quantity, _, gun_settings in call(ammo(), 'getOrderedShellsLayout', []) or []:
            self._set_shell(int_cd, descriptor, quantity, gun_settings)
        self.loadout.set_current(call(ammo(), 'getCurrentShellCD'))

    def _set_item(self, int_cd, item):
        if item is None:
            return False
        return self.loadout.set_item(int_cd, item_reading(item))

    def _set_shell(self, int_cd, descriptor, quantity, gun_settings):
        code = shell_code(getattr(descriptor, 'kind', None))
        is_shell_changed = self.loadout.set_shell(int_cd, code, quantity, descriptor_icon(descriptor))
        are_stats_changed = self.loadout.set_stats(int_cd, *shell_stats(descriptor, gun_settings, int_cd))
        return is_shell_changed or are_stats_changed

    def _on_equipment(self, int_cd, item):
        if self.loadout is not None and self._set_item(int_cd, item):
            self.ticker.restart_elapsed()
            self.render()

    def _on_shells_added(self, int_cd, descriptor, quantity, *args):
        if self.loadout is None:
            return
        gun_settings = args[1] if len(args) > 1 else call(ammo(), 'getGunSettings')
        if self._set_shell(int_cd, descriptor, quantity, gun_settings):
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
