from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.me import can_read, post_signed
from ....core.errors import ReasonError
from ....core.hud import HangarLabel
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.log import log
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import SessionAggregator, format_session_panel, format_session_plain, session_widget
from ..model.constants import (
    ACTION_RESET,
    ACTION_SHARE,
    SHARE_PATH,
    SHARE_REFUSED,
    SHARE_REFUSED_NOTICE,
    SHARE_RETRY_S,
    SHARE_SEND_PATH,
    SHARE_STATE_KEY,
    SHARE_SYNCED,
)
from ..model.share import (
    preference_body,
    preference_of,
    preference_outcome,
    restore_synced,
    send_body,
    send_failure_key,
)
from ..settings import IDLE_MINUTES, SHARE, SHARE_CHANNEL, SWITCH
from .constants import HANGAR_PANEL, LAYOUT, SENT_STATUSES, STATE_KEY


class SessionStats(object):

    def __init__(self, app):
        self.app = app
        self.label = HangarLabel(app, HANGAR_PANEL)
        app.translate.catalog.add(STRINGS)

        self.session = SessionAggregator(idle_seconds=app.config.get(IDLE_MINUTES) * 60)
        self.session.load(app.state.get(STATE_KEY))
        app.register_state(STATE_KEY, self.session.to_dict)

        self.share_synced = restore_synced(app.state.get(SHARE_STATE_KEY))
        self.share_sending = False
        self.share_retry_at = 0.0
        self.share_refused = None
        app.register_state(SHARE_STATE_KEY, self._stored_share)

        bus = app.bus
        bus.on('hangar', self._on_hangar)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('battle_ready', self._on_battle_ready)
        bus.on('battle_results', self._on_battle_results)
        bus.on('battle_event', self._on_battle_event)
        bus.on('battle_recorded', self._on_battle_recorded)
        bus.on('ingest_response', self._on_ingest_response)
        bus.on('rebind', self._on_rebind)
        bus.on('tick', self._on_tick)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _stored_share(self):
        if not self.share_synced:
            return None
        return list(self.share_synced)

    def _on_hangar(self):
        self.show(False)
        self.sync_share(time.time())

    def _on_battle_enter(self):
        self.label.hide()

    # RU 1.45 client source: Avatar.py builds ClientArena from the avatar's own arenaUniqueID and arenaBonusType.
    def _on_battle_ready(self, player):
        arena_id = getattr(player, 'arenaUniqueID', None)
        bonus_type = getattr(player, 'arenaBonusType', None)

        self.session.started(arena_id, bonus_type, time.time())

    def _on_battle_results(self, arena_id, results):
        self.session.results_arrived(arena_id)

    def _on_battle_event(self, event, now):
        event['session_id'] = self.session.add(event, now)

    def _on_battle_recorded(self):
        self.show(True)

    def _on_ingest_response(self, data):
        summary = data.get('session')
        if not isinstance(summary, dict):
            return
        if not self.session.set_server_summary(summary.get('session_id'), summary):
            return

        self.app.save_state()
        self.show(False)

    def _on_rebind(self):
        self.share_synced = None
        self.share_refused = None

    def _on_tick(self, now):
        if now >= self.share_retry_at:
            self.sync_share(now)

    def _on_settings(self, component_id, changed):
        if component_id != FEATURE_ID:
            return
        if SHARE not in changed and SHARE_CHANNEL not in changed:
            return

        self.share_retry_at = 0.0
        self.sync_share(time.time())

    def show(self, after_battle):
        app = self.app
        if app.in_battle:
            return
        if not app.config.is_enabled(SWITCH):
            return

        summary = self.current_summary()
        if summary is None:
            self.label.clear()
            return

        translate = app.translate
        if app.ui.has_panels:
            text = format_session_panel(summary, translate)
            self.label.show(text, LAYOUT, widget=session_widget(summary, translate))
        elif after_battle:
            app.ui.notify(format_session_plain(summary, translate))

    def current_summary(self):
        now = time.time()
        if self.session.is_expired(now):
            return None

        summary = self.session.summary(now)
        if summary['battles'] or summary['pending']:
            return summary

        return None

    def reset(self):
        self.session.reset(time.time())
        self.app.save_state()
        self.show(False)

        return {'kind': 'info', 'text': self.app.translate('session_reset_done')}

    def sync_share(self, now):
        wanted = preference_of(self.app.config)
        if not self._needs_sync(wanted):
            return

        is_enabled, channel = wanted
        try:
            payload = preference_body(self.app.current_credentials(), is_enabled, channel)
        except ReasonError as error:
            log('session share not synced: %s' % error.reason)
            return

        self.share_sending = True

        def done(status, data, retry_after):
            self._on_share_answer(wanted, status)

        post_signed(self.app, SHARE_PATH, payload, done)

    # A never-synced "off" is the server's default: nothing is posted before the player turned sharing on once.
    def _needs_sync(self, wanted):
        if self.share_sending:
            return False
        if wanted in (self.share_synced, self.share_refused):
            return False
        if not can_read(self.app):
            return False

        is_enabled = wanted[0]
        return is_enabled or self.share_synced is not None

    def _on_share_answer(self, wanted, status):
        self.share_sending = False

        outcome = preference_outcome(status)
        if outcome == SHARE_SYNCED:
            self.share_synced = wanted
            self.app.save_state()
        elif outcome == SHARE_REFUSED:
            self.share_refused = wanted
            self.app.ui.notify(self.app.translate(SHARE_REFUSED_NOTICE))
        else:
            self.share_retry_at = time.time() + SHARE_RETRY_S

    def ui_actions(self):
        translate = self.app.translate
        reset = {
            'id': ACTION_RESET,
            'label': translate('session_reset'),
            'confirm': translate('session_reset_confirm'),
        }
        if not self.app.config.get(SHARE):
            return [reset]

        share = {
            'id': ACTION_SHARE,
            'label': translate('session_share_now'),
            'confirm': translate('session_share_confirm'),
        }

        return [reset, share]

    def ui_action(self, action, row=None, value=None):
        if action == ACTION_RESET:
            return self.reset()
        if action == ACTION_SHARE:
            return self._share_now()
        return None

    def _share_refusal(self):
        if not self.app.config.get(SHARE):
            return 'session_share_off'
        if not self.app.is_bound():
            return 'session_share_unbound'

        now = time.time()
        if self.session.is_expired(now) or not self.session.summary(now)['battles']:
            return 'session_share_empty'
        return None

    def _share_now(self):
        app = self.app
        translate = app.translate
        refusal = self._share_refusal()
        if refusal:
            return {'kind': 'error', 'text': translate(refusal)}

        payload = send_body(app.current_credentials(), self.session.session_id, app.config.get(SHARE_CHANNEL))

        def done(status, data, retry_after):
            if status not in SENT_STATUSES:
                app.ui.notify(translate(send_failure_key(status), status=status))

        post_signed(app, SHARE_SEND_PATH, payload, done)
        return {'kind': 'info', 'text': translate('session_share_sent')}
