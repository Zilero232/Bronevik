from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import map_label
from ....core.client.component import FeatureComponent
from ..i18n import STRINGS
from ..model import build_page, build_summary, compact, counts, format_summary, page_actions
from ..model.constants import ACTION_CLEAR, STATE_KEY
from ..settings import SCHEMA, SECTION, SWITCH


class BattleResultsSummary(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.pending = []
        stored = app.state.get(STATE_KEY)
        self.history = [entry for entry in stored if isinstance(entry, dict)] if isinstance(stored, list) else []
        app.register_state(STATE_KEY, lambda: self.history)
        app.bus.on('battle_event', self._on_battle_event)
        app.bus.on('hangar', self._on_hangar)

    def _on_battle_event(self, event, now):
        app = self.app
        if not self.enabled():
            return
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        before = dict(app.marks.hangar_moe.get(tank_id) or {})
        summary = build_summary(event, before, map_label(event.get('arena_type_id')))
        if not counts(summary, self.settings.get('bonus_types')):
            return
        self.history.append(compact(summary))
        del self.history[:-self.settings.get('history_size')]
        text = format_summary(summary, self.settings, app.translate)
        if app.in_battle:
            self.pending.append(text)
        else:
            app.ui.notify(text)

    def _on_hangar(self):
        while self.pending:
            self.app.ui.notify(self.pending.pop(0))

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled() else []

    def ui_page(self):
        if not self.enabled():
            return None
        return build_page(self.history, self.app.translate, self.app.config.get('session_idle_minutes') * 60)

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_CLEAR:
            return None
        self.history = []
        self.app.save_state()
        return self.notice_info('br_cleared')
