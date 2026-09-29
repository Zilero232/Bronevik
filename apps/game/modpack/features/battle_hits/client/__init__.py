# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import BattleHooks, call, feedback, vehicle_class, vehicle_name
from ....core.client.component import FeatureComponent
from ....core.client.game import client_attr, values_by_name
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import override
from ....core.log import log, log_exception, safe
from ....core.storage import JsonFile
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_CLEAR, BOOK_FILE, HitBook, build_page, panel_text
from ..settings import SCHEMA, SWITCH
from .constants import HANGAR_PANEL, KIND_BY_EVENT, LAYOUT, OWN_VEHICLE_ATTR, SHOT_METHOD, VEHICLE_CLASS, VEHICLE_MODULE


class BattleHitsFeature(FeatureComponent):
    """«Боевые раны»: the points of every shot that hit the player's own tank (Vehicle.showDamageFromShot on the own
    vehicle only) with the damage the own feedback reported, kept per battle and shown in the hangar afterwards."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.book = None
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.hooks = BattleHooks()
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('battle_ready', self._on_battle_ready)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('battle_leave', self._on_battle_leave)
        bus.on('hangar', self.show)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)
        if app.account_id:
            self._on_account(app.account_id)
        self._hook_shots()

    def _hook_shots(self):
        vehicle = client_attr(VEHICLE_MODULE, VEHICLE_CLASS)
        if vehicle is None or not hasattr(vehicle, SHOT_METHOD):
            log('battle hits: Vehicle.%s not found, nothing is recorded' % SHOT_METHOD)
            return
        feature = self

        try:
            @override(vehicle, SHOT_METHOD)
            def show_damage_from_shot(original, entity, attacker_id, points, *args, **kwargs):
                result = original(entity, attacker_id, points, *args, **kwargs)
                if getattr(entity, OWN_VEHICLE_ATTR, False):
                    feature.on_own_shot(attacker_id, points)
                return result
        except Exception:
            log_exception('battle hits: shots')

    def _on_account(self, account_id):
        path = os.path.join(self.app.config_dir, BOOK_FILE % account_id)
        self.book = HitBook(JsonFile(path), self.settings.get('keep_battles'))

    def _on_settings(self, component_id, changed):
        if component_id != FEATURE_ID:
            return
        if self.book is not None and 'keep_battles' in changed:
            self.book.resize(self.settings.get('keep_battles'))
            self.book.save()
        self.show()

    def _on_battle_ready(self, player):
        if self.book is None or not self.enabled():
            return
        battle_id = getattr(player, 'arenaUniqueID', None) or int(time.time())
        self.book.start(battle_id, vehicle_name(getattr(player, 'playerVehicleID', None)), time.time())
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)

    def _on_battle_enter(self):
        self.app.ui.hide(HANGAR_PANEL)

    def _on_battle_leave(self):
        self.hooks.clear()
        if self.book is not None and self.book.finish() is not None:
            self.book.save()

    @safe
    def on_own_shot(self, attacker_id, points):
        if self.book is not None and self.book.current is not None:
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
                self.book.damage(vehicle_name(event.getTargetID()), call(extra, 'getDamage', 0), now)

    @safe
    def show(self):
        latest = self.book.latest() if self.book is not None else None
        if self.app.in_battle or latest is None or not self.enabled() or not self.settings.get('show_panel'):
            self.app.ui.hide(HANGAR_PANEL)
            return
        self.app.ui.show(HANGAR_PANEL, panel_text(latest, self.app.translate), LAYOUT)

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
        return {'kind': 'info', 'text': self.app.translate('battle_hits_cleared')}
