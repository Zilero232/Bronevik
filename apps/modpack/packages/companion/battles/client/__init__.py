from __future__ import absolute_import, division, print_function, unicode_literals

import time

import BattleReplay
import BigWorld

from ....core.client.game import map_name, player_tank_id, vehicle_info
from ....core.log import log, safe
from ...loadout import LoadoutTracker
from ...loadout.client import read_current_loadout
from ...marks.client.dossier import achievement_name, current_vehicle_id
from ...payload import PayloadError, build_battle_event, build_battle_start_event, build_queue_event
from ...queue_timer import QueueTimer
from ...shots.client import ShotTracker
from ..constants import RESULTS_POLL_ATTEMPTS, RESULTS_POLL_EVERY_S, SEEN_ARENAS_LIMIT


class BattleCapture(object):

    def __init__(self, app):
        self.app = app
        self.seen_arenas = list(app.state.get('seen_arenas') or [])
        app.register_state('seen_arenas', self._dump_seen_arenas)
        self.queue_timer = QueueTimer()
        self.queue_wait_by_arena = {}
        self.loadouts = LoadoutTracker()
        self.shot_tracker = ShotTracker()
        self.shots_by_arena = {}
        self.shot_arena = None
        self.pending_arenas = []
        self.last_results_poll = 0.0

    def _dump_seen_arenas(self):
        self.seen_arenas = self.seen_arenas[-SEEN_ARENAS_LIMIT:]
        return self.seen_arenas

    def on_enqueued(self, queue_type):
        self.queue_timer.enqueued(queue_type, time.time())
        if self.app.config.is_enabled('send_loadouts'):
            tank_id, loadout = read_current_loadout()
            self.loadouts.queued(tank_id, loadout)

    def on_dequeued(self):
        now = time.time()
        finished = self.queue_timer.dequeued(now)
        if finished is not None and self.app.config.is_enabled('send_queue_times'):
            self.app.enqueue(build_queue_event(finished[0], finished[1], 'dequeued', now, current_vehicle_id()))

    def on_arena_created(self):
        app = self.app
        now = time.time()
        finished = self.queue_timer.arena_created(now)
        if finished is not None and app.config.is_enabled('send_queue_times'):
            app.enqueue(build_queue_event(finished[0], finished[1], 'arena', now, current_vehicle_id()))
        if not BattleReplay.isPlaying() and app.enqueue(build_battle_start_event(now, current_vehicle_id())):
            app.flush_requested = True

    def on_battle_ready(self, player):
        arena_id = getattr(player, 'arenaUniqueID', None)
        wait = self.queue_timer.take_last_wait()
        if not arena_id:
            return
        self.app.bus.emit('battle_start', arena_id)
        self.loadouts.battle_started(arena_id, player_tank_id(player))
        if wait is not None:
            self.queue_wait_by_arena[arena_id] = wait
        if arena_id not in [entry[0] for entry in self.pending_arenas]:
            self.pending_arenas.append([arena_id, 0])
        if self.app.config.is_enabled('send_shots'):
            self.shot_arena = arena_id
            self.shot_tracker.start()

    def on_battle_leave(self):
        shots = self.shot_tracker.take()
        if self.shot_arena is not None and shots:
            self.shots_by_arena[self.shot_arena] = shots
        self.shot_arena = None

    def on_battle_results(self, is_player_vehicle, results):
        if is_player_vehicle and not BattleReplay.isPlaying():
            self.handle_results(results)

    def poll_pending_results(self, now):
        if not self.pending_arenas or now - self.last_results_poll < RESULTS_POLL_EVERY_S:
            return
        cache = getattr(BigWorld.player(), 'battleResultsCache', None)
        if cache is None:
            return
        self.last_results_poll = now
        entry = self.pending_arenas.pop(0)
        entry[1] += 1
        if entry[1] < RESULTS_POLL_ATTEMPTS:
            self.pending_arenas.append(entry)
        arena_id = entry[0]

        @safe
        def done(code, results):
            if code >= 0 and isinstance(results, dict) and results:
                self.handle_results(results)

        cache.get(arena_id, done)

    def handle_results(self, results):
        app = self.app
        arena_id = results.get('arenaUniqueID')
        self.pending_arenas = [entry for entry in self.pending_arenas if entry[0] != arena_id]
        if not arena_id or arena_id in self.seen_arenas:
            return
        avatar = (results.get('personal') or {}).get('avatar') or {}
        owner = avatar.get('accountDBID')
        if owner and app.account_id and owner != app.account_id:
            return
        app.bus.emit('battle_results', arena_id, results)
        common = results.get('common') or {}
        try:
            probe = build_battle_event(results)
        except PayloadError as error:
            log('skip battle results: %s' % error)
            return
        tank_id = probe['vehicle']['tank_id']
        name, tier = vehicle_info(tank_id)
        now = time.time()
        event = build_battle_event(results, {
            'vehicle_name': name,
            'vehicle_tier': tier,
            'map_name': map_name(common.get('arenaTypeID')),
            'queue_time_s': self.queue_wait_by_arena.pop(arena_id, None),
            'loadout': self.loadouts.take(arena_id, tank_id) if app.config.is_enabled('send_loadouts') else None,
            'shots': self.shots_by_arena.pop(arena_id, None) if app.config.is_enabled('send_shots') else None,
            'achievement_name': achievement_name,
        })
        app.bus.emit('battle_event', event, now)
        self.seen_arenas.append(arena_id)
        app.marks.after_battle(tank_id, event.get('moe'))
        app.save_state()
        if app.config.is_enabled('send_battle_results') and app.enqueue(event):
            app.flush_requested = True
        app.bus.emit('battle_recorded')
