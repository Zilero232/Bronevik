from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, controls_own_vehicle, feedback, is_enemy, vehicle_name
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import DamageLog, format_damage_log
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import EVENT_KINDS


class DamageLogPanel(BattlePanel):

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, EVENT_KINDS)
        self.log = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.log = DamageLog()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.render()

    def stop(self):
        self.log = None

    def _on_feedback(self, events):
        if self.log is None or not controls_own_vehicle():
            return
        changed = False
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            extra = event.getExtra() if kind is not None else None
            if extra is None:
                continue
            vehicle_id = event.getTargetID()
            if kind == 'damage' and not is_enemy(vehicle_id):
                continue
            shell = shell_code(call(extra, 'getShellType'))
            changed = self.log.add(kind, call(extra, 'getDamage', 0), vehicle_name(vehicle_id), shell) or changed
        if changed:
            self.render()

    def _on_summary(self, event):
        if self.log is not None and self.log.apply_summary(call(event, 'getTotalDamage'), call(event, 'getTotalAssistDamage'),
                                                           call(event, 'getTotalBlockedDamage'), call(event, 'getTotalStunDamage')):
            self.render()

    @safe
    def render(self):
        if self.log is not None:
            self.show(format_damage_log(self.log, self.settings, self.app.translate))
