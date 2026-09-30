from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.battle_tally import EFFICIENCY_KEYS, efficiency_totals
from ....core.client.battle import (
    call,
    controls_own_vehicle,
    damage_source,
    feedback,
    is_enemy,
    personal_efficiency,
    vehicle_class,
    vehicle_name,
    vehicle_state,
)
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.timer import Ticker, game_time
from ....core.log import safe
from ....core.hud.stock import BATTLE_DAMAGE_LOG_PANEL
from ....core.shells import shell_code, shell_name
from ..i18n import STRINGS
from ..model import DamageLog, Hit, format_damage_log, format_last_hit
from ..model.constants import PREVIEW_LAST_HIT_SIZE, PREVIEW_SIZE
from ..model.preview import preview_last_hit, preview_last_hit_widget, preview_text, preview_widget
from ..model.widget import damage_log_widget, last_hit_widget
from ..settings import LAST_HIT_PANEL_ID, LAST_HIT_SCHEMA, PANEL_ID, SCHEMA, SWITCH
from .constants import AMMO_RACK_DEVICE, AMMO_RACK_STATES, EVENT_KINDS

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None

try:
    from gui.battle_control.battle_constants import PERSONAL_EFFICIENCY_TYPE
except ImportError:
    PERSONAL_EFFICIENCY_TYPE = None


def is_ammo_rack_damage(value):
    if not isinstance(value, (list, tuple)) or len(value) < 2:
        return False

    device, device_state = value[0], value[1]
    return device == AMMO_RACK_DEVICE and device_state in AMMO_RACK_STATES


LAST_HIT_PANEL_SPEC = PanelSpec(
    panel_id=LAST_HIT_PANEL_ID,
    schema=LAST_HIT_SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_LAST_HIT_SIZE,
    preview_text=preview_last_hit,
    preview_widget=preview_last_hit_widget,
)


class LastHitPanel(BattlePanel):

    def __init__(self, app):
        self.ticker = None
        BattlePanel.__init__(self, app, LAST_HIT_PANEL_SPEC)

    def enabled(self):
        return BattlePanel.enabled(self) and bool(self.settings.get('enabled'))

    def stop(self):
        if self.ticker is not None:
            self.ticker.stop()
            self.ticker = None

    @safe
    def show_hit(self, entry):
        if not self.enabled() or entry is None:
            return

        text = format_last_hit(entry, self.settings, self.app.translate)
        self.show(text, last_hit_widget(entry, self.settings))

        self.stop()
        self.ticker = Ticker(self.settings.get('timeout_s'), self._expire)
        self.ticker.start()

    def _expire(self):
        self.hide()
        return False


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


class DamageLogPanel(BattlePanel):

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, EVENT_KINDS)
        self.devices_state = getattr(VEHICLE_VIEW_STATE, 'DEVICES', None)
        self.efficiency = values_by_name(PERSONAL_EFFICIENCY_TYPE, EFFICIENCY_KEYS)
        self.log = None
        self.last_hit = LastHitPanel(app)
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self, player):
        self.log = DamageLog()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.hooks.add(personal_efficiency, 'onTotalEfficiencyUpdated', self._on_efficiency)
        self.render()

    def stop(self):
        self.log = None

    def stock_aliases(self):
        return () if self.settings.get('keep_stock') else (BATTLE_DAMAGE_LOG_PANEL,)

    # No controls_own_vehicle() guard: Avatar.onBattleEvents hands the events to the feedback only while the camera
    # follows the own vehicle (RU 1.45 Avatar.py:1623-1627), so onPlayerFeedbackReceived carries the player's own events
    # and nothing while an ally is followed after death, as in the vanilla damage log. For received damage the target is
    # the attacker, whose name and class the player panels and the vanilla damage log show.
    def _on_feedback(self, events):
        if self.log is None:
            return

        changed = False
        received = None
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            if not self._add_event(kind, event):
                continue
            changed = True
            if kind == 'received':
                received = self.log.last('received')

        if changed:
            self.render()
        if received is not None:
            self.last_hit.show_hit(received)

    def _add_event(self, kind, event):
        extra = event.getExtra() if kind is not None else None
        if extra is None:
            return False

        vehicle_id = event.getTargetID()
        if kind == 'damage' and not is_enemy(vehicle_id):
            return False

        shell = call(extra, 'getShellType')
        hit = Hit(
            vehicle=vehicle_name(vehicle_id),
            shell=shell_code(shell),
            source=damage_source(extra) if kind == 'received' else None,
            vehicle_class=vehicle_class(vehicle_id),
            at=game_time(),
            shell_name=shell_name(shell),
            gold=call(extra, 'isShellGold', False),
        )
        return self.log.add(kind, call(extra, 'getDamage', 0), hit)

    # DEVICES follows the controlled vehicle: after death it reports the ally the camera follows
    # (Avatar.showVehicleDamageInfo, RU 1.45), so only the own vehicle's ammo rack counts.
    def _on_vehicle_state(self, state, value):
        if self.log is None or self.devices_state is None or state != self.devices_state:
            return
        if not controls_own_vehicle() or not is_ammo_rack_damage(value):
            return

        if self.log.ammo_rack_hit(game_time()):
            self.render()
            self.last_hit.show_hit(self.log.last('received'))

    def _on_summary(self, event):
        self._apply_summary(
            call(event, 'getTotalDamage'),
            call(event, 'getTotalAssistDamage'),
            call(event, 'getTotalBlockedDamage'),
            call(event, 'getTotalStunDamage'),
        )

    # The vanilla damage log's own totals (personal_efficiency_ctrl, RU 1.45 client source): the same numbers the
    # game shows, kept as a floor under the sums of the events.
    def _on_efficiency(self, totals):
        picked = efficiency_totals(totals, self.efficiency)
        self._apply_summary(picked.get('dealt'), picked.get('assist'), picked.get('blocked'), picked.get('stun'))

    def _apply_summary(self, damage, assist, blocked, stun):
        if self.log is not None and self.log.apply_summary(damage, assist, blocked, stun):
            self.render()

    def extended_changed(self, held):
        if self.settings.get('alt_mode'):
            self.render()

    @safe
    def render(self):
        if self.log is None:
            return

        translate = self.app.translate
        extended = self.extended()

        text = format_damage_log(self.log, self.settings, translate, extended)
        payload = damage_log_widget(self.log, self.settings, translate, extended)
        self.show(text, payload)
