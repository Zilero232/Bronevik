from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle.damage import DamageTracker
from ....core.client.game import player_tank_id, vehicle_short_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.me import can_read, signed_body, signed_read
from ....core.client.sound import play_mp3
from ....core.hud import HangarLabel
from ....core.log import safe
from ....core.me import REFRESH_AFTER_BATTLE_S, ReadState
from ..i18n import STRINGS
from ..model import Announced, format_battle, format_done, format_hangar, page_actions, parse_goals
from ..model.constants import ACTION_REFRESH, GOALS_KEY, GOALS_PATH, HANGAR_LAYOUT, HANGAR_PANEL, PREVIEW_SIZE, SOUND, STATE_KEY
from ..model.preview import preview_text, preview_widget
from ..model.widget import battle_widget, hangar_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


class SessionGoals(BattlePanel):
    """The goals from the site: a hangar label with their progress, the battle line of the goals this battle can
    move, and a notice with our sound when the site reports a goal met."""

    def __init__(self, app):
        self.reads = ReadState()
        self.goals = []
        self.account_id = app.account_id
        self.hangar = HangarLabel(app, HANGAR_PANEL)
        self.tank_id = None
        self.damage = DamageTracker(self.render)
        self.announced = Announced(app.state.get(STATE_KEY))
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)
        app.register_state(STATE_KEY, self.announced.to_list)
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('rebind', self._on_rebind)
        bus.on('hangar', self._on_hangar)
        bus.on('tick', self.update)
        bus.on('battle_enter', self.hangar.hide)
        bus.on('battle_event', self._on_battle_event)

    def _on_account(self, account_id):
        self.account_id = account_id
        self.goals = []
        self.reads.reset()
        self.hangar.hide()

    def _on_rebind(self):
        self._on_account(self.app.account_id)

    def _on_hangar(self):
        self.update(time.time())

    def _on_battle_event(self, event, now):
        self.reads.stale([GOALS_KEY], now, REFRESH_AFTER_BATTLE_S)

    def settings_changed(self, changed):
        self.hangar.hide()
        self.update(time.time())

    def active(self):
        return self.enabled() and can_read(self.app)

    @safe
    def update(self, now):
        if not self.active():
            self.hangar.clear()
            return
        if self.reads.wants(GOALS_KEY, now):
            self.fetch()
        self.render_hangar()

    def fetch(self):
        signed_read(self.app, self.reads, GOALS_KEY, GOALS_PATH, lambda: signed_body(self.app), lambda: self.account_id, self._on_goals)

    def _on_goals(self, data, account_id):
        self.goals = parse_goals(data, account_id)
        self._announce(self.announced.newly_done(self.goals))
        self.render_hangar()

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
        translate = self.app.translate
        self.hangar.show(format_hangar(self.goals, self.settings, translate, names), HANGAR_LAYOUT,
                         widget=hangar_widget(self.goals, self.settings, translate, names))

    def start(self, player):
        if not self.settings.get('show_battle') or not self.goals:
            return
        self.tank_id = player_tank_id(player)
        self.damage.start(self.hooks)
        self.render()

    def stop(self):
        self.damage.stop()

    @safe
    def render(self):
        damage = self.damage.damage
        if damage is not None:
            text = format_battle(self.goals, self.tank_id, damage, self.settings, self.app.translate)
            if text:
                self.show(text, battle_widget(self.goals, self.tank_id, damage, self.settings, self.app.translate))
            else:
                self.hide()

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() else []

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_REFRESH:
            return None
        if not self.app.is_bound():
            return self.notice_error('goals_unbound')
        self.reads.refresh_all()
        self.update(time.time())
        return self.notice_info('goals_refreshing')
