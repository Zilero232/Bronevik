from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle
from ....core.hud import EVENT_RESET_LAYOUT, HangarLabel
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import armor_actions, format_info, format_widget, layout_of
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL, LAYOUT_KEYS, PING_REQUEST_S
from .reads import accelerated_training, battle_tiers, crew_next_skill, online, ping, request_ping, server_name


class HangarInfo(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.label = HangarLabel(app, HANGAR_PANEL)
        self.pinged_at = 0.0
        app.bus.on('hangar', self._on_hangar)
        app.bus.on('tick', self._on_tick)
        app.bus.on('battle_enter', self.label.hide)
        app.bus.on(EVENT_RESET_LAYOUT, self._on_reset_layout)

    def _on_hangar(self):
        self.render(time.time())

    def _on_tick(self, now):
        self.render(now)

    def settings_changed(self, changed):
        self.label.hide()
        self.render(time.time())

    def _on_reset_layout(self):
        if self.reset_place(LAYOUT_KEYS):
            self.settings_changed(LAYOUT_KEYS)

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
            self.label.clear()
            return
        info = self.info(now)
        translate = self.app.translate
        self.label.show(format_info(info, self.settings, translate, now), layout_of(self.settings), self.save_place,
                        widget=format_widget(info, self.settings, translate, now))
