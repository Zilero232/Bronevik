# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import SHOT_METHOD, call, feedback, on_own_shot, vehicle_class, vehicle_name
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.log import log, safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import Hit, ReceivedHits, format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.shot import is_ricochet
from ..model.widget import panel_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


# RU 1.45 feedback_adaptor: RECEIVED_DAMAGE, TANKING and RECEIVED_CRIT carry the attacker as the target id, as the
# vanilla damage log shows it. The feedback does not tell a ricochet apart, so the hit effect code of the shot drawn on
# the own vehicle (Vehicle.showDamageFromShot) marks it.
class ReceivedHitsPanel(BattlePanel):
    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.hits = None
        BattlePanel.__init__(self, app, PANEL_SPEC)
        self._hook_shots()

    def _hook_shots(self):
        if not on_own_shot(self.on_own_shot):
            log('received hits: Vehicle.%s not hooked, ricochets stay blocked hits' % SHOT_METHOD)

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
            if extra is None:
                continue
            is_crit = kind == 'crit'
            if not is_crit and not call(extra, 'isShot', True):
                continue
            hit = _hit_of(event, extra, is_crit, now)
            changed = self.hits.add(kind, hit) or changed

        if changed:
            self.render()

    @safe
    def on_own_shot(self, attacker_id, points):
        if self.hits is None or not is_ricochet(points):
            return
        attacker = vehicle_name(attacker_id)
        if self.hits.ricochet(attacker_id, attacker, vehicle_class(attacker_id), time.time()):
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


def _hit_of(event, extra, is_crit, now):
    attacker_id = event.getTargetID()
    return Hit(
        attacker=vehicle_name(attacker_id),
        vehicle_class=vehicle_class(attacker_id),
        shell=shell_code(call(extra, 'getShellType')),
        damage=0 if is_crit else call(extra, 'getDamage', 0),
        crits=call(extra, 'getCritsCount', 1) if is_crit else 0,
        at=now,
        source=attacker_id,
    )
