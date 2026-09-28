from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ...payload import build_moe_snapshot_event
from .dossier import current_vehicle_moe

# The MoE thresholds come from public data only: the player's own dossier (damageRating, movingAvgDamage,
# marksOnGun: moe_snapshot events) and own battle results, aggregated on the site. The account command
# CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION is not asked: no RU 1.45 client code sends it (common/AccountCommands.py
# defines it, nothing calls it), so its answer is unverifiable and sending it is a private-API call.


class MarksCapture(object):

    def __init__(self, app):
        self.app = app
        self.hangar_moe = {}
        self.moe_sent = dict(app.state.get('moe_sent') or {})
        app.register_state('moe_sent', lambda: self.moe_sent)

    def on_vehicle_changed(self):
        snapshot = current_vehicle_moe()
        if snapshot is None:
            return
        tank_id = snapshot['tank_id']
        self.hangar_moe[tank_id] = snapshot
        self._send_snapshot(snapshot)
        self.app.bus.emit('vehicle_moe', snapshot)

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
