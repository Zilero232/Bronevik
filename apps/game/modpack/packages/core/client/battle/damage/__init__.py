# -*- coding: utf-8 -*-
"""Feeds the player's own damage to enemies this battle from the battle feedback, raised to the client's summary.
Shared by the «Основной калибр» counter and the session goals' battle line; each panel owns one tracker and calls
`on_change()` to redraw."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....battle_tally import Counters
from ..session import call, dealt_damage, feedback
from .constants import DAMAGE


class DamageTracker(object):

    def __init__(self, on_change):
        self.on_change = on_change
        self.totals = None

    @property
    def damage(self):
        """The damage dealt so far, or None while no battle is tracked."""
        return self.totals.values[DAMAGE] if self.totals is not None else None

    def start(self, hooks):
        """Starts counting from zero; `hooks` is the panel's BattleHooks (cleared on leave)."""
        self.totals = Counters((DAMAGE,))
        hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)

    def stop(self):
        self.totals = None

    def _on_feedback(self, events):
        if self.totals is not None and self.totals.add(DAMAGE, dealt_damage(events)):
            self.on_change()

    def _on_summary(self, event):
        if self.totals is not None and self.totals.raise_to(DAMAGE, call(event, 'getTotalDamage')):
            self.on_change()
