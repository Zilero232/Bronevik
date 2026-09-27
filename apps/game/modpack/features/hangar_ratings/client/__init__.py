from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle, vehicle_short_name
from ....core.codec import encode_json, parse_json_body, parse_retry_after
from ....core.errors import ReasonError
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import subscribe
from ....core.log import log, log_exception, safe
from ....core.net.signing import signed_request
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import (ACTION_REFRESH, OVERVIEW_KEY, OVERVIEW_PATH, TANKS_PATH, RatingsCache, is_auth_failure, layout_of, overview_request,
                     page_actions, panel_text, parse_overview, parse_tanks, retry_delay, tank_key, tanks_request)
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL


class HangarRatings(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.cache = RatingsCache(app.account_id)
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

    def _on_battle_event(self, event, now):
        self.cache.after_battle((event.get('vehicle') or {}).get('tank_id'), now)

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
        credentials = self.app.current_credentials()
        try:
            if (settings.get('show_account') or settings.get('show_session')) and self.cache.wants(OVERVIEW_KEY, now):
                self._post(OVERVIEW_PATH, overview_request(credentials), [OVERVIEW_KEY], self._store_overview)
            tank_id = self.selected
            if settings.get('show_tank') and tank_id and self.cache.wants(tank_key(tank_id), now):
                self._post(TANKS_PATH, tanks_request(credentials, [tank_id]), [tank_key(tank_id)], self._store_tanks([tank_id]))
        except ReasonError as error:
            log('hangar ratings not requested: %s' % error.reason)

    def _store_overview(self, data, account_id):
        self.cache.store_overview(parse_overview(data, account_id))

    def _store_tanks(self, tank_ids):
        def store(data, account_id):
            self.cache.store_tanks(tank_ids, parse_tanks(data, account_id))
        return store

    def _post(self, path, payload, keys, store):
        app = self.app
        credentials = app.current_credentials()
        account_id = self.cache.account_id
        self.cache.start(keys)

        @safe
        def done(status, body, headers):
            if account_id != self.cache.account_id:
                return
            if status == 200:
                store(parse_json_body(body), account_id)
            else:
                self.cache.fail(keys, time.time(), retry_delay(status, parse_retry_after(headers)))
                if is_auth_failure(status):
                    app.on_auth_failed()
            self.render()

        signed_request(app.transport, 'POST', app.config.endpoint(path), credentials.device_id, credentials.secret, encode_json(payload),
                       app.user_agent(), done)

    @safe
    def render(self):
        app = self.app
        if not self.active():
            return
        tank = self.cache.tank(self.selected) if self.selected else None
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
        self.update(time.time())
        return {'kind': 'info', 'text': translate('hangar_ratings_refreshing')}
