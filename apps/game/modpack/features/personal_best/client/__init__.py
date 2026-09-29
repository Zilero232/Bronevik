from __future__ import absolute_import, division, print_function, unicode_literals

import os

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import arena, call, feedback, is_enemy
from ....core.client.game import client_attr, player_tank_id, values_by_name, vehicle_short_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.me import tank_ratings
from ....core.client.sound import play_mp3
from ....core.compat import is_number
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import subscribe
from ....core.log import log_exception, safe
from ....core.storage import JsonFile
from ..i18n import STRINGS
from ..model import LiveBattle, RecordBook, beaten, event_values, format_card, format_line
from ..model.constants import KIND_BY_EVENT, PREVIEW_SIZE, RANDOM_BONUS_TYPE, SOUND, STORE_FILE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import CAPS_CLASS, CAPS_MODULE, DOSSIER_CAP
from .dossier import selected_records


def counts_in_dossier(bonus_type):
    """True for a battle whose results the dossier's max15x15 records take (random battles, Mapbox and the rest of the
    DOSSIER_MAX15X15 types); only the random battle when the client's caps cannot be read."""
    caps = client_attr(CAPS_MODULE, CAPS_CLASS)
    cap = getattr(caps, DOSSIER_CAP, None)
    if cap is None or bonus_type is None:
        return bonus_type == RANDOM_BONUS_TYPE
    try:
        return bool(caps.checkAny(bonus_type, cap))
    except Exception:
        return bonus_type == RANDOM_BONUS_TYPE


class PersonalBestPanel(BattlePanel):
    """The battle line against the tank's record and the new-record card after the battle. Records come from the
    own dossier (the selected vehicle), the site's career records (/mod/me/tanks) and the own battle results."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.tanks = tank_ratings(app)
        self.store = None
        self.book = RecordBook()
        self.record = {}
        self.live = None
        self.pending = []
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('hangar', self._on_hangar)
        bus.on('battle_event', self._on_battle_event)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)
        self.tanks.listen(self._on_site_row)
        try:
            from CurrentVehicle import g_currentVehicle
            subscribe(g_currentVehicle, 'onChanged', self._on_vehicle_changed)
        except Exception:
            log_exception('personal best: current vehicle')
        if app.account_id:
            self._on_account(app.account_id)

    def _on_account(self, account_id):
        self.store = JsonFile(os.path.join(self.app.config_dir, STORE_FILE % account_id))
        self.book = RecordBook(self.store.read({}))

    def _save(self):
        if self.store is not None:
            self.store.write(self.book.to_dict())

    def _merge(self, tank_id, values):
        if self.book.merge(tank_id, values):
            self._save()

    def _on_hangar(self):
        self._on_vehicle_changed()
        while self.pending:
            text = self.pending.pop(0)
            self.app.ui.notify(text)
            if self.settings.get('sound'):
                play_mp3(SOUND)

    def _on_vehicle_changed(self):
        if not self.enabled_in_hangar():
            return
        tank_id, values = selected_records()
        if tank_id:
            self._merge(tank_id, values)
            self.tanks.ensure(tank_id)

    def _on_site_row(self, tank_id):
        row = self.tanks.row(tank_id)
        if row is not None and row.get('records'):
            self._merge(tank_id, row['records'])

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
            self.render()

    def _on_battle_event(self, event, now):
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        if not counts_in_dossier(event.get('bonus_type')) or not tank_id:
            return
        values = event_values(event)
        broken = beaten(self.book.get(tank_id), values)
        self._merge(tank_id, values)
        if broken and self.enabled() and self.settings.get('show_card'):
            self.pending.append(format_card(broken, vehicle_short_name(tank_id), self.app.translate))
            if not self.app.in_battle:
                self._on_hangar()

    def start(self, player):
        bonus_type = getattr(arena(), 'bonusType', RANDOM_BONUS_TYPE)
        record = self.book.get(player_tank_id(player))
        if not counts_in_dossier(bonus_type) or not record:
            return
        self.record = record
        self.live = LiveBattle()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.render()

    def stop(self):
        self.live = None
        self.record = {}

    # onPlayerFeedbackReceived carries only the player's own events (feedback_adaptor, RU 1.45).
    def _on_feedback(self, events):
        if self.live is None:
            return
        changed = False
        for event in events:
            metric = self.kinds.get(event.getBattleEventType())
            if metric is None or not is_enemy(event.getTargetID()):
                continue
            if metric == 'frags':
                changed = self.live.add(metric) or changed
            else:
                changed = self.live.add(metric, call(event.getExtra(), 'getDamage', 0)) or changed
        if changed:
            self.render()

    # BattleSummaryFeedbackEvent (feedback_events, RU 1.45): getTotalAssistDamage() is track + radio, stun comes apart.
    def _on_summary(self, event):
        if self.live is None:
            return
        assist = call(event, 'getTotalAssistDamage')
        stun = call(event, 'getTotalStunDamage')
        if is_number(assist) and is_number(stun):
            assist += stun
        changed = self.live.raise_to('damage', call(event, 'getTotalDamage'))
        if self.live.raise_to('assist', assist) or changed:
            self.render()

    @safe
    def render(self):
        if self.live is None:
            return
        text = format_line(self.record, self.live, self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()
