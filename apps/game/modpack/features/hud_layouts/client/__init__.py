from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.hud import hud_layer
from ....core.hud import EVENT_RESET_LAYOUT
from ..i18n import STRINGS
from ..model import layout_policy, place_actions
from ..model.constants import ACTION_RESET_PLACES
from ..settings import SCHEMA, SECTION, SWITCH


class HudLayouts(FeatureComponent):
    """Gives the HUD layer its layout per battle type: the battle panels take it when they start (core.hud.modes); the
    places the player drags panels to in a battle of a type other than random stay with that type."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.layer = hud_layer(app)
        self.layer.set_policy(layout_policy(self.settings, self.enabled))
        app.bus.on(EVENT_RESET_LAYOUT, self._on_reset_layout)

    def settings_changed(self, changed):
        self.layer.set_policy(layout_policy(self.settings, self.enabled))

    def _on_reset_layout(self):
        self.layer.mode_places.clear()

    def ui_actions(self):
        return place_actions(self.layer.mode_places.modes(), self.app.translate) if self.enabled() else []

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_RESET_PLACES:
            return None
        self.layer.mode_places.clear()
        return self.notice_info('hud_layouts_places_reset')
