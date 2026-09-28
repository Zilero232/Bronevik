from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.me import can_read, post_signed
from ....core.errors import ReasonError
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.log import log
from ....core.me import OK_STATUS
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import SessionAggregator, format_session_panel, format_session_plain
from ..model.constants import ACTION_SHARE, SHARE_PATH, SHARE_RETRY_S, SHARE_SEND_PATH, SHARE_STATE_KEY
from ..model.share import preference_body, preference_of, send_body, send_failure_key
from ..settings import IDLE_MINUTES, SHARE, SHARE_CHANNEL, SWITCH
from .constants import HANGAR_PANEL, LAYOUT, STATE_KEY

SENT_STATUSES = (OK_STATUS, 202)


class SessionStats(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.session = SessionAggregator(idle_seconds=app.config.get(IDLE_MINUTES) * 60)
        self.session.load(app.state.get(STATE_KEY))
        app.register_state(STATE_KEY, self.session.to_dict)
        synced = app.state.get(SHARE_STATE_KEY)
        self.share_synced = tuple(synced) if isinstance(synced, list) and len(synced) == 2 else None
        self.share_sending = False
        self.share_retry_at = 0.0
        app.register_state(SHARE_STATE_KEY, lambda: list(self.share_synced) if self.share_synced else None)
        bus = app.bus
        bus.on('hangar', self._on_hangar)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('battle_event', self._on_battle_event)
        bus.on('battle_recorded', self._on_battle_recorded)
        bus.on('ingest_response', self._on_ingest_response)
        bus.on('rebind', self._on_rebind)
        bus.on('tick', self._on_tick)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _on_hangar(self):
        self.show(False)
        self.sync_share(time.time())

    def _on_battle_enter(self):
        self.app.ui.hide(HANGAR_PANEL)

    def _on_battle_event(self, event, now):
        event['session_id'] = self.session.add(event, now)

    def _on_battle_recorded(self):
        self.show(True)

    def _on_ingest_response(self, data):
        summary = data.get('session')
        if isinstance(summary, dict) and self.session.set_server_summary(summary.get('session_id'), summary):
            self.app.save_state()
            self.show(False)

    def _on_rebind(self):
        self.share_synced = None

    def _on_tick(self, now):
        if now >= self.share_retry_at:
            self.sync_share(now)

    def _on_settings(self, component_id, changed):
        if component_id == FEATURE_ID and (SHARE in changed or SHARE_CHANNEL in changed):
            self.share_retry_at = 0.0
            self.sync_share(time.time())

    def show(self, after_battle):
        app = self.app
        if app.in_battle or not app.config.is_enabled(SWITCH):
            return
        if self.session.is_expired(time.time()):
            app.ui.hide(HANGAR_PANEL)
            return
        summary = self.session.summary()
        if not summary['battles']:
            return
        if app.ui.has_panels:
            app.ui.show(HANGAR_PANEL, format_session_panel(summary, app.translate), LAYOUT)
        elif after_battle:
            app.ui.notify(format_session_plain(summary, app.translate))

    # A never-synced "off" is the server's default: nothing is posted before the player turned sharing on once.
    def sync_share(self, now):
        wanted = preference_of(self.app.config)
        if self.share_sending or wanted == self.share_synced or not can_read(self.app):
            return
        if self.share_synced is None and not wanted[0]:
            return
        try:
            payload = preference_body(self.app.current_credentials(), wanted[0], wanted[1])
        except ReasonError as error:
            log('session share not synced: %s' % error.reason)
            return
        self.share_sending = True

        def done(status, data, retry_after):
            self.share_sending = False
            if status == OK_STATUS:
                self.share_synced = wanted
                self.app.save_state()
            else:
                self.share_retry_at = time.time() + SHARE_RETRY_S

        post_signed(self.app, SHARE_PATH, payload, done)

    def ui_actions(self):
        if not self.app.config.get(SHARE):
            return []
        translate = self.app.translate
        return [{'id': ACTION_SHARE, 'label': translate('session_share_now'), 'confirm': translate('session_share_confirm')}]

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_SHARE:
            return None
        app = self.app
        translate = app.translate
        if not app.config.get(SHARE):
            return {'kind': 'error', 'text': translate('session_share_off')}
        if not app.is_bound():
            return {'kind': 'error', 'text': translate('session_share_unbound')}
        if self.session.is_expired(time.time()) or not self.session.summary()['battles']:
            return {'kind': 'error', 'text': translate('session_share_empty')}
        payload = send_body(app.current_credentials(), self.session.session_id, app.config.get(SHARE_CHANNEL))

        def done(status, data, retry_after):
            if status not in SENT_STATUSES:
                app.ui.notify(translate(send_failure_key(status), status=status))

        post_signed(app, SHARE_SEND_PATH, payload, done)
        return {'kind': 'info', 'text': translate('session_share_sent')}
