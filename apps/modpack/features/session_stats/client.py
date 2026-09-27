"""Hangar session panel: battles, win rate, average damage and WN8 of the current session (switch
`hangar_session_panel`); also stamps `session_id` on each battle_result event."""
from __future__ import absolute_import

import time

from ...core.log import safe
from .i18n import STRINGS
from .model import SessionAggregator, format_session_panel, format_session_plain

HANGAR_PANEL = 'otmetki.session'
LAYOUT = {'x': -20, 'y': 140, 'alignX': 'right', 'alignY': 'top'}
STATE_KEY = 'session'


class SessionStats(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.session = SessionAggregator(idle_seconds=app.config.get('session_idle_minutes') * 60)
        self.session.load(app.state.get(STATE_KEY))
        app.register_state(STATE_KEY, self.session.to_dict)
        bus = app.bus
        bus.on('hangar', self._on_hangar)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('battle_event', self._on_battle_event)
        bus.on('battle_recorded', self._on_battle_recorded)
        bus.on('ingest_response', self._on_ingest_response)

    def _on_hangar(self):
        self.show(False)

    def _on_battle_enter(self):
        self.app.ui.hide(HANGAR_PANEL)

    def _on_battle_event(self, event, now):
        event['session_id'] = self.session.add(event, now)

    def _on_battle_recorded(self):
        self.show(True)

    @safe
    def _on_ingest_response(self, data):
        summary = data.get('session')
        if isinstance(summary, dict) and self.session.set_server_summary(summary.get('session_id'), summary):
            self.app.save_state()
            self.show(False)

    def show(self, after_battle):
        app = self.app
        if app.in_battle or not app.config.is_enabled('hangar_session_panel'):
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
