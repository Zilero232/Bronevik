# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import SHOT_METHOD, BattleHooks, call, feedback, on_own_shot, vehicle_class, vehicle_name
from ....core.client.component import FeatureComponent
from ....core.client.game import values_by_name
from ....core.hud import HangarLabel
from ....core.log import log, safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_CLEAR, BOOK_FILE, HitBook, build_page, hangar_widget, panel_text
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL, KIND_BY_EVENT, LAYOUT


# Fair play: only the shots the client draws on the player's own tank (Vehicle.showDamageFromShot on the own vehicle)
# and the damage the own feedback reported.
class BattleHitsFeature(FeatureComponent):
    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.book = None
        self.label = HangarLabel(app, HANGAR_PANEL)
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.hooks = BattleHooks()
        bus = app.bus
        bus.on('battle_ready', self._on_battle_ready)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('battle_leave', self._on_battle_leave)
        bus.on('hangar', self.show)
        self.follow_account(self._on_account)
        self._hook_shots()

    def _hook_shots(self):
        if not on_own_shot(self.on_own_shot):
            log('battle hits: Vehicle.%s not hooked, nothing is recorded' % SHOT_METHOD)

    def _on_account(self, account_id):
        self.book = HitBook(self.account_file(BOOK_FILE, account_id), self.settings.get('keep_battles'))

    def settings_changed(self, changed):
        if self.book is not None and 'keep_battles' in changed:
            self.book.resize(self.settings.get('keep_battles'))
            self.book.save()
        self.show()

    def _on_battle_ready(self, player):
        if self.book is None or not self.enabled():
            return
        battle_id = getattr(player, 'arenaUniqueID', None) or int(time.time())
        own_vehicle = vehicle_name(getattr(player, 'playerVehicleID', None))
        self.book.start(battle_id, own_vehicle, time.time())
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)

    def _on_battle_enter(self):
        self.label.hide()

    def _on_battle_leave(self):
        self.hooks.clear()
        if self.book is not None and self.book.finish() is not None:
            self.book.save()

    @safe
    def on_own_shot(self, attacker_id, points):
        if self.book is None or self.book.current is None:
            return
        self.book.hit(points, vehicle_name(attacker_id), vehicle_class(attacker_id), time.time())

    def _on_feedback(self, events):
        if self.book is None or self.book.current is None:
            return
        now = time.time()

        for event in events:
            if self.kinds.get(event.getBattleEventType()) != 'received':
                continue
            extra = event.getExtra()
            if call(extra, 'isShot', True):
                attacker = vehicle_name(event.getTargetID())
                self.book.damage(attacker, call(extra, 'getDamage', 0), now)

    def _is_panel_wanted(self):
        return not self.app.in_battle and self.enabled() and self.settings.get('show_panel')

    @safe
    def show(self):
        latest = self.book.latest() if self.book is not None else None
        if latest is None or not self._is_panel_wanted():
            self.label.clear()
            return

        translate = self.app.translate
        self.label.show(panel_text(latest, translate), LAYOUT, widget=hangar_widget(latest, translate))

    def ui_page(self):
        if not self.enabled() or self.book is None:
            return None
        return build_page(self.book, self.app.translate, self.settings.get('show_attacker'))

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR or self.book is None or not row:
            return None
        if self.book.clear(row):
            self.book.save()
            self.show()
        return self.notice_info('battle_hits_cleared')
