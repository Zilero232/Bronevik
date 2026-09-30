from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import arena, call, damage_source, feedback, own_hull_yaw, player, vehicle_class, vehicle_name, vehicle_state
from ....core.client.game import client_attr
from ....core.client.hud.panel import BattlePanel
from ....core.client.timer import Ticker
from ....core.hooks import override
from ....core.log import log_exception, safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import DeathWatch, format_card, sector_of
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import card_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import AVATAR_CLASS, AVATAR_MODULE, HIT_DIRECTION_METHOD

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None


class DeathCardPanel(BattlePanel):
    """The card of the own death: the last shot from the player's own feedback (RECEIVED_DAMAGE), the modules the damage
    panel reported (VEHICLE_VIEW_STATE.DEVICES), the side of that hit as the game's own hit indicator got it
    (PlayerAvatar.showOwnVehicleHitDirection, RU 1.45) and the killer the kill feed names (arena.onVehicleKilled)."""

    def __init__(self, app):
        self.devices_state = getattr(VEHICLE_VIEW_STATE, 'DEVICES', None)
        self.received = getattr(BATTLE_EVENT_TYPE, 'RECEIVED_DAMAGE', None)
        self.watch = None
        self.own_vehicle_id = None
        self.ticker = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)
        self._hook_hit_direction()

    def _hook_hit_direction(self):
        avatar = client_attr(AVATAR_MODULE, AVATAR_CLASS)
        if avatar is None or not hasattr(avatar, HIT_DIRECTION_METHOD):
            return
        panel = self

        try:
            @override(avatar, HIT_DIRECTION_METHOD)
            def show_hit_direction(original, avatar_self, hit_yaw, *args, **kwargs):
                result = original(avatar_self, hit_yaw, *args, **kwargs)
                panel.on_hit_direction(hit_yaw)
                return result
        except Exception:
            log_exception('death card: hit direction')

    def start(self, battle_player):
        self.watch = DeathWatch()
        self.own_vehicle_id = getattr(battle_player, 'playerVehicleID', None)
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.hooks.add(arena, 'onVehicleKilled', self._on_vehicle_killed)

    def stop(self):
        if self.ticker is not None:
            self.ticker.stop()
            self.ticker = None
        self.watch = None

    @safe
    def on_hit_direction(self, hit_yaw):
        if self.watch is not None and self.watch.card is None:
            self.watch.hit_direction(sector_of(hit_yaw, own_hull_yaw()), time.time())

    # onPlayerFeedbackReceived carries only the player's own events; for received damage the target is the attacker.
    def _on_feedback(self, events):
        if self.watch is None or self.watch.card is not None:
            return
        for event in events:
            if event.getBattleEventType() != self.received:
                continue
            extra = event.getExtra()
            attacker = event.getTargetID()
            self.watch.hit(vehicle_name(attacker), vehicle_class(attacker), shell_code(call(extra, 'getShellType')), call(extra, 'getDamage', 0),
                           damage_source(extra), time.time())

    def _on_vehicle_state(self, state, value):
        if self.watch is None or self.watch.card is not None or state != self.devices_state or self.devices_state is None:
            return
        if isinstance(value, (list, tuple)) and len(value) >= 2:
            self.watch.module(value[0], value[1], time.time())

    def _on_vehicle_killed(self, victim_id, killer_id, *args):
        own = self.own_vehicle_id or getattr(player(), 'playerVehicleID', None)
        if self.watch is None or self.watch.card is not None or victim_id != own:
            return
        killer = killer_id if killer_id and killer_id != own else None
        self.watch.killed(vehicle_name(killer), vehicle_class(killer), time.time())
        self.render()
        seconds = self.settings.get('show_s')
        if seconds:
            self.ticker = Ticker(seconds, self._expire)
            self.ticker.start()

    def _expire(self):
        self.hide()
        return False

    @safe
    def render(self):
        if self.watch is None or self.watch.card is None:
            return
        text = format_card(self.watch.card, self.settings, self.app.translate)
        if text:
            self.show(text, card_widget(self.watch.card, self.settings, self.app.translate))
