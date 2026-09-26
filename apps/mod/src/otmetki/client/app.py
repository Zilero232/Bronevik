from __future__ import absolute_import

import os
import time

import BattleReplay
import BigWorld
from CurrentVehicle import g_currentVehicle
from PlayerEvents import g_playerEvents

from ..binding import BIND_PATH, BindError, CredentialStore, build_bind_request, parse_bind_response
from ..config import Config
from ..i18n import Translator, resolve_language
from ..jsonutil import dumps_bytes
from ..loadout import LoadoutTracker
from ..moe import ThresholdCurve, project, rating_to_percent
from ..outbox import Outbox
from ..panels import format_moe_panel, format_session_panel, format_session_plain
from ..payload import REALM, PayloadError, build_battle_event, build_moe_distribution_event, build_moe_snapshot_event, build_queue_event
from ..queue_timer import QueueTimer
from ..sender import INGEST_PATH, IngestSender, parse_json_body
from ..session import SessionAggregator
from ..signing import DEVICE_HEADER
from ..storage import JsonFile
from ..version import MOD_ID, VERSION
from .battle import BattleMoeTracker
from .shots import ShotTracker
from .dossier import current_vehicle_id, current_vehicle_moe
from .loadout import read_current_loadout
from .fetch import create_transport
from .log import log, log_exception, safe
from .settings_core import SettingsShare
from .settings_ui import SettingsUi
from .ui import BATTLE_PANEL, HANGAR_PANEL, Ui

CONFIG_DIR = os.path.join('mods', 'configs', 'otmetki')
MOE_PATH = '/v1/moe/%d'
TICK_S = 1.0
THRESHOLD_TTL_S = 6 * 3600
THRESHOLD_ERROR_TTL_S = 10 * 60
DISTRIBUTION_TTL_S = 24 * 3600
RESULTS_POLL_EVERY_S = 5.0
RESULTS_POLL_ATTEMPTS = 60
SEEN_ARENAS_LIMIT = 200


def _path(name):
    return os.path.join(CONFIG_DIR, name)


def _client_version():
    try:
        from helpers import getFullClientVersion
        return getFullClientVersion()
    except Exception:
        return ''


def _client_language():
    try:
        from helpers import getClientLanguage
        return getClientLanguage()
    except Exception:
        return None


def _user_agent():
    return '%s/%s' % (MOD_ID, VERSION)


def _player_tank_id(player):
    descriptor = getattr(player, 'vehicleTypeDescriptor', None)
    vehicle_type = getattr(descriptor, 'type', None)
    return getattr(vehicle_type, 'compactDescr', None)


def _vehicle_info(tank_id):
    try:
        from items import vehicles
        vehicle_type = vehicles.getVehicleType(tank_id)
        return vehicle_type.name, vehicle_type.level
    except Exception:
        return None, None


def _map_name(arena_type_id):
    try:
        import ArenaType
        return getattr(ArenaType.g_cache.get(arena_type_id), 'geometryName', None)
    except Exception:
        return None


class OtmetkiApp(object):

    def __init__(self):
        self.config_file = JsonFile(_path('config.json'), pretty=True)
        self.config = Config(self.config_file.read({}))
        self.save_config()
        self.translate = Translator(resolve_language(self.config.get('language'), _client_language()))
        self.credentials = CredentialStore(JsonFile(_path('credentials.json')))
        self.state_file = JsonFile(_path('state.json'))
        state = self.state_file.read({}) or {}
        self.session = SessionAggregator(idle_seconds=self.config.get('session_idle_minutes') * 60)
        self.session.load(state.get('session'))
        self.seen_arenas = list(state.get('seen_arenas') or [])
        self.distribution_sent = dict(state.get('distribution_sent') or {})
        self.moe_sent = dict(state.get('moe_sent') or {})
        self.transport = create_transport()
        self.queue_timer = QueueTimer()
        self.queue_wait_by_arena = {}
        self.loadouts = LoadoutTracker()
        self.thresholds = {}
        self.threshold_requests = set()
        self.hangar_moe = {}
        self.account_id = None
        self.outbox = None
        self.sender = None
        self.auth_failed = False
        self.in_battle = False
        self.pending_arenas = []
        self.last_results_poll = 0.0
        self.last_flush = 0.0
        self.flush_requested = False
        self.battle_snapshot = None
        self.battle_curve = None
        self.ui = Ui()
        self.battle_tracker = BattleMoeTracker(self._on_battle_totals)
        self.shot_tracker = ShotTracker()
        self.shots_by_arena = {}
        self.shot_arena = None
        self.settings_ui = SettingsUi(self)
        self.settings_share = SettingsShare(self, CONFIG_DIR)

    def start(self):
        events = g_playerEvents
        events.onAccountShowGUI += self._on_account_show_gui
        events.onEnqueued += self._on_enqueued
        events.onDequeued += self._on_dequeued
        events.onArenaCreated += self._on_arena_created
        events.onAvatarReady += self._on_avatar_ready
        events.onAvatarBecomeNonPlayer += self._on_avatar_leave
        events.onBattleResultsReceived += self._on_battle_results
        g_currentVehicle.onChanged += self._on_vehicle_changed
        self.settings_ui.register()
        BigWorld.callback(TICK_S, self._tick)
        log('started %s' % VERSION)

    def save_config(self):
        self.config_file.write(self.config.to_dict())

    def _save_state(self):
        self.seen_arenas = self.seen_arenas[-SEEN_ARENAS_LIMIT:]
        self.state_file.write({
            'session': self.session.to_dict(),
            'seen_arenas': self.seen_arenas,
            'distribution_sent': self.distribution_sent,
            'moe_sent': self.moe_sent,
        })

    def current_credentials(self):
        if self.account_id is None:
            return None
        return self.credentials.get(self.account_id)

    def is_bound(self):
        return self.current_credentials() is not None

    def status_text(self):
        if self.auth_failed:
            return self.translate('status_auth_failed')
        if self.is_bound():
            return self.translate('status_bound', account_id=self.account_id)
        return self.translate('status_unbound')

    def enqueue(self, event):
        if self.outbox is None or not self.is_bound() or not self.config.get('enabled'):
            return False
        return self.outbox.enqueue(event)

    def _switch_account(self, account_id):
        self.account_id = account_id
        self.outbox = Outbox(JsonFile(_path('outbox_%d.json' % account_id)))
        self._rebuild_sender()

    def _rebuild_sender(self):
        self.auth_failed = False
        if self.outbox is None:
            self.sender = None
            return
        self.outbox.unblock()
        self.sender = IngestSender(
            self.outbox,
            self.current_credentials(),
            self.transport,
            self.config.endpoint(INGEST_PATH),
            VERSION,
            _client_version(),
            _user_agent(),
            on_response=self._on_ingest_response,
            on_auth_failed=self._on_auth_failed,
            clock=time.time,
        )

    def _tick(self):
        try:
            self.transport.poll()
            now = time.time()
            if not self.in_battle:
                self._poll_pending_results(now)
                interval = self.config.get('flush_interval_seconds')
                if self.sender is not None and (self.flush_requested or now - self.last_flush >= interval):
                    self.flush_requested = False
                    self.last_flush = now
                    self.sender.tick(now)
                self.settings_share.tick(now)
        except Exception:
            log_exception('tick')
        BigWorld.callback(TICK_S, self._tick)

    @safe
    def _on_account_show_gui(self, *args):
        account_id = getattr(BigWorld.player(), 'databaseID', None)
        if account_id and account_id != self.account_id:
            self._switch_account(account_id)
        self._bind_from_config()
        self._on_vehicle_changed()
        self._show_session_panel(False)
        self.settings_ui.refresh()
        self.settings_share.on_hangar()

    def _bind_from_config(self):
        code = self.config.get('bind_code')
        if code:
            self.config.update({'bind_code': ''})
            self.save_config()
            self.bind(code)

    def bind(self, raw_code):
        if not self.account_id:
            self.ui.notify(self.translate('bind_no_account'))
            return
        try:
            request = build_bind_request(raw_code, self.account_id, VERSION, _client_version(), REALM)
        except BindError as error:
            key = 'bind_no_account' if error.reason == 'no_account' else 'bind_invalid_code'
            self.ui.notify(self.translate(key))
            return
        account_id = self.account_id
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': _user_agent()}

        @safe
        def done(status, body, response_headers):
            data = parse_json_body(body)
            if status != 200:
                reason = (data or {}).get('error') or ('http_%d' % status)
                self.ui.notify(self.translate('bind_failed', reason=reason))
                return
            try:
                creds = parse_bind_response(data, account_id)
            except BindError as error:
                self.ui.notify(self.translate('bind_failed', reason=error.reason))
                return
            self.credentials.save(creds)
            if account_id == self.account_id:
                self._rebuild_sender()
            self.ui.notify(self.translate('bind_success'))
            self.settings_ui.refresh()

        self.transport.request('POST', self.config.endpoint(BIND_PATH), headers, dumps_bytes(request), done)

    @safe
    def _on_ingest_response(self, data):
        summary = data.get('session')
        if isinstance(summary, dict) and self.session.set_server_summary(summary.get('session_id'), summary):
            self._save_state()
            self._show_session_panel(False)

    @safe
    def _on_auth_failed(self):
        self.auth_failed = True
        self.ui.notify(self.translate('status_auth_failed'))
        self.settings_ui.refresh()

    @safe
    def _on_vehicle_changed(self, *args):
        if self.in_battle:
            return
        snapshot = current_vehicle_moe()
        if snapshot is None:
            return
        tank_id = snapshot['tank_id']
        self.hangar_moe[tank_id] = snapshot
        self._send_moe_snapshot(snapshot)
        self._ensure_thresholds(tank_id)
        self._request_distribution(tank_id)

    def _send_moe_snapshot(self, snapshot):
        if not self.config.is_enabled('send_moe_snapshots') or not snapshot.get('damage_rating'):
            return
        key = str(snapshot['tank_id'])
        signature = [snapshot['damage_rating'], snapshot['moving_avg_damage']]
        if self.moe_sent.get(key) == signature:
            return
        event = build_moe_snapshot_event(snapshot['tank_id'], snapshot['damage_rating'], snapshot['moving_avg_damage'],
                                         snapshot.get('marks_on_gun') or 0, snapshot.get('battles'), time.time())
        if self.enqueue(event):
            self.moe_sent[key] = signature
            self._save_state()

    def _ensure_thresholds(self, tank_id):
        cached = self.thresholds.get(tank_id)
        now = time.time()
        if cached is not None:
            ttl = THRESHOLD_TTL_S if cached[1] is not None else THRESHOLD_ERROR_TTL_S
            if now - cached[0] < ttl:
                return
        if tank_id in self.threshold_requests:
            return
        self.threshold_requests.add(tank_id)
        headers = {'Accept': 'application/json', 'User-Agent': _user_agent()}
        creds = self.current_credentials()
        if creds is not None:
            headers[DEVICE_HEADER] = creds.device_id

        @safe
        def done(status, body, response_headers):
            self.threshold_requests.discard(tank_id)
            curve = ThresholdCurve.from_api(parse_json_body(body)) if status == 200 else None
            self.thresholds[tank_id] = (time.time(), curve)

        self.transport.request('GET', self.config.endpoint(MOE_PATH % tank_id), headers, None, done)

    def _request_distribution(self, tank_id):
        if not self.config.is_enabled('send_moe_distribution') or not self.is_bound():
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
            if self.enqueue(event):
                self.distribution_sent[key] = time.time()
                self._save_state()

        do_cmd(CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION, tank_id, done)

    @safe
    def _on_enqueued(self, queue_type, *args):
        self.queue_timer.enqueued(queue_type, time.time())
        if self.config.is_enabled('send_loadouts'):
            tank_id, loadout = read_current_loadout()
            self.loadouts.queued(tank_id, loadout)

    @safe
    def _on_dequeued(self, queue_type, *args):
        now = time.time()
        finished = self.queue_timer.dequeued(now)
        if finished is not None and self.config.is_enabled('send_queue_times'):
            self.enqueue(build_queue_event(finished[0], finished[1], 'dequeued', now, current_vehicle_id()))

    @safe
    def _on_arena_created(self, *args):
        now = time.time()
        finished = self.queue_timer.arena_created(now)
        if finished is not None and self.config.is_enabled('send_queue_times'):
            self.enqueue(build_queue_event(finished[0], finished[1], 'arena', now, current_vehicle_id()))

    @safe
    def _on_avatar_ready(self, *args):
        self.in_battle = True
        self.ui.hide(HANGAR_PANEL)
        if BattleReplay.isPlaying():
            return
        player = BigWorld.player()
        arena_id = getattr(player, 'arenaUniqueID', None)
        wait = self.queue_timer.take_last_wait()
        if arena_id:
            self.loadouts.battle_started(arena_id, _player_tank_id(player))
            if wait is not None:
                self.queue_wait_by_arena[arena_id] = wait
            if arena_id not in [entry[0] for entry in self.pending_arenas]:
                self.pending_arenas.append([arena_id, 0])
            if self.config.is_enabled('send_shots'):
                self.shot_arena = arena_id
                self.shot_tracker.start()
        if not self.config.is_enabled('battle_moe_panel'):
            return
        tank_id = _player_tank_id(player)
        snapshot = self.hangar_moe.get(tank_id)
        if snapshot is None:
            return
        cached = self.thresholds.get(tank_id)
        self.battle_snapshot = snapshot
        self.battle_curve = cached[1] if cached is not None else None
        self.battle_tracker.start()

    @safe
    def _on_battle_totals(self, totals):
        snapshot = self.battle_snapshot
        if snapshot is None:
            return
        projection = project(snapshot['moving_avg_damage'], rating_to_percent(snapshot['damage_rating']), totals, self.battle_curve)
        self.ui.show(BATTLE_PANEL, format_moe_panel(projection, self.translate))

    @safe
    def _on_avatar_leave(self, *args):
        self.in_battle = False
        self.battle_tracker.stop()
        shots = self.shot_tracker.take()
        if self.shot_arena is not None and shots:
            self.shots_by_arena[self.shot_arena] = shots
        self.shot_arena = None
        self.battle_snapshot = None
        self.battle_curve = None
        self.ui.hide(BATTLE_PANEL)

    @safe
    def _on_battle_results(self, is_player_vehicle, results):
        if is_player_vehicle and not BattleReplay.isPlaying():
            self._handle_results(results)

    def _poll_pending_results(self, now):
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
                self._handle_results(results)

        cache.get(arena_id, done)

    def _handle_results(self, results):
        arena_id = results.get('arenaUniqueID')
        self.pending_arenas = [entry for entry in self.pending_arenas if entry[0] != arena_id]
        if not arena_id or arena_id in self.seen_arenas:
            return
        avatar = (results.get('personal') or {}).get('avatar') or {}
        owner = avatar.get('accountDBID')
        if owner and self.account_id and owner != self.account_id:
            return
        common = results.get('common') or {}
        try:
            probe = build_battle_event(results)
        except PayloadError as error:
            log('skip battle results: %s' % error)
            return
        tank_id = probe['vehicle']['tank_id']
        name, tier = _vehicle_info(tank_id)
        now = time.time()
        event = build_battle_event(results, {
            'vehicle_name': name,
            'vehicle_tier': tier,
            'map_name': _map_name(common.get('arenaTypeID')),
            'queue_time_s': self.queue_wait_by_arena.pop(arena_id, None),
            'loadout': self.loadouts.take(arena_id, tank_id) if self.config.is_enabled('send_loadouts') else None,
            'shots': self.shots_by_arena.pop(arena_id, None) if self.config.is_enabled('send_shots') else None,
        })
        event['session_id'] = self.session.add(event, now)
        self.seen_arenas.append(arena_id)
        moe = event.get('moe')
        if moe is not None and tank_id in self.hangar_moe:
            self.hangar_moe[tank_id].update({
                'damage_rating': moe['damage_rating'],
                'moving_avg_damage': moe['moving_avg_damage'],
                'marks_on_gun': moe['marks_on_gun'],
            })
        self._save_state()
        if self.config.is_enabled('send_battle_results') and self.enqueue(event):
            self.flush_requested = True
        self._show_session_panel(True)

    def _show_session_panel(self, after_battle):
        if self.in_battle or not self.config.is_enabled('hangar_session_panel'):
            return
        if self.session.is_expired(time.time()):
            self.ui.hide(HANGAR_PANEL)
            return
        summary = self.session.summary()
        if not summary['battles']:
            return
        if self.ui.has_panels:
            self.ui.show(HANGAR_PANEL, format_session_panel(summary, self.translate))
        elif after_battle:
            self.ui.notify(format_session_plain(summary, self.translate))


g_app = None


def start():
    global g_app
    if g_app is None:
        g_app = OtmetkiApp()
        g_app.start()
    return g_app
