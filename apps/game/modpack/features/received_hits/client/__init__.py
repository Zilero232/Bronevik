# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, vehicle_class, vehicle_name
from ....core.client.game import client_attr, values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.hooks import override
from ....core.log import log, log_exception, safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import ReceivedHits, format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.shot import is_ricochet
from ..model.widget import panel_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT, OWN_VEHICLE_ATTR, SHOT_METHOD, VEHICLE_CLASS, VEHICLE_MODULE


class ReceivedHitsPanel(BattlePanel):
    """The hits on the own tank from the player's own feedback (RU 1.45 feedback_adaptor: RECEIVED_DAMAGE,
    TANKING and RECEIVED_CRIT carry the attacker as the target id, as the vanilla damage log shows it). The feedback
    does not tell a ricochet apart, so the hit effect code of the shot drawn on the own vehicle
    (Vehicle.showDamageFromShot) marks it."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.hits = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)
        self._hook_shots()

    def _hook_shots(self):
        vehicle = client_attr(VEHICLE_MODULE, VEHICLE_CLASS)
        if vehicle is None or not hasattr(vehicle, SHOT_METHOD):
            log('received hits: Vehicle.%s not found, ricochets stay blocked hits' % SHOT_METHOD)
            return
        panel = self

        try:
            @override(vehicle, SHOT_METHOD)
            def show_damage_from_shot(original, entity, attacker_id, points, *args, **kwargs):
                result = original(entity, attacker_id, points, *args, **kwargs)
                if getattr(entity, OWN_VEHICLE_ATTR, False):
                    panel.on_own_shot(attacker_id, points)
                return result
        except Exception:
            log_exception('received hits: shots')

    def start(self, player):
        self.hits = ReceivedHits()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.render()

    def stop(self):
        self.hits = None

    def _on_feedback(self, events):
        if self.hits is None:
            return
        now = time.time()
        changed = False
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            extra = event.getExtra() if kind is not None else None
            if extra is None or (kind != 'crit' and not call(extra, 'isShot', True)):
                continue
            attacker = event.getTargetID()
            damage = call(extra, 'getDamage', 0) if kind != 'crit' else 0
            crits = call(extra, 'getCritsCount', 1) if kind == 'crit' else 0
            changed = self.hits.add(kind, vehicle_name(attacker), vehicle_class(attacker), shell_code(call(extra, 'getShellType')),
                                    damage, crits, now, attacker) or changed
        if changed:
            self.render()

    @safe
    def on_own_shot(self, attacker_id, points):
        if self.hits is not None and is_ricochet(points) and self.hits.ricochet(attacker_id, vehicle_name(attacker_id), vehicle_class(attacker_id),
                                                                                time.time()):
            self.render()

    @safe
    def render(self):
        if self.hits is None:
            return
        text = format_panel(self.hits, self.settings, self.app.translate)
        if text:
            self.show(text, panel_widget(self.hits, self.settings, self.app.translate))
        else:
            self.hide()
