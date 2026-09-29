from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle, vehicle_class_tag, vehicle_short_name
from ....core.hooks import subscribe
from ....core.log import log_exception
from ....core.storage import JsonFile
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_CLEAR, HISTORY_FILE, MarksHistory, build_page, page_actions, panel_text
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL, LAYOUT


class MarksHistoryFeature(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.history = None
        self.selected = None
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('vehicle_moe', self._on_vehicle_moe)
        bus.on('battle_event', self._on_battle_event)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('hangar', self._on_hangar)
        if app.account_id:
            self._on_account(app.account_id)
        try:
            from CurrentVehicle import g_currentVehicle
            subscribe(g_currentVehicle, 'onChanged', self._on_vehicle_changed)
        except Exception:
            log_exception('marks history: current vehicle')

    def _on_account(self, account_id):
        path = os.path.join(self.app.config_dir, HISTORY_FILE % account_id)
        self.history = MarksHistory(JsonFile(path), self.settings.get('max_entries'))

    def _on_battle_event(self, event, now):
        if self.history is None or not self.enabled():
            return
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        if self.history.record_battle(event, vehicle_short_name(tank_id), vehicle_class_tag(tank_id)) is not None:
            self.history.save()

    def _on_vehicle_moe(self, snapshot):
        if self.history is None or not self.enabled():
            return
        self.selected = snapshot.get('tank_id')
        if self.history.record_snapshot(snapshot, time.time(), vehicle_short_name(self.selected), vehicle_class_tag(self.selected)) is not None:
            self.history.save()
        self.show()

    def _on_vehicle_changed(self):
        self.selected = getattr(selected_vehicle(), 'intCD', None)
        self.show()

    def _on_hangar(self):
        self.show()

    def _on_battle_enter(self):
        self.app.ui.hide(HANGAR_PANEL)

    def show(self):
        app = self.app
        if app.in_battle:
            return
        summary = self.history.summary(self.selected, self.settings.get('trend_battles')) if self.history and self.selected else None
        if not self.enabled() or not self.settings.get('show_panel') or summary is None:
            app.ui.hide(HANGAR_PANEL)
            return
        app.ui.show(HANGAR_PANEL, panel_text(summary, app.translate), LAYOUT)

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() and self.history is not None else []

    def ui_page(self):
        if not self.enabled() or self.history is None:
            return None
        return build_page(self.history, self.app.translate, self.settings.get('trend_battles'), self.settings.get('page_rows'))

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR or self.history is None or not row:
            return None
        if self.history.clear(row):
            self.history.save()
            self.show()
        return {'kind': 'info', 'text': self.app.translate('marks_history_cleared')}
