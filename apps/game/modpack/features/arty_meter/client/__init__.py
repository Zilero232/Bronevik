# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import arena, call, controls_own_vehicle, feedback, vehicle_class, vehicle_name, vehicle_state
from ....core.client.game import client_attr, values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.hooks import override
from ....core.log import log, log_exception, safe
from ....core.storage import JsonFile
from ..i18n import STRINGS
from ..model import ArtyBattle, ArtyBook, is_artillery
from ..model.constants import ACTION_CLEAR, BOOK_FILE, PREVIEW_SIZE
from ..model.page import build_page, page_actions
from ..model.preview import preview_text, preview_widget
from ..model.text import arty_text
from ..model.widget import arty_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT, OWN_VEHICLE_ATTR, SHOT_METHOD, SPLASH_METHOD, VEHICLE_CLASS, VEHICLE_MODULE

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None


class ArtyMeterPanel(BattlePanel):
    """«Артометр»: artillery fire on the own vehicle. Hits and splash from the own vehicle's hit effects
    (Vehicle.showDamageFromShot / showDamageFromExplosion with an SPG as the attacker), damage and damaged modules from
    the own RECEIVED_DAMAGE / RECEIVED_CRIT feedback, stuns from the own STUN state. Kept per battle for the hangar."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.stun_state = getattr(VEHICLE_VIEW_STATE, 'STUN', None)
        self.battle = None
        self.book = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)
        app.bus.on('account', self._on_account)
        if app.account_id:
            self._on_account(app.account_id)
        self._hook_effects()

    def _on_account(self, account_id):
        self.book = ArtyBook(JsonFile(os.path.join(self.app.config_dir, BOOK_FILE % account_id)), self.settings.get('keep_battles'))

    def _hook_effects(self):
        vehicle = client_attr(VEHICLE_MODULE, VEHICLE_CLASS)
        if vehicle is None:
            log('arty meter: Vehicle not found, only the damage feedback is counted')
            return
        panel = self
        for method, key in ((SHOT_METHOD, 'hits'), (SPLASH_METHOD, 'splash')):
            if not hasattr(vehicle, method):
                continue
            try:
                override(vehicle, method)(self._effect_hook(panel, key))
            except Exception:
                log_exception('arty meter: %s' % method)

    @staticmethod
    def _effect_hook(panel, key):
        def hook(original, entity, attacker_id, *args, **kwargs):
            result = original(entity, attacker_id, *args, **kwargs)
            if getattr(entity, OWN_VEHICLE_ATTR, False):
                panel.on_own_effect(key, attacker_id)
            return result
        return hook

    def start(self, player):
        current = arena()
        self.battle = ArtyBattle(getattr(getattr(current, 'arenaType', None), 'name', None), vehicle_name(getattr(player, 'playerVehicleID', None)))
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.render()

    def stop(self):
        battle, self.battle = self.battle, None
        if battle is not None and self.book is not None:
            self.book.record(battle, int(time.time()))
            self.book.save()

    @safe
    def on_own_effect(self, key, attacker_id):
        if self.battle is not None and is_artillery(vehicle_class(attacker_id)) and self.battle.add(key):
            self.render()

    def _on_feedback(self, events):
        if self.battle is None:
            return
        changed = False
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            if kind is None or not is_artillery(vehicle_class(event.getTargetID())):
                continue
            extra = event.getExtra()
            if kind == 'received':
                changed = self.battle.add('damage', call(extra, 'getDamage', 0)) or changed
            else:
                changed = self.battle.add('modules', call(extra, 'getCritsCount', 0)) or changed
        if changed:
            self.render()

    # RU 1.45 Vehicle.updateStunInfo: STUN carries the StunInfo(startTime, endTime, duration, totalTime, stunType) of the
    # attached vehicle, the ally the camera follows after death included, and its end as a StunInfo with duration 0; a
    # stun is new when its end time moves.
    def _on_vehicle_state(self, state, value):
        if self.battle is None or self.stun_state is None or state != self.stun_state or not controls_own_vehicle():
            return
        if self.battle.stun(getattr(value, 'endTime', None), getattr(value, 'duration', None)):
            self.render()

    @safe
    def render(self):
        if self.battle is None:
            return
        values = self.battle.values()
        if not values['total'] and not values['damage'] and not self.settings.get('show_always'):
            self.hide()
            return
        day = self.book.day(time.time()) if self.book is not None else None
        self.show(arty_text(values, day, self.settings, self.app.translate), arty_widget(values, day, self.settings))

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() and self.book is not None else []

    def ui_page(self):
        if not self.enabled() or self.book is None:
            return None
        return build_page(self.book, time.time(), self.app.translate, self.settings.get('keep_battles'))

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR or self.book is None:
            return None
        if self.book.clear():
            self.book.save()
        return {'kind': 'info', 'text': self.app.translate('arty_meter_cleared')}
