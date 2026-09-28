from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call, shared
from ....core.client.hud.panel import BattlePanel
from ....core.client.timer import Ticker
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import Loadout, format_panel
from ..model.constants import PREVIEW_SIZE, TICK_S
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


def equipments():
    return shared('equipments')


def ammo():
    return shared('ammo')


def item_name(item):
    descriptor = call(item, 'getDescriptor')
    return getattr(descriptor, 'shortUserString', None) or getattr(descriptor, 'userString', None)


class ConsumablesPanel(BattlePanel):
    """The own vehicle's consumables and shells from the client's own controllers (RU 1.45 source:
    guiSessionProvider.shared.equipments / .ammo, the ones the vanilla consumables panel listens to)."""

    def __init__(self, app):
        self.loadout = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.loadout = Loadout()
        for int_cd, item in call(equipments(), 'getOrderedEquipmentsLayout', []) or []:
            self._set_item(int_cd, item)
        for int_cd, descriptor, quantity, _, _ in call(ammo(), 'getOrderedShellsLayout', []) or []:
            self.loadout.set_shell(int_cd, shell_code(getattr(descriptor, 'kind', None)), quantity)
        self.hooks.add(equipments, 'onEquipmentAdded', self._on_equipment)
        self.hooks.add(equipments, 'onEquipmentUpdated', self._on_equipment)
        self.hooks.add(ammo, 'onShellsAdded', self._on_shells_added)
        self.hooks.add(ammo, 'onShellsUpdated', self._on_shells_updated)
        self.ticker.start()
        self.render()

    def stop(self):
        self.ticker.stop()
        self.loadout = None

    def _set_item(self, int_cd, item):
        if item is None:
            return False
        return self.loadout.set_item(int_cd, item_name(item), call(item, 'getQuantity', 0), getattr(item, 'isReady', False),
                                     call(item, 'getTimeRemaining', 0))

    def _on_equipment(self, int_cd, item):
        if self.loadout is not None and self._set_item(int_cd, item):
            self.render()

    def _on_shells_added(self, int_cd, descriptor, quantity, *args):
        if self.loadout is not None and self.loadout.set_shell(int_cd, shell_code(getattr(descriptor, 'kind', None)), quantity):
            self.render()

    def _on_shells_updated(self, int_cd, quantity, *args):
        if self.loadout is None or int_cd not in self.loadout.shells:
            return
        if self.loadout.set_shell(int_cd, self.loadout.shells[int_cd]['code'], quantity):
            self.render()

    def _on_tick(self):
        if self.loadout is None:
            return False
        if self.loadout.tick(TICK_S):
            self.render()
        return True

    @safe
    def render(self):
        if self.loadout is None:
            return
        text = format_panel(self.loadout, self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()
