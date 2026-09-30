# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import functools
import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import (
    EXPLOSION_METHOD,
    SHOT_METHOD,
    arena,
    call,
    controls_own_vehicle,
    feedback,
    on_own_vehicle_effect,
    vehicle_class,
    vehicle_name,
    vehicle_state,
)
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.log import log, safe
from ..i18n import STRINGS
from ..model import ArtyBattle, ArtyBook, is_artillery
from ..model.constants import ACTION_CLEAR, BOOK_FILE, PREVIEW_SIZE
from ..model.page import build_page, page_actions
from ..model.preview import preview_text, preview_widget
from ..model.text import arty_text
from ..model.widget import arty_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


# «Артометр»: artillery fire on the own vehicle. Hits and splash from the own vehicle's hit effects
# (Vehicle.showDamageFromShot / showDamageFromExplosion with an SPG as the attacker), damage and damaged modules from
# the own RECEIVED_DAMAGE / RECEIVED_CRIT feedback, stuns from the own STUN state. Kept per battle for the hangar.
class ArtyMeterPanel(BattlePanel):

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.stun_state = getattr(VEHICLE_VIEW_STATE, 'STUN', None)
        self.battle = None
        self.book = None
        BattlePanel.__init__(self, app, PANEL_SPEC)
        self.follow_account(self._on_account)
        self._hook_effects()

    def _on_account(self, account_id):
        self.book = ArtyBook(self.account_file(BOOK_FILE, account_id), self.settings.get('keep_battles'))

    def _hook_effects(self):
        hooked = [
            on_own_vehicle_effect(SHOT_METHOD, functools.partial(self.on_own_effect, 'hits')),
            on_own_vehicle_effect(EXPLOSION_METHOD, functools.partial(self.on_own_effect, 'splash')),
        ]
        if not any(hooked):
            log('arty meter: Vehicle not hooked, only the damage feedback is counted')

    def start(self, player):
        arena_type = getattr(arena(), 'arenaType', None)
        tank = vehicle_name(getattr(player, 'playerVehicleID', None))
        self.battle = ArtyBattle(getattr(arena_type, 'name', None), tank)
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.render()

    def stop(self):
        battle, self.battle = self.battle, None
        if battle is not None and self.book is not None:
            self.book.record(battle, int(time.time()))
            self.book.save()

    @safe
    def on_own_effect(self, key, attacker_id, *details):
        if self.battle is None or not is_artillery(vehicle_class(attacker_id)):
            return
        if self.battle.add(key):
            self.render()

    def _on_feedback(self, events):
        if self.battle is None:
            return
        changed = False
        for event in events:
            if self._add_event(event):
                changed = True

        if changed:
            self.render()

    def _add_event(self, event):
        kind = self.kinds.get(event.getBattleEventType())
        if kind is None or not is_artillery(vehicle_class(event.getTargetID())):
            return False
        extra = event.getExtra()
        if kind == 'received':
            return self.battle.add('damage', call(extra, 'getDamage', 0))
        return self.battle.add('modules', call(extra, 'getCritsCount', 0))

    # RU 1.45 Vehicle.updateStunInfo: STUN carries the StunInfo(startTime, endTime, duration, totalTime, stunType) of
    # the attached vehicle, the ally the camera follows after death included, and its end as a StunInfo with duration 0;
    # a stun is new when its end time moves.
    def _on_vehicle_state(self, state, value):
        if self.battle is None or self.stun_state is None:
            return
        if state != self.stun_state or not controls_own_vehicle():
            return
        if self.battle.stun(getattr(value, 'endTime', None), getattr(value, 'duration', None)):
            self.render()

    @safe
    def render(self):
        if self.battle is None:
            return
        values = self.battle.values()
        has_fire = values['total'] or values['damage']
        if not has_fire and not self.settings.get('show_always'):
            self.hide()
            return
        day = self.book.day(time.time()) if self.book is not None else None

        text = arty_text(values, day, self.settings, self.app.translate)
        self.show(text, arty_widget(values, day, self.settings))

    def ui_actions(self):
        if not self.enabled() or self.book is None:
            return []
        return page_actions(self.app.translate)

    def ui_page(self):
        if not self.enabled() or self.book is None:
            return None
        return build_page(self.book, time.time(), self.app.translate, self.settings.get('keep_battles'))

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR or self.book is None:
            return None
        if self.book.clear():
            self.book.save()
        return self.notice_info('arty_meter_cleared')
