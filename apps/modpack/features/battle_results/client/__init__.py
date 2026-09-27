from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.hud import component_config
from ....core.log import safe
from ..i18n import STRINGS
from ..model import build_summary, counts, format_summary
from ..settings import SCHEMA, SECTION, SWITCH


def map_label(arena_type_id):
    try:
        import ArenaType
        return getattr(ArenaType.g_cache.get(arena_type_id), 'name', None)
    except Exception:
        return None


class BattleResultsSummary(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.settings = component_config(app).section(SECTION, SCHEMA)
        self.pending = []
        app.bus.on('battle_event', self._on_battle_event)
        app.bus.on('hangar', self._on_hangar)

    @safe
    def _on_battle_event(self, event, now):
        app = self.app
        if not app.config.is_enabled(SWITCH):
            return
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        before = dict(app.marks.hangar_moe.get(tank_id) or {})
        summary = build_summary(event, before, map_label(event.get('arena_type_id')))
        if not counts(summary, self.settings.get('bonus_types')):
            return
        text = format_summary(summary, self.settings, app.translate)
        if app.in_battle:
            self.pending.append(text)
        else:
            app.ui.notify(text)

    def _on_hangar(self):
        while self.pending:
            self.app.ui.notify(self.pending.pop(0))
