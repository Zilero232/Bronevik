from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ..i18n import STRINGS
from ..model import TiltWatch, notice_text
from ..settings import SCHEMA, SECTION, SWITCH


class TiltGuard(FeatureComponent):
    """Break reminders from the own battle results (`battle_event`), shown in the hangar as a system message."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.watch = TiltWatch()
        self.pending = []
        app.bus.on('battle_event', self._on_battle_event)
        app.bus.on('hangar', self._on_hangar)
        app.bus.on('account', self._on_account)

    def _on_account(self, account_id):
        self.watch = TiltWatch()
        self.pending = []

    # Battles count only while the reminders are on: a reminder is never used up while nobody could see it.
    def _on_battle_event(self, event, now):
        if not self.enabled():
            return
        notices = self.watch.add(event, now, self.settings)
        if not notices:
            return
        summary = self.watch.summary()
        self.pending.extend(notice_text(key, summary, self.app.translate) for key in notices)
        if not self.app.in_battle:
            self._on_hangar()

    def _on_hangar(self):
        while self.pending:
            self.app.ui.notify(self.pending.pop(0))
