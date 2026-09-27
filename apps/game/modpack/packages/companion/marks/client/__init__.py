from __future__ import absolute_import, division, print_function, unicode_literals

import time

import BigWorld

from ....core.log import safe
from ...payload import build_moe_distribution_event, build_moe_snapshot_event
from ..constants import DISTRIBUTION_TTL_S
from .dossier import current_vehicle_moe


class MarksCapture(object):

    def __init__(self, app):
        self.app = app
        self.hangar_moe = {}
        self.distribution_sent = dict(app.state.get('distribution_sent') or {})
        self.moe_sent = dict(app.state.get('moe_sent') or {})
        app.register_state('distribution_sent', lambda: self.distribution_sent)
        app.register_state('moe_sent', lambda: self.moe_sent)

    def on_vehicle_changed(self):
        snapshot = current_vehicle_moe()
        if snapshot is None:
            return
        tank_id = snapshot['tank_id']
        self.hangar_moe[tank_id] = snapshot
        self._send_snapshot(snapshot)
        self.app.bus.emit('vehicle_moe', snapshot)
        self._request_distribution(tank_id)

    def after_battle(self, tank_id, moe):
        if moe is not None and tank_id in self.hangar_moe:
            self.hangar_moe[tank_id].update({
                'damage_rating': moe['damage_rating'],
                'moving_avg_damage': moe['moving_avg_damage'],
                'marks_on_gun': moe['marks_on_gun'],
            })

    def _send_snapshot(self, snapshot):
        app = self.app
        if not app.config.is_enabled('send_moe_snapshots') or not snapshot.get('damage_rating'):
            return
        key = str(snapshot['tank_id'])
        signature = [snapshot['damage_rating'], snapshot['moving_avg_damage']]
        if self.moe_sent.get(key) == signature:
            return
        event = build_moe_snapshot_event(snapshot['tank_id'], snapshot['damage_rating'], snapshot['moving_avg_damage'],
                                         snapshot.get('marks_on_gun') or 0, snapshot.get('battles'), time.time())
        if app.enqueue(event):
            self.moe_sent[key] = signature
            app.save_state()

    def _request_distribution(self, tank_id):
        app = self.app
        if not app.config.is_enabled('send_moe_distribution') or not app.is_bound():
            return
        key = str(tank_id)
        now = time.time()
        if now - self.distribution_sent.get(key, 0) < DISTRIBUTION_TTL_S:
            return
        player = BigWorld.player()
        do_cmd = getattr(player, '_doCmdInt', None)
        if do_cmd is None:
            return
        from AccountCommands import CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION

        @safe
        def done(request_id, result_id, error, ext=None):
            if not ext:
                return
            event = build_moe_distribution_event(tank_id, ext.get('battleCount', 0), ext.get('damageBetterThanNPercent', []), time.time())
            if app.enqueue(event):
                self.distribution_sent[key] = time.time()
                app.save_state()

        do_cmd(CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION, tank_id, done)
