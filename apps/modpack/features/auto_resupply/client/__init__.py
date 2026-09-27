from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_ALL, ACTION_SELECTED, plan
from ..settings import SCHEMA, SWITCH
from .garage import garage_vehicles, send, summary


class AutoResupply(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.queue = []
        self.failed = 0

    def ui_actions(self):
        if not self.enabled_in_hangar():
            return []
        translate = self.app.translate
        return [
            {'id': ACTION_SELECTED, 'label': translate('auto_resupply_apply_selected'), 'confirm': None},
            {'id': ACTION_ALL, 'label': translate('auto_resupply_apply_all'), 'confirm': translate('auto_resupply_apply_all_confirm')},
        ]

    def ui_action(self, action, row=None, value=None):
        if not self.enabled_in_hangar() or action not in (ACTION_SELECTED, ACTION_ALL):
            return None
        if action == ACTION_SELECTED:
            vehicle = selected_vehicle()
            vehicles = [vehicle] if vehicle is not None else []
        else:
            vehicles = garage_vehicles()
        by_inv = dict((getattr(vehicle, 'invID', None), vehicle) for vehicle in vehicles)
        requests, refusal = plan([summary(vehicle) for vehicle in vehicles], self.settings.to_dict())
        if refusal:
            return {'kind': 'error', 'text': self.app.translate('auto_resupply_refused_%s' % refusal)}
        idle = not self.queue
        self.queue.extend((by_inv[inv_id], flag, flag_value) for inv_id, flag, flag_value in requests)
        if idle:
            self.failed = 0
            self._next()
        return {'kind': 'info', 'text': self.app.translate('auto_resupply_sent', count=len(requests))}

    def _next(self):
        if not self.queue:
            if self.failed:
                self.app.ui.notify(self.app.translate('auto_resupply_failed'))
            return
        vehicle, flag, value = self.queue[0]
        send(vehicle, flag, value, self._done)

    @safe
    def _done(self, success):
        if self.queue:
            self.queue.pop(0)
        if not success:
            self.failed += 1
        self._next()
