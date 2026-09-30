from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import map_label
from ....core.client.component import FeatureComponent
from ..i18n import STRINGS
from ..model import build_page, build_summary, compact, counts, format_summary, page_actions, restore_history
from ..model.constants import ACTION_CLEAR, STATE_KEY
from ..settings import SCHEMA, SECTION, SWITCH


class BattleResultsSummary(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.pending = []
        self.history = restore_history(app.state.get(STATE_KEY))
        app.register_state(STATE_KEY, lambda: self.history)
        app.bus.on('battle_event', self._on_battle_event)
        app.bus.on('hangar', self._on_hangar)

    def _on_battle_event(self, event, now):
        if not self.enabled():
            return

        summary = self._summary_of(event)
        if not counts(summary, self.settings.get('bonus_types')):
            return

        self._remember(summary)
        self._announce(format_summary(summary, self.settings, self.app.translate))

    def _summary_of(self, event):
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        moe_before = dict(self.app.marks.hangar_moe.get(tank_id) or {})
        return build_summary(event, moe_before, map_label(event.get('arena_type_id')))

    def _remember(self, summary):
        self.history.append(compact(summary))
        del self.history[:-self.settings.get('history_size')]

    def _announce(self, text):
        if self.app.in_battle:
            self.pending.append(text)
        else:
            self.app.ui.notify(text)

    def _on_hangar(self):
        while self.pending:
            self.app.ui.notify(self.pending.pop(0))

    def ui_actions(self):
        if not self.enabled():
            return []
        return page_actions(self.app.translate)

    def ui_page(self):
        if not self.enabled():
            return None
        idle_s = self.app.config.get('session_idle_minutes') * 60
        return build_page(self.history, self.app.translate, idle_s)

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR:
            return None
        self.history = []
        self.app.save_state()
        return self.notice_info('br_cleared')
