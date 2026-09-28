from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle, vehicle_short_name
from ....core.client.me import post_signed, tank_ratings
from ....core.errors import ReasonError
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import subscribe
from ....core.log import log, log_exception, safe
from ....core.me import OK_STATUS
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import (ACTION_REFRESH, OVERVIEW_KEY, OVERVIEW_PATH, RatingsCache, layout_of, overview_request, page_actions, panel_text, parse_overview,
                     retry_delay)
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL


class HangarRatings(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.cache = RatingsCache(app.account_id)
        self.tanks = tank_ratings(app)
        self.selected = None
        self.text = None
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('rebind', self._on_rebind)
        bus.on('hangar', self._on_hangar)
        bus.on('tick', self._on_tick)
        bus.on('battle_enter', self._hide)
        bus.on('battle_event', self._on_battle_event)
        bus.on('ingest_response', self._on_ingest_response)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)
        self.tanks.listen(self._on_tank)
        try:
            from CurrentVehicle import g_currentVehicle
            subscribe(g_currentVehicle, 'onChanged', self._on_vehicle_changed)
        except Exception:
            log_exception('hangar ratings: current vehicle')

    def active(self):
        app = self.app
        return self.enabled_in_hangar() and app.is_bound() and not app.auth_failed

    def _on_account(self, account_id):
        self.cache.reset(account_id)
        self._hide()

    def _on_rebind(self):
        self.cache.reset(self.app.account_id)
        self._hide()

    def _on_hangar(self):
        self.selected = getattr(selected_vehicle(), 'intCD', None)
        self.update(time.time())

    def _on_vehicle_changed(self):
        self.selected = getattr(selected_vehicle(), 'intCD', None)
        self.update(time.time())

    def _on_tick(self, now):
        self.update(now)

    def _on_tank(self, tank_id):
        if tank_id == self.selected:
            self.render()

    def _on_battle_event(self, event, now):
        self.cache.after_battle(now)

    def _on_ingest_response(self, data):
        self.cache.expedite(OVERVIEW_KEY)

    def _on_settings(self, component_id, changed):
        if component_id == FEATURE_ID:
            self._hide()
            self.update(time.time())

    def _hide(self):
        self.text = None
        self.app.ui.hide(HANGAR_PANEL)

    @safe
    def update(self, now):
        if not self.active():
            if self.text is not None:
                self._hide()
            return
        self.fetch(now)
        self.render()

    def fetch(self, now):
        settings = self.settings
        if settings.get('show_tank') and self.selected:
            self.tanks.ensure(self.selected, now)
        if not (settings.get('show_account') or settings.get('show_session')) or not self.cache.wants(OVERVIEW_KEY, now):
            return
        try:
            payload = overview_request(self.app.current_credentials())
        except ReasonError as error:
            log('hangar ratings not requested: %s' % error.reason)
            return
        account_id = self.cache.account_id
        self.cache.start([OVERVIEW_KEY])

        def done(status, data, retry_after):
            if account_id != self.cache.account_id:
                return
            if status == OK_STATUS:
                self.cache.store_overview(parse_overview(data, account_id))
            else:
                self.cache.fail([OVERVIEW_KEY], time.time(), retry_delay(status, retry_after))
            self.render()

        post_signed(self.app, OVERVIEW_PATH, payload, done)

    @safe
    def render(self):
        app = self.app
        if not self.active():
            return
        tank = self.tanks.row(self.selected) if self.selected else None
        label = vehicle_short_name(self.selected) if tank is not None else None
        text = panel_text(self.cache.overview, tank, label, self.settings, app.translate)
        if text is None:
            if self.text is not None:
                self._hide()
            return
        if text != self.text and app.ui.show(HANGAR_PANEL, text, layout_of(self.settings)):
            self.text = text

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() else []

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_REFRESH:
            return None
        translate = self.app.translate
        if not self.app.is_bound():
            return {'kind': 'error', 'text': translate('hangar_ratings_unbound')}
        self.cache.refresh_all()
        self.tanks.reads.refresh_all()
        self.update(time.time())
        return {'kind': 'info', 'text': translate('hangar_ratings_refreshing')}
