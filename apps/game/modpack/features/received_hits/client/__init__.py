# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, vehicle_class, vehicle_name
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import ReceivedHits, format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT


def outcome_of(kind, extra):
    if kind == 'blocked' and call(extra, 'isRicochet', False):
        # UNVERIFIED on Lesta 1.45: the blocked-damage extra may not tell a ricochet apart; then it stays «не пробил».
        return 'ricochet'
    return kind


class ReceivedHitsPanel(BattlePanel):
    """The hits on the own tank from the player's own feedback (RU 1.45 feedback_adaptor: RECEIVED_DAMAGE,
    TANKING and RECEIVED_CRIT carry the attacker as the target id, as the vanilla damage log shows it)."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.hits = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

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
            changed = self.hits.add(outcome_of(kind, extra), vehicle_name(attacker), vehicle_class(attacker), shell_code(call(extra, 'getShellType')),
                                    damage, crits, now) or changed
        if changed:
            self.render()

    @safe
    def render(self):
        if self.hits is None:
            return
        text = format_panel(self.hits, self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()
