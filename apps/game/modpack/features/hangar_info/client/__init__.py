from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hud import EVENT_RESET_LAYOUT
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import armor_actions, format_info, layout_of
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL, LAYOUT_KEYS, PING_REQUEST_S
from .reads import accelerated_training, battle_tiers, crew_next_skill, online, ping, request_ping, server_name


class HangarInfo(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.text = None
        self.pinged_at = 0.0
        app.bus.on('hangar', self._on_hangar)
        app.bus.on('tick', self._on_tick)
        app.bus.on('battle_enter', self._hide)
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)
        app.bus.on(EVENT_RESET_LAYOUT, self._on_reset_layout)

    def _on_hangar(self):
        self.render(time.time())

    def _on_tick(self, now):
        self.render(now)

    def _on_settings(self, component_id, changed):
        if component_id == FEATURE_ID:
            self._hide()
            self.render(time.time())

    def _on_reset_layout(self):
        if self.reset_place(LAYOUT_KEYS):
            self._on_settings(FEATURE_ID, LAYOUT_KEYS)

    def _hide(self):
        self.text = None
        self.app.ui.hide(HANGAR_PANEL)

    def info(self, now):
        if self.settings.get('show_ping') and now - self.pinged_at >= PING_REQUEST_S:
            self.pinged_at = now
            request_ping()
        cluster, region = online() if self.settings.get('show_online') else (None, None)
        vehicle = selected_vehicle()
        crew_xp, crew_role = crew_next_skill(vehicle) if self.settings.get('show_crew') and vehicle is not None else (None, None)
        return {
            'server': server_name(),
            'ping': ping(),
            'online': cluster,
            'region_online': region,
            'vehicle': getattr(vehicle, 'shortUserName', None) or getattr(vehicle, 'userName', None),
            'tiers': battle_tiers(vehicle) if self.settings.get('show_tiers') and vehicle is not None else None,
            'crew_xp': crew_xp,
            'crew_role': crew_role,
            'accelerated': accelerated_training(vehicle) if self.settings.get('show_training') else None,
        }

    def ui_actions(self):
        if not self.enabled():
            return []
        return armor_actions(getattr(selected_vehicle(), 'name', None), self.app.translate)

    @safe
    def render(self, now):
        if not self.enabled_in_hangar():
            if self.text is not None:
                self._hide()
            return
        text = format_info(self.info(now), self.settings, self.app.translate, now)
        if text != self.text and self.app.ui.show(HANGAR_PANEL, text, layout_of(self.settings), self.save_place):
            self.text = text
