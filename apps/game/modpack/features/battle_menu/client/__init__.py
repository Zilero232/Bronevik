from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ....core.client.component import FeatureComponent
from ....core.client.game import client_attr
from ....core.client.hud import create_backend
from ....core.events import EVENT_SETTINGS_OPEN
from ....core.hooks import override
from ....core.log import log, safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import button_props
from ..model.constants import BUTTON_ALIAS, SETTINGS_PAGE
from ..settings import SCHEMA, SWITCH
from .constants import DISPOSE_METHOD, MENU_CLASS, MENU_MODULE, POPULATE_METHOD


# The button is not part of the stock menu's window, so the menu keeps its modal focus (the cancel button) and Esc
# still closes it. A press closes the menu first and opens the settings window on the next frame, once the menu is
# gone.
class BattleMenuEntry(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.menu = None
        self.backend = None
        self.shown = False
        self._hook_menu()

    def _hook_menu(self):
        menu_class = client_attr(MENU_MODULE, MENU_CLASS)
        if menu_class is None:
            log('battle menu: the stock Esc menu was not found, no button')
            return False
        override(menu_class, POPULATE_METHOD)(self._on_populate)
        override(menu_class, DISPOSE_METHOD)(self._on_dispose)
        return True

    def _on_populate(self, original, menu, *args, **kwargs):
        result = original(menu, *args, **kwargs)
        self.menu = menu
        self.show()
        return result

    def _on_dispose(self, original, menu, *args, **kwargs):
        if menu is self.menu:
            self.menu = None
            self.hide()
        return original(menu, *args, **kwargs)

    def settings_changed(self, changed):
        self.hide()
        if self.menu is not None:
            self.show()

    def _backend(self):
        if self.backend is None:
            self.backend = create_backend()
            self.backend.listen_press(self._on_press)
        return self.backend

    @safe
    def show(self):
        backend = self._backend()
        if not self.enabled() or not backend.available() or not backend.draws_buttons():
            return False
        hint = self.app.translate('component_battle_menu_hint')
        self.shown = bool(backend.create(BUTTON_ALIAS, button_props(self.settings, hint)))
        return self.shown

    @safe
    def hide(self):
        if self.shown:
            self.shown = False
            self._backend().delete(BUTTON_ALIAS)

    @safe
    def _on_press(self, alias):
        if alias != BUTTON_ALIAS or self.menu is None:
            return
        menu = self.menu
        log('battle menu: the settings window asked from the Esc menu')
        menu.destroy()
        BigWorld.callback(0, self._open_settings)

    @safe
    def _open_settings(self):
        self.app.bus.emit(EVENT_SETTINGS_OPEN, SETTINGS_PAGE)
