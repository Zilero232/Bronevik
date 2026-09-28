from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, is_enemy
from ....core.client.game import player_tank_id, vehicle_short_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.me import can_read, post_signed, signed_body
from ....core.client.sound import play_mp3
from ....core.errors import ReasonError
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.log import log, safe
from ....core.me import OK_STATUS, REFRESH_AFTER_BATTLE_S, ReadState, retry_delay
from ..i18n import STRINGS
from ..model import Announced, format_battle, format_done, format_hangar, page_actions, parse_goals
from ..model.constants import ACTION_REFRESH, GOALS_KEY, GOALS_PATH, HANGAR_LAYOUT, HANGAR_PANEL, PREVIEW_SIZE, SOUND, STATE_KEY
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


class SessionGoals(BattlePanel):
    """The goals from the site: a hangar label with their progress, the battle line of the goals this battle can
    move, and a notice with our sound when the site reports a goal met."""

    def __init__(self, app):
        self.reads = ReadState()
        self.goals = []
        self.account_id = app.account_id
        self.hangar_text = None
        self.tank_id = None
        self.damage = None
        self.announced = Announced(app.state.get(STATE_KEY))
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)
        app.register_state(STATE_KEY, self.announced.to_list)
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('rebind', self._on_rebind)
        bus.on('hangar', self._on_hangar)
        bus.on('tick', self.update)
        bus.on('battle_enter', self._hide_hangar)
        bus.on('battle_event', self._on_battle_event)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _on_account(self, account_id):
        self.account_id = account_id
        self.goals = []
        self.reads.reset()
        self._hide_hangar()

    def _on_rebind(self):
        self._on_account(self.app.account_id)

    def _on_hangar(self):
        self.update(time.time())

    def _on_battle_event(self, event, now):
        self.reads.stale([GOALS_KEY], now, REFRESH_AFTER_BATTLE_S)

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
            self._hide_hangar()
            self.update(time.time())

    def _hide_hangar(self):
        self.hangar_text = None
        self.app.ui.hide(HANGAR_PANEL)

    def active(self):
        return self.enabled() and can_read(self.app)

    @safe
    def update(self, now):
        if not self.active():
            if self.hangar_text is not None:
                self._hide_hangar()
            return
        if self.reads.wants(GOALS_KEY, now):
            self.fetch()
        self.render_hangar()

    def fetch(self):
        try:
            payload = signed_body(self.app)
        except ReasonError as error:
            log('session goals not requested: %s' % error.reason)
            return
        account_id = self.account_id
        self.reads.start([GOALS_KEY])

        def done(status, data, retry_after):
            if account_id != self.account_id:
                return
            if status != OK_STATUS:
                self.reads.fail([GOALS_KEY], time.time(), retry_delay(status, retry_after))
                return
            self.reads.done([GOALS_KEY])
            self.goals = parse_goals(data, account_id)
            self._announce(self.announced.newly_done(self.goals))
            self.render_hangar()

        post_signed(self.app, GOALS_PATH, payload, done)

    def _announce(self, goals):
        if not goals:
            return
        self.app.save_state()
        for goal in goals:
            self.app.ui.notify(format_done(goal, self.app.translate, vehicle_short_name(goal.get('tank_id'))))
        if self.settings.get('sound'):
            play_mp3(SOUND)

    def render_hangar(self):
        if not self.settings.get('show_hangar') or not self.active():
            return
        names = dict((goal['tank_id'], vehicle_short_name(goal['tank_id'])) for goal in self.goals if goal.get('tank_id'))
        text = format_hangar(self.goals, self.settings, self.app.translate, names)
        if text is None:
            if self.hangar_text is not None:
                self._hide_hangar()
            return
        if text != self.hangar_text and self.app.ui.show(HANGAR_PANEL, text, HANGAR_LAYOUT):
            self.hangar_text = text

    def start(self, player):
        if not self.settings.get('show_battle') or not self.goals:
            return
        self.tank_id = player_tank_id(player)
        self.damage = 0
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.render()

    def stop(self):
        self.damage = None

    # onPlayerFeedbackReceived carries only the player's own events (feedback_adaptor, RU 1.45).
    def _on_feedback(self, events):
        if self.damage is None:
            return
        added = 0
        for event in events:
            if event.getBattleEventType() == getattr(BATTLE_EVENT_TYPE, 'DAMAGE', None) and is_enemy(event.getTargetID()):
                added += call(event.getExtra(), 'getDamage', 0) or 0
        if added:
            self.damage += added
            self.render()

    def _on_summary(self, event):
        total = call(event, 'getTotalDamage')
        if self.damage is not None and total and total > self.damage:
            self.damage = total
            self.render()

    @safe
    def render(self):
        if self.damage is None:
            return
        text = format_battle(self.goals, self.tank_id, self.damage, self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() else []

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_REFRESH:
            return None
        translate = self.app.translate
        if not self.app.is_bound():
            return {'kind': 'error', 'text': translate('goals_unbound')}
        self.reads.refresh_all()
        self.update(time.time())
        return {'kind': 'info', 'text': translate('goals_refreshing')}
