from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import on_vehicle_changed, selected_tank_id, vehicle_short_name
from ....core.client.me import SignedRead, signed_body, signed_read, tank_ratings
from ....core.hud import HangarLabel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import (
    OVERVIEW_KEY,
    OVERVIEW_PATH,
    RatingsCache,
    layout_of,
    page_actions,
    panel_text,
    parse_overview,
    ratings_widget,
)
from ..settings import SCHEMA, SECTION, SWITCH
from .constants import HANGAR_PANEL


class HangarRatings(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.cache = RatingsCache(app.account_id)
        self.tanks = tank_ratings(app)
        self.selected = None
        self.label = HangarLabel(app, HANGAR_PANEL)
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('rebind', self._on_rebind)
        bus.on('hangar', self._on_selection)
        bus.on('tick', self.update)
        bus.on('battle_enter', self.label.hide)
        bus.on('battle_event', self._on_battle_event)
        bus.on('ingest_response', self._on_ingest_response)
        self.tanks.listen(self._on_tank)
        on_vehicle_changed(self._on_selection, 'hangar ratings')

    def active(self):
        app = self.app
        return self.enabled_in_hangar() and app.is_bound() and not app.auth_failed

    def _on_account(self, account_id):
        self.cache.reset(account_id)
        self.label.hide()

    def _on_rebind(self):
        self._on_account(self.app.account_id)

    def _on_selection(self):
        self.selected = selected_tank_id()
        self.update(time.time())

    def _on_tank(self, tank_id):
        if tank_id == self.selected:
            self.render()

    def _on_battle_event(self, event, now):
        self.cache.after_battle(now)

    def _on_ingest_response(self, data):
        self.cache.expedite(OVERVIEW_KEY)

    def settings_changed(self, changed):
        self.label.hide()
        self.update(time.time())

    @safe
    def update(self, now):
        if not self.active():
            self.label.clear()
            return
        self.fetch(now)
        self.render()

    def fetch(self, now):
        if self.settings.get('show_tank') and self.selected:
            self.tanks.ensure(self.selected, now)
        if self._wants_overview(now):
            self._read_overview()

    def _wants_overview(self, now):
        shows_overview = self.settings.get('show_account') or self.settings.get('show_session')
        return bool(shows_overview) and self.cache.wants(OVERVIEW_KEY, now)

    def _read_overview(self):
        app = self.app
        read = SignedRead(
            reads=self.cache,
            key=OVERVIEW_KEY,
            path=OVERVIEW_PATH,
            build=lambda: signed_body(app),
            account_of=lambda: self.cache.account_id,
        )
        signed_read(app, read, self._on_overview, self.render)

    def _on_overview(self, data, account_id):
        self.cache.store_overview(parse_overview(data, account_id))

    @safe
    def render(self):
        if not self.active():
            return
        tank = self.tanks.row(self.selected) if self.selected else None
        label = vehicle_short_name(self.selected) if tank is not None else None
        overview = self.cache.overview
        translate = self.app.translate

        text = panel_text(overview, tank, label, self.settings, translate)
        widget = ratings_widget(overview, tank, label, self.settings, translate)
        self.label.show(text, layout_of(self.settings), self.save_place, widget=widget)

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() else []

    def ui_action(self, action, row=None, value=None):
        return self.refresh_action(action, 'hangar_ratings_unbound', 'hangar_ratings_refreshing', self._refresh)

    def _refresh(self):
        self.cache.refresh_all()
        self.tanks.reads.refresh_all()
        self.update(time.time())
