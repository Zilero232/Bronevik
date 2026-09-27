from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import format_info, layout_of
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL, PING_REQUEST_S
from .reads import online, ping, request_ping, server_name


class HangarInfo(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.text = None
        self.pinged_at = 0.0
        app.bus.on('hangar', self._on_hangar)
        app.bus.on('tick', self._on_tick)
        app.bus.on('battle_enter', self._hide)
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _on_hangar(self):
        self.render(time.time())

    def _on_tick(self, now):
        self.render(now)

    def _on_settings(self, component_id, changed):
        if component_id == FEATURE_ID:
            self._hide()
            self.render(time.time())

    def _hide(self):
        self.text = None
        self.app.ui.hide(HANGAR_PANEL)

    def info(self, now):
        if self.settings.get('show_ping') and now - self.pinged_at >= PING_REQUEST_S:
            self.pinged_at = now
            request_ping()
        cluster, region = online() if self.settings.get('show_online') else (None, None)
        return {'server': server_name(), 'ping': ping(), 'online': cluster, 'region_online': region}

    @safe
    def render(self, now):
        if not self.enabled_in_hangar():
            if self.text is not None:
                self._hide()
            return
        text = format_info(self.info(now), self.settings, self.app.translate, now)
        if text != self.text and self.app.ui.show(HANGAR_PANEL, text, layout_of(self.settings)):
            self.text = text
