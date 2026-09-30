from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import on_vehicle_changed, selected_tank_id, vehicle_class_tag, vehicle_short_name
from ....core.hud import HangarLabel
from ..i18n import STRINGS
from ..model import ACTION_CLEAR, HISTORY_FILE, MarksHistory, build_page, hangar_widget, page_actions, panel_text
from ..settings import SCHEMA, SECTION, SWITCH
from .constants import HANGAR_PANEL, LAYOUT


class MarksHistoryFeature(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.history = None
        self.selected = None
        self.label = HangarLabel(app, HANGAR_PANEL)
        bus = app.bus
        bus.on('vehicle_moe', self._on_vehicle_moe)
        bus.on('battle_event', self._on_battle_event)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('hangar', self._on_hangar)
        self.follow_account(self._on_account)
        on_vehicle_changed(self._on_vehicle_changed, 'marks history')

    def _on_account(self, account_id):
        self.history = MarksHistory(self.account_file(HISTORY_FILE, account_id), self.settings.get('max_entries'))

    def _on_battle_event(self, event, now):
        if self.history is None or not self.enabled():
            return
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        entry = self.history.record_battle(event, vehicle_short_name(tank_id), vehicle_class_tag(tank_id))
        if entry is not None:
            self.history.save()

    def _on_vehicle_moe(self, snapshot):
        if self.history is None or not self.enabled():
            return
        self.selected = snapshot.get('tank_id')
        label = vehicle_short_name(self.selected)
        entry = self.history.record_snapshot(snapshot, time.time(), label, vehicle_class_tag(self.selected))
        if entry is not None:
            self.history.save()
        self.show()

    def _on_vehicle_changed(self):
        self.selected = selected_tank_id()
        self.show()

    def _on_hangar(self):
        self.show()

    def _on_battle_enter(self):
        self.label.hide()

    def _summary(self):
        if not self.history or not self.selected:
            return None
        return self.history.summary(self.selected, self.settings.get('trend_battles'))

    def show(self):
        app = self.app
        if app.in_battle:
            return
        summary = self._summary()
        if not self.enabled() or not self.settings.get('show_panel') or summary is None:
            self.label.clear()
            return
        self.label.show(panel_text(summary, app.translate), LAYOUT, widget=hangar_widget(summary, app.translate))

    def _has_history(self):
        return self.enabled() and self.history is not None

    def ui_actions(self):
        if not self._has_history():
            return []
        return page_actions(self.app.translate)

    def ui_page(self):
        if not self._has_history():
            return None
        settings = self.settings
        return build_page(self.history, self.app.translate, settings.get('trend_battles'), settings.get('page_rows'))

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR or self.history is None or not row:
            return None
        if self.history.clear(row):
            self.history.save()
            self.show()
        return self.notice_info('marks_history_cleared')
