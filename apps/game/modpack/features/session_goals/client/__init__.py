from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle.damage import DamageTracker
from ....core.client.game import player_tank_id, vehicle_short_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.me import SignedRead, can_read, signed_body, signed_read
from ....core.client.sound import play_mp3
from ....core.hud import HangarLabel
from ....core.log import safe
from ....core.me import REFRESH_AFTER_BATTLE_S, ReadState
from ..i18n import STRINGS
from ..model import Announced, format_battle, format_done, format_hangar, page_actions, parse_goals
from ..model.constants import (
    GOALS_KEY,
    GOALS_PATH,
    HANGAR_LAYOUT,
    HANGAR_PANEL,
    PREVIEW_SIZE,
    SOUND,
    STATE_KEY,
)
from ..model.preview import preview_text, preview_widget
from ..model.widget import battle_widget, hangar_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


class SessionGoals(BattlePanel):

    def __init__(self, app):
        self.reads = ReadState()
        self.goals = []
        self.account_id = app.account_id
        self.hangar = HangarLabel(app, HANGAR_PANEL)
        self.tank_id = None
        self.damage = DamageTracker(self.render)
        self.announced = Announced(app.state.get(STATE_KEY))
        BattlePanel.__init__(self, app, PANEL_SPEC)
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
        app = self.app
        read = SignedRead(
            reads=self.reads,
            key=GOALS_KEY,
            path=GOALS_PATH,
            build=lambda: signed_body(app),
            account_of=lambda: self.account_id,
        )
        signed_read(app, read, self._on_goals)

    def _on_goals(self, data, account_id):
        self.goals = parse_goals(data, account_id)
        self._announce(self.announced.newly_done(self.goals))
        self.render_hangar()

    def _announce(self, goals):
        if not goals:
            return
        app = self.app
        app.save_state()
        for goal in goals:
            vehicle_name = vehicle_short_name(goal.get('tank_id'))
            app.ui.notify(format_done(goal, app.translate, vehicle_name))
        if self.settings.get('sound'):
            play_mp3(SOUND)

    def render_hangar(self):
        if not self.settings.get('show_hangar') or not self.active():
            return
        tank_ids = [goal['tank_id'] for goal in self.goals if goal.get('tank_id')]
        names = dict((tank_id, vehicle_short_name(tank_id)) for tank_id in tank_ids)
        translate = self.app.translate

        text = format_hangar(self.goals, self.settings, translate, names)
        widget = hangar_widget(self.goals, self.settings, translate, names)
        self.hangar.show(text, HANGAR_LAYOUT, widget=widget)

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
        if damage is None:
            return
        translate = self.app.translate
        text = format_battle(self.goals, self.tank_id, damage, self.settings, translate)
        if not text:
            self.hide()
            return
        self.show(text, battle_widget(self.goals, self.tank_id, damage, self.settings, translate))

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() else []

    def ui_action(self, action, row=None, value=None):
        return self.refresh_action(action, 'goals_unbound', 'goals_refreshing', self._refresh)

    def _refresh(self):
        self.reads.refresh_all()
        self.update(time.time())
