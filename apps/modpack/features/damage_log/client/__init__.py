from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import BattleHooks, call, controls_own_vehicle, feedback, is_enemy, vehicle_name
from ....core.client.hud import hud_layer
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import DamageLog, format_damage_log
from ..settings import PANEL_ID, SCHEMA, SWITCH

EVENT_KINDS = (
    ('DAMAGE', 'damage'),
    ('RADIO_ASSIST', 'radio'),
    ('TRACK_ASSIST', 'track'),
    ('STUN_ASSIST', 'stun'),
    ('TANKING', 'blocked'),
    ('RECEIVED_DAMAGE', 'received'),
)


def kind_by_event():
    kinds = {}
    for name, kind in EVENT_KINDS:
        value = getattr(BATTLE_EVENT_TYPE, name, None)
        if value is not None:
            kinds[value] = kind
    return kinds


class DamageLogPanel(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.hud = hud_layer(app)
        self.settings = self.hud.register(PANEL_ID, SCHEMA)
        self.kinds = kind_by_event()
        self.hooks = BattleHooks()
        self.log = None
        app.bus.on('battle_ready', self._on_battle_ready)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _on_battle_ready(self, player):
        self._on_battle_leave()
        if not self.app.config.is_enabled(SWITCH):
            return
        self.log = DamageLog()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.render()

    def _on_battle_leave(self):
        self.hooks.clear()
        self.log = None
        self.hud.hide(PANEL_ID)

    @safe
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

    @safe
    def _on_summary(self, event):
        if self.log is not None and self.log.apply_summary(call(event, 'getTotalDamage'), call(event, 'getTotalAssistDamage'),
                                                           call(event, 'getTotalBlockedDamage'), call(event, 'getTotalStunDamage')):
            self.render()

    @safe
    def render(self):
        if self.log is not None:
            self.hud.show(PANEL_ID, format_damage_log(self.log, self.settings, self.app.translate))
