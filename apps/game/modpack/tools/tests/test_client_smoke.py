# -*- coding: utf-8 -*-
import json
import os
import random
import shutil
import sys
import tempfile
import time
import types
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.shells.constants import BATTLE_LOG_SHELL_NAMES
from otmetki.core.vendor.enum34 import IntEnum

ACCOUNT = 12345678
REGISTERED = tuple(_support.feature_ids()) + ('ui',)
ENTRY_MODULES = ('mod_otmetki',) + tuple('mod_otmetki_' + key for key in REGISTERED)
STUBBED = ('gui', 'BigWorld', 'BattleReplay', 'CurrentVehicle', 'PlayerEvents', 'BattleFeedbackCommon', 'dossiers2', 'constants', 'SoundGroups',
           'messenger', 'notification', 'account_helpers', 'helpers', 'skeletons', 'frameworks', 'openwg_gameface', 'items', 'WWISE', 'vehicle_outfit',
           'Keys', 'Avatar', 'Vehicle', 'Math')


class Event(object):

    def __init__(self):
        self.handlers = []

    def __iadd__(self, handler):
        self.handlers.append(handler)
        return self

    def __isub__(self, handler):
        self.handlers.remove(handler)
        return self

    def __call__(self, *args):
        for handler in list(self.handlers):
            handler(*args)


class Sink(object):

    def write(self, text):
        pass

    def flush(self):
        pass


class Player(object):

    def __init__(self, account_id=None, arena_id=None):
        self.databaseID = account_id
        self.arenaUniqueID = arena_id
        self.guiSessionProvider = None
        self.name = 'player_%s' % account_id
        self.models = []

    def addModel(self, model):
        self.models.append(model)

    def delModel(self, model):
        self.models.remove(model)


class BattleResultsCache(object):
    # RU 1.45 client source (client_common/shared_utils/account_helpers/BattleResultsCache.py): get() sends
    # CMD_REQ_BATTLE_RESULTS and answers RES_COOLDOWN to everyone else until the stream is back; load()
    # reads the file the game saved; convertToFullForm() unpacks it.
    RES_COOLDOWN = -8

    def __init__(self):
        self.server_requests = []
        self.waiting = False
        self.saved = {}

    def get(self, arena_id, callback):
        if self.waiting:
            callback(self.RES_COOLDOWN, None)
            return
        self.waiting = True
        self.server_requests.append(arena_id)

    def load(self, name, arena_id):
        return self.saved.get((name, arena_id))

    @staticmethod
    def convertToFullForm(compact):
        return compact


def module(name, **attrs):
    stub = types.ModuleType(name)
    stub.__dict__.update(attrs)
    sys.modules[name] = stub
    return stub


def package(name, path):
    stub = module(name)
    stub.__path__ = list(path)
    return stub


SHELL_TYPES = IntEnum('BATTLE_LOG_SHELL_TYPES', [(name, index) for index, name in enumerate(BATTLE_LOG_SHELL_NAMES)])
SERVER_TIME = 1790000100.0
CLIENT_VERSION = u'\u041c\u0438\u0440 \u0442\u0430\u043d\u043a\u043e\u0432 1.45.0.5231'
OWN_VEHICLE = 101
ENEMY_VEHICLE = 202
ALLY_VEHICLE = 303
HIT_STATES = ('VEHICLE_HEALTH', 'VEHICLE_HIT', 'VEHICLE_RICOCHET', 'VEHICLE_ARMOR_PIERCED', 'VEHICLE_CRITICAL_HIT', 'VEHICLE_DEAD')


class Extra(object):
    # RU 1.45 feedback_events._DamageExtra: the attack reason checks are methods of the extra.

    def __init__(self, damage=0, shell=SHELL_TYPES.ARMOR_PIERCING, crits=0, reason='shot'):
        self.damage = damage
        self.shell = shell
        self.crits = crits
        self.reason = reason

    def isFire(self):
        return self.reason == 'fire'

    def isRam(self):
        return self.reason == 'ram'

    def getDamage(self):
        return self.damage

    def isShot(self):
        return self.reason == 'shot'

    def getShellType(self):
        return self.shell

    def getCritsCount(self):
        return self.crits


class Feedback(object):

    def __init__(self, kind, target_id, extra):
        self.kind = kind
        self.target_id = target_id
        self.extra = extra

    def getBattleEventType(self):
        return self.kind

    def getTargetID(self):
        return self.target_id

    def getExtra(self):
        return self.extra


class Summary(object):

    def getTotalDamage(self):
        return 2150

    def getTotalAssistDamage(self):
        return 950

    def getTotalBlockedDamage(self):
        return 900

    def getTotalStunDamage(self):
        return 0


class VehicleInfo(object):
    # RU 1.45 arena_vos.VehicleArenaInfoVO: vehicleType is a VehicleTypeInfoVO with shortName, maxHealth and classTag.

    def __init__(self, vehicle_id, team, name, max_health, alive=True, class_tag='mediumTank'):
        self.vehicleID = vehicle_id
        self.team = team
        self.vehicleType = type('VehicleType', (object,), {'shortName': name, 'name': name, 'maxHealth': max_health, 'classTag': class_tag})()
        self.alive = alive

    def isAlive(self):
        return self.alive


class ArenaDP(object):

    def __init__(self, vehicles):
        self.vehicles = dict((info.vehicleID, info) for info in vehicles)

    def getVehicleInfo(self, vehicle_id):
        return self.vehicles.get(vehicle_id)

    def isEnemyTeam(self, team):
        return team != 1

    def getVehiclesInfoIterator(self):
        return iter(list(self.vehicles.values()))

    def getNumberOfTeam(self):
        return 1


class EquipmentItem(object):
    # RU 1.45 equipment_ctrl._EquipmentItem: getDescriptor().userString, getQuantity(), isReady (a property),
    # getTimeRemaining().

    def __init__(self, name, quantity, ready=True, remaining=0):
        self.descriptor = type('Equipment', (object,), {'userString': name})()
        self.quantity = quantity
        self.isReady = ready
        self.remaining = remaining

    def getDescriptor(self):
        return self.descriptor

    def getQuantity(self):
        return self.quantity

    def getTimeRemaining(self):
        return self.remaining


class Equipments(object):

    def __init__(self):
        self.items = [(501, EquipmentItem(u'Аптечка', 1)), (502, EquipmentItem(u'Ремкомплект', 1, False, 12))]
        self.onEquipmentAdded = Event()
        self.onEquipmentUpdated = Event()

    def getOrderedEquipmentsLayout(self):
        return list(self.items)


class ReloadSnapshot(object):
    # RU 1.45 ammo_ctrl.ReloadingTimeSnapshot.

    def __init__(self, left, base):
        self.left = left
        self.base = base

    def getTimeLeft(self):
        return self.left

    def getBaseValue(self):
        return self.base


class Ammo(object):
    # RU 1.45 ammo_ctrl.AmmoController: the shells layout (intCD, descriptor, quantity, quantityInClip, gunSettings), the
    # gun settings' clip, the current shell and the reload snapshot.

    def __init__(self):
        # RU 1.45 ammo_ctrl.GunSettings: getPiercingPower and getShotSpeed per shell, what the vanilla shell tooltip reads.
        self.gun = type('GunSettings', (object,), {'clip': type('Clip', (object,), {'size': 4, 'interval': 2.0})(),
                                                   'getPiercingPower': lambda gun, int_cd: (258, 250) if int_cd == 11 else (60, 60),
                                                   'getShotSpeed': lambda gun, int_cd: 800.0})()
        self.shells = {11: (32, 3), 12: (6, 0)}
        for name in ('onGunReloadTimeSet', 'onGunSettingsSet', 'onShellsAdded', 'onShellsUpdated', 'onCurrentShellChanged'):
            setattr(self, name, Event())

    def getOrderedShellsLayout(self):
        kinds = {11: 'ARMOR_PIERCING', 12: 'HIGH_EXPLOSIVE'}
        return [(int_cd, type('Shell', (object,), {'kind': kinds[int_cd], 'avgDamage': 390 if int_cd == 11 else 480})(), quantity, in_clip, self.gun)
                for int_cd, (quantity, in_clip) in sorted(self.shells.items())]

    def getGunSettings(self):
        return self.gun

    def getCurrentShellCD(self):
        return 11

    def getShells(self, int_cd):
        return self.shells[int_cd]

    def getGunReloadingState(self):
        return ReloadSnapshot(0.0, 7.8)


class BattleSession(object):

    def __init__(self):
        self.feedback = type('Feedback', (object,), {})()
        for name in ('onPlayerFeedbackReceived', 'onPlayerSummaryFeedbackReceived', 'onVehicleFeedbackReceived'):
            setattr(self.feedback, name, Event())
        self.vehicle_state = type('VehicleState', (object,), {'getControllingVehicleID': lambda state: OWN_VEHICLE})()
        self.vehicle_state.onVehicleStateUpdated = Event()
        self.shared = type('Shared', (object,), {})()
        self.shared.feedback = self.feedback
        self.shared.vehicleState = self.vehicle_state
        self.shared.equipments = Equipments()
        self.shared.ammo = Ammo()
        self.dp = ArenaDP([VehicleInfo(OWN_VEHICLE, 1, 'T-34', 1000), VehicleInfo(ALLY_VEHICLE, 1, 'KV-1', 1200, class_tag='heavyTank'),
                           VehicleInfo(ENEMY_VEHICLE, 2, 'Pz. IV', 900)])
        self.arena = type('Arena', (object,), {'period': 3, 'periodEndTime': SERVER_TIME + 300})()
        self.arena.onVehicleKilled = Event()
        self.arena.onVehicleAdded = Event()

    def getArenaDP(self):
        return self.dp


class Response(object):
    # RU 1.45 client source (gui/platform/base/request.py): the fetchURL response exposes its headers
    # through a method, response.headers().

    def __init__(self, code, body, headers=None):
        self.responseCode = code
        self.body = body
        self._headers = dict(headers or {})

    def headers(self):
        return dict(self._headers)


class ClientSmokeTest(unittest.TestCase):

    def setUp(self):
        self.saved_cwd = os.getcwd()
        self.saved_stdout = sys.stdout
        sys.stdout = Sink()
        self.game_dir = tempfile.mkdtemp()
        os.chdir(self.game_dir)
        self.saved_appdata = os.environ.get('APPDATA')
        os.environ['APPDATA'] = os.path.join(self.game_dir, 'AppData')
        self.purge()
        self.callbacks = []
        self.messages = []
        self.requests = []
        self.fetches = []
        self.player = Player()
        self.events = type('PlayerEvents', (object,), {})()
        for name in ('onAccountShowGUI', 'onEnqueued', 'onDequeued', 'onArenaCreated', 'onAvatarReady', 'onAvatarBecomeNonPlayer',
                     'onBattleResultsReceived'):
            setattr(self.events, name, Event())
        self.vehicle = type('CurrentVehicle', (object,), {'item': None, 'onChanged': Event()})()
        self.client_version = CLIENT_VERSION
        self.install_stubs()

    def tearDown(self):
        os.chdir(self.saved_cwd)
        os.environ['APPDATA'] = self.saved_appdata
        sys.stdout = self.saved_stdout
        self.purge()
        shutil.rmtree(self.game_dir, ignore_errors=True)

    def purge(self):
        for name in list(sys.modules):
            if name.split('.')[0] in STUBBED:
                del sys.modules[name]

    def install_stubs(self):
        test = self

        def fetch_url(url, callback, headers=None, timeout=None, method=None, postData=None):
            test.requests.append((method, url))
            test.fetches.append((method, url, headers, postData, callback))

        self.clock = [100.0]
        module('BigWorld', callback=lambda delay, fn: test.callbacks.append(fn), player=lambda: test.player, fetchURL=fetch_url,
               serverTime=lambda: SERVER_TIME, time=lambda: test.clock[0])
        module('BattleReplay', isPlaying=lambda: False)
        module('CurrentVehicle', g_currentVehicle=self.vehicle)
        module('PlayerEvents', g_playerEvents=self.events)
        # RU 1.45 common/BattleFeedbackCommon.BATTLE_EVENT_TYPE values.
        kinds = type('BATTLE_EVENT_TYPE', (object,), {'SPOTTED': 0, 'RADIO_ASSIST': 1, 'TRACK_ASSIST': 2, 'BASE_CAPTURE_POINTS': 3,
                                                      'BASE_CAPTURE_DROPPED': 4, 'TANKING': 5, 'CRIT': 6, 'DAMAGE': 7, 'KILL': 8,
                                                      'RECEIVED_CRIT': 9, 'RECEIVED_DAMAGE': 10, 'STUN_ASSIST': 11})
        module('BattleFeedbackCommon', BATTLE_EVENT_TYPE=kinds)
        package('dossiers2', [])
        package('dossiers2.ui', [])
        module('dossiers2.ui.achievements', ACHIEVEMENT_BLOCK=type('ACHIEVEMENT_BLOCK', (object,), {'TOTAL': 'total'}))
        self.results_cache = BattleResultsCache()
        self.results_service = type('BattleResultsService', (object,), {})()
        self.results_service.onResultPosted = Event()
        interfaces = type('IBattleResultsService', (object,), {})
        services = {interfaces: self.results_service}
        package('account_helpers', [])
        module('account_helpers.BattleResultsCache', load=self.results_cache.load, convertToFullForm=self.results_cache.convertToFullForm)
        sys.modules['account_helpers'].BattleResultsCache = sys.modules['account_helpers.BattleResultsCache']
        self.services = services
        module('helpers', dependency=type('Dependency', (object,), {'instance': staticmethod(lambda interface: services.get(interface))})(),
               getFullClientVersion=lambda: test.client_version)
        package('skeletons', [])
        package('skeletons.gui', [])
        module('skeletons.gui.battle_results', IBattleResultsService=interfaces)
        package('gui', [])
        self.result_messages = []
        system_messages = module('gui.SystemMessages', SM_TYPE=type('SM_TYPE', (object,), {'Information': 'info'}),
                                 pushMessage=lambda text, type=None: test.messages.append(text),
                                 pushMessagesFromResult=lambda result: test.result_messages.append(result.userMsg))
        sys.modules['gui'].SystemMessages = system_messages
        entry_dirs = [os.path.join(base, 'entry') for base in _support.source_dirs()]
        package('gui.mods', [path for path in entry_dirs if os.path.isdir(path)])
        package('gui.mods.otmetki', [_support.PACKAGES_DIR, _support.MODPACK_DIR])

    def load(self, entries):
        import importlib
        for name in entries:
            importlib.import_module('gui.mods.' + name)
        return sys.modules['gui.mods.otmetki.companion.app.client'].g_app

    def play_battle(self, app):
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        results = _support.battle_results()
        self.player = Player(ACCOUNT, results['arenaUniqueID'])
        self.events.onAvatarReady()
        self.events.onAvatarBecomeNonPlayer()
        self.events.onBattleResultsReceived(True, results)
        return results

    def test_any_load_order(self):
        for seed in range(4):
            self.tearDown()
            self.setUp()
            entries = list(ENTRY_MODULES)
            random.Random(seed).shuffle(entries)
            app = self.load(entries)
            registry = sys.modules['gui.mods.otmetki.core.registry'].registry()
            self.assertIs(registry.host, app, entries)
            self.assertEqual(sorted(registry.instances), sorted(REGISTERED), entries)

            results = self.play_battle(app)
            events = app.outbox.events
            battle = [event for event in events if event.get('type') == 'battle_result']
            self.assertEqual(len(battle), 1, entries)
            self.assertTrue(battle[0]['session_id'], entries)
            state = app.state_file.read({})
            self.assertEqual(state['seen_arenas'], [results['arenaUniqueID']])
            self.assertEqual(state['session']['totals']['battles'], 1)
            self.assertEqual(state['session']['session_id'], battle[0]['session_id'])
            self.assertTrue([text for text in self.messages if u'Сессия' in text or u'Session' in text], (entries, self.messages))

    def test_companion_alone(self):
        app = self.load(['mod_otmetki'])
        self.assertEqual(sys.modules['gui.mods.otmetki.core.registry'].registry().instances, {})
        self.play_battle(app)
        events = app.outbox.events
        battle = [event for event in events if event.get('type') == 'battle_result']
        self.assertEqual(len(battle), 1)
        self.assertIsNone(battle[0]['session_id'])
        self.assertNotIn('session', app.state_file.read({}))


    def install_hud_stubs(self):
        test = self
        self.components = {}
        self.sounds = []

        class GuiFlash(object):

            def createComponent(self, alias, kind, props, battle=True, lobby=False):
                test.components[alias] = dict(props, kind=kind, battle=battle, lobby=lobby)

            def updateComponent(self, alias, props):
                test.components[alias].update(props)

            def deleteComponent(self, alias):
                del test.components[alias]

        self.component_updated = Event()
        package('gui.mods.gambiter', [])
        sys.modules['gui.mods.gambiter'].g_guiFlash = GuiFlash()
        module('gui.mods.gambiter.flash', COMPONENT_TYPE=type('COMPONENT_TYPE', (object,), {'LABEL': 'Label'}),
               COMPONENT_EVENT=type('COMPONENT_EVENT', (object,), {'UPDATED': self.component_updated}))
        package('gui.battle_control', [])
        feedback_ids = dict((name, index + 100) for index, name in enumerate(HIT_STATES))
        module('gui.battle_control.battle_constants', FEEDBACK_EVENT_ID=type('FEEDBACK_EVENT_ID', (object,), feedback_ids),
               VEHICLE_VIEW_STATE=type('VEHICLE_VIEW_STATE', (object,), {'FIRE': 1, 'DEVICES': 2, 'HEALTH': 4, 'OBSERVED_BY_ENEMY': 4096,
                                                                          'SWITCHING': 16384}))
        module('constants', ARENA_PERIOD=type('ARENA_PERIOD', (object,), {'WAITING': 1, 'PREBATTLE': 2, 'BATTLE': 3, 'AFTERBATTLE': 4}))
        self.mp3 = []

        class Sound(object):

            def __init__(self, name):
                self.name = name

            def play(self):
                test.sounds.append('mp3:%s:%s' % (self.name, test.mp3[-1] if test.mp3 else None))

        module('SoundGroups', g_instance=type('Sounds', (object,), {'playSound2D': lambda sounds, name: test.sounds.append(name),
                                                                    'getSound2D': lambda sounds, name: Sound(name)})())
        module('WWISE', WW_prepareMP3=lambda name: test.mp3.append(name))
        return feedback_ids

    def enter_battle(self, results_arena, tank_id=None):
        session = BattleSession()
        self.player = Player(ACCOUNT, results_arena)
        if tank_id is not None:
            vehicle_type = type('VehicleType', (object,), {'compactDescr': tank_id})()
            self.player.vehicleTypeDescriptor = type('Descriptor', (object,), {'type': vehicle_type})()
        self.player.guiSessionProvider = session
        self.player.playerVehicleID = OWN_VEHICLE
        self.player.team = 1
        self.player.arena = session.arena
        self.events.onAvatarReady()
        return session

    def hud_components(self):
        return dict((alias.split('.')[-1], props) for alias, props in self.components.items() if alias.startswith('otmetki.hud.'))

    def test_battle_hud(self):
        ids = self.install_hud_stubs()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        app = self.load(list(ENTRY_MODULES))
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        hud = sys.modules['gui.mods.otmetki.core.client.hud'].hud_layer(app)
        hud.update_settings('sixth_sense', {'sound_event': 'otmetki_lamp'})
        sys.modules['gui.mods.otmetki.core.client.hud'].component_config(app).get('battle_sounds').update(
            {'fire': 'otmetki_fire', 'ammo_rack': 'otmetki_ammo', 'first_blood': 'otmetki_first_blood'})
        app.marks.hangar_moe[1] = {'tank_id': 1, 'damage_rating': 8600, 'moving_avg_damage': 2550, 'marks_on_gun': 2}

        results = _support.battle_results()
        session = self.enter_battle(results['arenaUniqueID'])
        feedback = session.feedback
        feedback.onVehicleFeedbackReceived(ids['VEHICLE_ARMOR_PIERCED'], ENEMY_VEHICLE, None)
        feedback.onPlayerFeedbackReceived([
            Feedback(kinds.DAMAGE, ENEMY_VEHICLE, Extra(390)),
            Feedback(kinds.DAMAGE, ALLY_VEHICLE, Extra(50)),
            Feedback(kinds.RADIO_ASSIST, ENEMY_VEHICLE, Extra(120)),
            Feedback(kinds.TANKING, ENEMY_VEHICLE, Extra(240)),
            Feedback(kinds.RECEIVED_DAMAGE, ENEMY_VEHICLE, Extra(310, 'HOLLOW_CHARGE')),
        ])
        feedback.onVehicleFeedbackReceived(ids['VEHICLE_HEALTH'], ENEMY_VEHICLE, (510, None, 0))
        feedback.onVehicleFeedbackReceived(ids['VEHICLE_RICOCHET'], ENEMY_VEHICLE, None)
        session.vehicle_state.onVehicleStateUpdated(4, 690)
        session.vehicle_state.onVehicleStateUpdated(1, True)
        session.vehicle_state.onVehicleStateUpdated(2, ('ammoBay', 'critical', 'critical'))
        session.vehicle_state.onVehicleStateUpdated(2, ('engine', 'repaired', 'critical'))
        session.vehicle_state.onVehicleStateUpdated(4096, True)
        session.arena.onVehicleKilled(ALLY_VEHICLE, ENEMY_VEHICLE, 0, 0, 1)

        panels = self.hud_components()
        self.assertEqual(sorted(panels), ['battle_clock', 'consumables', 'damage_log', 'hit_log', 'last_hit', 'main_gun', 'received_hits', 'reload_timer',
                                          'sixth_sense', 'team_hp'])
        self.assertTrue(all(props['kind'] == 'Label' and props['drag'] for props in panels.values()))
        damage_log = panels['damage_log']['text']
        self.assertIn('390', damage_log)
        self.assertIn('310', damage_log)
        self.assertNotIn(' 50 ', damage_log)
        feedback.onPlayerSummaryFeedbackReceived(Summary())
        self.assertIn('2 150', self.hud_components()['damage_log']['text'])
        hit_log = panels['hit_log']['text']
        self.assertIn('Pz. IV', hit_log)
        self.assertIn('390', hit_log)
        self.assertIn(u'\u0440\u0438\u043a\u043e\u0448\u0435\u0442', hit_log)
        self.assertIn('05:00', panels['battle_clock']['text'])
        team_hp = self.hud_components()['team_hp']['text']
        self.assertIn('690', team_hp)
        self.assertIn('510', team_hp)
        self.assertIn('0 : 1', team_hp)
        self.assertEqual(self.sounds, ['otmetki_fire', 'otmetki_ammo', 'otmetki_lamp', 'otmetki_first_blood'])
        session.vehicle_state.onVehicleStateUpdated(4096, False)
        self.assertNotIn('sixth_sense', self.hud_components())

        self.component_updated('otmetki.hud.damage_log', {'x': 111, 'y': 222})
        saved = _support.load_json(os.path.join(app.config_dir, 'components.json'))
        self.assertEqual((saved['damage_log']['x'], saved['damage_log']['y']), (111, 222))
        self.assertEqual(saved['sixth_sense']['sound_event'], 'otmetki_lamp')

        self.events.onAvatarBecomeNonPlayer()
        self.assertEqual(self.hud_components(), {})
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        self.events.onBattleResultsReceived(True, results)
        battle = [event for event in app.outbox.events if event['type'] == 'battle_result'][-1]
        self.assertEqual(battle['shots'], [{'damage': 390, 'nominal': None, 'shell': 'armor_piercing', 'outcome': 'damage', 'distance_m': None,
                                            'fatal': False}])
        summary = [text for text in self.messages if u'87.12%' in text]
        self.assertTrue(summary, self.messages)
        self.assertIn('+1.12%', summary[0])
        self.assertIn('2 150', summary[0])

    def test_hud_edit_previews_in_hangar(self):
        self.install_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        app.config.update({'battle_team_hp': False})
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        described = {}

        def collect(panel_id, preview=None, width=None, height=None, enabled=False):
            described.update({panel_id: (preview, width, enabled)})

        app.bus.emit('hud_describe', collect)
        self.assertEqual(sorted(described), ['battle_clock', 'battle_efficiency', 'battle_loadout', 'consumables', 'crosshair', 'damage_log',
                                             'death_card', 'gun_arc', 'hangar_marks', 'hit_log', 'last_hit', 'main_gun', 'marks_panel', 'personal_best',
                                             'personal_missions', 'received_hits', 'reload_timer', 'session_goals', 'sixth_sense', 'team_hp'])
        self.assertFalse(described['team_hp'][2])
        self.assertTrue(described['damage_log'][2])
        self.assertIn('390', described['damage_log'][0])
        app.bus.emit('hud_edit', True)
        panels = self.hud_components()
        self.assertEqual(sorted(panels), ['battle_clock', 'battle_efficiency', 'battle_loadout', 'consumables', 'damage_log', 'death_card',
                                          'gun_arc', 'hangar_marks', 'hit_log', 'last_hit', 'main_gun', 'marks_panel', 'personal_best', 'personal_missions',
                                          'received_hits', 'reload_timer', 'session_goals', 'sixth_sense'])
        self.assertTrue(all(props['lobby'] and not props['battle'] for props in panels.values()))
        self.assertIn('Pz. IV', panels['hit_log']['text'])
        app.bus.emit('hud_edit', False)
        self.assertEqual(self.hud_components(), {})
        app.bus.emit('hud_edit', True)
        self.enter_battle(1)
        self.assertNotIn('390', self.hud_components().get('damage_log', {}).get('text', ''))
        self.assertNotIn('sixth_sense', self.hud_components())

    def test_own_feedback_after_death_and_hp_only_from_own_shots(self):
        ids = self.install_hud_stubs()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        session = self.enter_battle(1)
        own = session.dp.getVehicleInfo(OWN_VEHICLE)
        ally = session.dp.getVehicleInfo(ALLY_VEHICLE)
        session.feedback.onVehicleFeedbackReceived(ids['VEHICLE_ARMOR_PIERCED'], ENEMY_VEHICLE, None)
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.DAMAGE, ENEMY_VEHICLE, Extra(390))])
        hit_log = sys.modules['gui.mods.otmetki.core.registry'].registry().get('hit_log').log
        session.feedback.onVehicleFeedbackReceived(ids['VEHICLE_HEALTH'], ENEMY_VEHICLE, (480, ally, 0))
        self.assertIsNone(hit_log.entries[-1]['hp'])
        session.feedback.onVehicleFeedbackReceived(ids['VEHICLE_HEALTH'], ENEMY_VEHICLE, (510, own, 0))
        self.assertEqual(hit_log.entries[-1]['hp'], 510)
        session.vehicle_state.getControllingVehicleID = lambda: ALLY_VEHICLE
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.RADIO_ASSIST, ENEMY_VEHICLE, Extra(640))])
        self.assertIn('640', self.hud_components()['damage_log']['text'])
        self.assertTrue(app.config.get('battle_damage_log'))

    def install_client_class_stubs(self):
        test = self
        self.chat = []
        self.notifications = []

        class BattleLayout(object):

            def addMessage(self, message, doFormatting=True):
                test.chat.append(self._formatMessage(message, doFormatting)[1])
                return True

            def addCommand(self, command):
                test.chat.append('command:%s' % command.getSenderID())

        class ChannelController(BattleLayout):

            def _formatMessage(self, message, doFormatting=True):
                return False, message.text

        class NotificationsModel(object):

            def addNotification(self, notification):
                test.notifications.append(notification.getType())

        for name in ('messenger', 'messenger.gui', 'messenger.gui.Scaleform', 'messenger.gui.Scaleform.channels',
                     'messenger.gui.Scaleform.channels.bw_chat2', 'messenger.ext', 'notification'):
            package(name, [])
        module('messenger.gui.Scaleform.channels.layout', BattleLayout=BattleLayout)
        module('messenger.gui.Scaleform.channels.bw_chat2.battle_controllers', _ChannelController=ChannelController)
        module('messenger.ext.player_helpers', isCurrentPlayer=lambda session_id: session_id == 'me')
        module('notification.NotificationsModel', NotificationsModel=NotificationsModel)
        module('notification.settings', NOTIFICATION_TYPE=type('NOTIFICATION_TYPE', (object,), {'MESSAGE': 1, 'NOTIFY_CENTER_POP_UP': 4,
                                                                                               'RECRUIT_REMINDER': 13, 'AUCTION_STAGE_START': 19,
                                                                                               'TRADING_CARAVAN_REFILL': 19}))
        return ChannelController, NotificationsModel

    def test_chat_filter_and_notification_filter(self):
        self.install_hud_stubs()
        controller_class, model_class = self.install_client_class_stubs()
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        model = model_class()
        for kind in (1, 4, 13):
            model.addNotification(type('Notification', (object,), {'getType': lambda item, kind=kind: kind})())
        self.assertEqual(self.notifications, [1, 13])
        for decorator in ('IntegratedAuctionStageStartDecorator', 'TradingCaravanRefillDecorator'):
            model.addNotification(type(decorator, (object,), {'getType': lambda item: 19})())
        self.assertEqual(self.notifications, [1, 13, 19])

        self.enter_battle(1)
        chat = controller_class()

        def message(sender, text):
            return type('Message', (object,), {'avatarSessionID': sender, 'text': text})()

        command = type('Command', (object,), {'isSender': lambda item: False, 'getSenderID': lambda item: 'spammer'})()
        for _ in range(3):
            chat.addMessage(message('spammer', u'ALL TO BASE'))
            chat.addMessage(message('me', u'ALL TO BASE'))
        for _ in range(6):
            chat.addCommand(command)
        texts = [text for text in self.chat if not text.startswith('command:')]
        self.assertEqual(len(texts), 4)
        self.assertTrue(all(u'ALL TO BASE' in text and '[' in text for text in texts))
        self.assertEqual(len([text for text in self.chat if text.startswith('command:')]), 4)

        self.events.onAvatarBecomeNonPlayer()
        del self.chat[:]
        chat.addMessage(message('spammer', u'after battle'))
        self.assertEqual(self.chat, [u'after battle'])
        app.config.update({'hangar_notification_filter': False})
        model.addNotification(type('Notification', (object,), {'getType': lambda item: 4})())
        self.assertEqual(self.notifications, [1, 13, 19, 4])

    def test_new_features_have_cards_and_pages(self):
        self.install_hud_stubs()
        self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        instances = sys.modules['gui.mods.otmetki.core.registry'].registry().instances
        for feature_id in ('marks_history', 'battle_results', 'auto_resupply'):
            self.assertTrue(instances[feature_id].ui_actions(), feature_id)
        self.assertEqual(instances['marks_history'].ui_page()['rows'], [])
        self.assertEqual(instances['battle_results'].ui_page()['rows'], [])
        self.events.onBattleResultsReceived(True, _support.battle_results())
        rows = instances['battle_results'].ui_page()['rows']
        self.assertEqual([row['id'] for row in rows][0], 'session')
        self.assertTrue(rows[1]['details'])
        refusal = instances['auto_resupply'].ui_action('apply_selected')
        self.assertEqual(refusal['kind'], 'error')
        instances['hangar_info'].render(SERVER_TIME)
        self.assertIn('otmetki.hangar_info', self.components)

    def test_hangar_ratings_reads_only_the_bound_account(self):
        self.install_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.vehicle.item = type('Vehicle', (object,), {'intCD': 1})()
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        reads = dict((url.rsplit('/', 1)[-1], (headers, body, callback)) for method, url, headers, body, callback in self.fetches
                     if method == 'POST' and '/mod/me/' in url)
        self.assertEqual(sorted(reads), ['goals', 'overview', 'tanks'])
        self.assertEqual(len([fetch for fetch in self.fetches if fetch[1].endswith('/mod/me/tanks')]), 1)
        for headers, body, callback in reads.values():
            self.assertTrue(headers['X-Otmetki-Signature'].startswith('sha256='))
            self.assertEqual(json.loads(body)['account_id'], ACCOUNT)
        self.assertEqual(json.loads(reads['tanks'][1])['tank_ids'], [1])
        for name, key in (('overview', 'ratings-overview.example.json'), ('tanks', 'ratings-tanks.example.json')):
            answer = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', key))
            answer['account_id'] = ACCOUNT
            reads[name][2](Response(200, json.dumps(answer).encode('utf-8')))
        text = self.components['otmetki.hangar_ratings']['text']
        self.assertIn('WN8', text)
        self.assertIn(u'★★', text)
        self.enter_battle(1)
        self.assertNotIn('otmetki.hangar_ratings', self.components)

    def test_battle_hud_extras_from_own_controllers(self):
        ids = self.install_hud_stubs()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        session = self.enter_battle(1)
        panels = self.hud_components()
        self.assertIn(u'Аптечка', panels['consumables']['text'])
        self.assertIn(u'Ремкомплект 12 с', panels['consumables']['text'])
        self.assertIn(u'ББ 32', panels['consumables']['text'])
        self.assertIn(u'Кассета 3/4', panels['reload_timer']['text'])
        self.assertNotIn(u'Перезарядка', panels['reload_timer']['text'])
        self.assertIn(u'0 / 1 000', panels['main_gun']['text'])

        ammo = session.shared.ammo
        ammo.onGunReloadTimeSet(11, ReloadSnapshot(5.5, 7.8), False)
        self.assertIn(u'Перезарядка 5.5 с', self.hud_components()['reload_timer']['text'])
        ammo.onShellsUpdated(11, 31, 2, 0)
        ammo.onShellsUpdated(12, 5, 0, 0)
        self.assertIn(u'Кассета 2/4', self.hud_components()['reload_timer']['text'])
        session.shared.equipments.items[0][1].quantity = 0
        session.shared.equipments.onEquipmentUpdated(501, session.shared.equipments.items[0][1])
        self.assertIn(u'Аптечка ×0', self.hud_components()['consumables']['text'])

        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.DAMAGE, ENEMY_VEHICLE, Extra(390))])
        session.feedback.onVehicleFeedbackReceived(ids['VEHICLE_HEALTH'], ENEMY_VEHICLE, (510, None, 0))
        self.assertIn(u'390 / 1 000', self.hud_components()['main_gun']['text'])
        self.assertIn(u'урон команды 390', self.hud_components()['main_gun']['text'])

        self.clock[0] = 200.0
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.RECEIVED_DAMAGE, ALLY_VEHICLE, Extra(140, 'HIGH_EXPLOSIVE', reason='ram'))])
        last_hit = self.hud_components()['last_hit']['text']
        self.assertIn(u'KV-1 −140', last_hit)
        self.assertIn(u'таран', last_hit)
        self.assertIn('class_heavy_32.png', last_hit)
        self.clock[0] = 201.0
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.RECEIVED_DAMAGE, ENEMY_VEHICLE, Extra(300, 'ARMOR_PIERCING'))])
        session.vehicle_state.onVehicleStateUpdated(2, ('ammoBay', 'critical', 'critical'))
        self.assertIn(u'боеукладка', self.hud_components()['last_hit']['text'])
        self.assertIn(u'боеукладка', self.hud_components()['damage_log']['text'])
        self.events.onAvatarBecomeNonPlayer()
        self.assertEqual(self.hud_components(), {})

    def install_round_four_stubs(self):
        test = self
        self.key_down = Event()
        self.hit_directions = []
        module('Keys', KEY_H=35, KEY_LCONTROL=29, KEY_LSHIFT=42)
        sys.modules['gui'].InputHandler = type('InputHandler', (object,), {'g_instance': type('Input', (object,), {'onKeyDown': self.key_down})()})
        sys.modules['BigWorld'].isKeyDown = lambda key: True

        class PlayerAvatar(object):
            # RU 1.45 Avatar.PlayerAvatar: the server's call behind the game's own hit direction indicator.

            def showOwnVehicleHitDirection(self, hit_yaw, *args):
                test.hit_directions.append(hit_yaw)

        module('Avatar', PlayerAvatar=PlayerAvatar)

        class Item(object):

            def __init__(self, name, categories=()):
                self.userName = name
                self.icon = '../maps/icons/artefact/%s.png' % name
                self.descriptor = type('Descriptor', (object,), {'categories': set(categories)})()

        def slot(*categories):
            return type('Slot', (object,), {'categories': set(categories)})()

        devices = type('Layout', (object,), {'installed': [Item('rammer', ['firepower']), Item('vents', ['survivability']), None],
                                             'slots': [slot('firepower'), slot('mobility'), slot('firepower')]})()
        boosters = type('Layout', (object,), {'installed': [Item('brotherhood')]})()
        self.vehicle.item = type('Vehicle', (object,), {'intCD': 1, 'optDevices': devices, 'battleBoosters': boosters, 'descriptor': None})()
        return PlayerAvatar

    def test_round_four_battle_panels_and_streamer_hotkey(self):
        self.install_hud_stubs()
        avatar = self.install_round_four_stubs()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        session = self.enter_battle(1, tank_id=1)
        loadout = self.hud_components()['battle_loadout']['text']
        self.assertIn('img://gui/maps/icons/artefact/rammer.png', loadout)
        self.assertIn('brotherhood.png', loadout)
        self.assertEqual(loadout.count(u'★'), 1)

        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.RECEIVED_DAMAGE, ENEMY_VEHICLE, Extra(310)),
                                                   Feedback(kinds.TANKING, ALLY_VEHICLE, Extra(200, SHELL_TYPES.HE_MODERN))])
        hits = self.hud_components()['received_hits']['text']
        self.assertIn(u'Pz. IV', hits)
        self.assertIn(u'не пробил, заблокировано 200', hits)
        avatar().showOwnVehicleHitDirection(3.1)
        self.assertEqual(self.hit_directions, [3.1])
        session.vehicle_state.onVehicleStateUpdated(2, ('engine', 'critical', 'critical'))
        self.assertNotIn('death_card', self.hud_components())
        session.arena.onVehicleKilled(OWN_VEHICLE, ENEMY_VEHICLE, 0, 0)
        card = self.hud_components()['death_card']['text']
        self.assertIn(u'Вас уничтожил: СТ Pz. IV', card)
        self.assertIn(u'урон 310', card)
        self.assertIn(u'двигатель', card)

        self.key_down(type('KeyEvent', (object,), {'key': 35})())
        self.assertEqual(self.hud_components(), {})
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.TANKING, ALLY_VEHICLE, Extra(100))])
        self.assertEqual(self.hud_components(), {})
        self.key_down(type('KeyEvent', (object,), {'key': 35})())
        self.assertIn(u'заблокировано 100', self.hud_components()['received_hits']['text'])
        self.assertIn('death_card', self.hud_components())
        self.events.onAvatarBecomeNonPlayer()
        self.assertEqual(self.hud_components(), {})

    def install_round_five_stubs(self):
        test = self
        self.key_down = Event()
        self.shots = []
        module('Keys', KEY_B=48, KEY_LCONTROL=29, KEY_LSHIFT=42)
        sys.modules['gui'].InputHandler = type('InputHandler', (object,), {'g_instance': type('Input', (object,), {'onKeyDown': self.key_down})()})
        big_world = sys.modules['BigWorld']
        big_world.isKeyDown = lambda key: True

        class Area(object):
            # RU 1.45 BigWorld.PyTerrainSelectedArea as CombatSelectedArea sets it up.

            def setup(self, visual, size, height, color):
                self.args = (visual, size, height, color)

            def enableAccurateCollision(self, value):
                pass

            def setCutOffDistance(self, value):
                pass

        class Node(object):

            def __init__(self):
                self.items = []

            def attach(self, item):
                self.items.append(item)

        class Model(object):

            def __init__(self, path):
                self.root = Node()
                self.motors = []

            def node(self, name):
                return self.root

            def addMotor(self, motor):
                self.motors.append(motor)

        class Vehicle(object):
            # RU 1.45 Vehicle.Vehicle: the client draws the effects of every shot on a vehicle through showDamageFromShot.

            def __init__(self, own):
                self.isPlayerVehicle = own
                self.matrix = 'own-matrix' if own else 'other-matrix'

            def showDamageFromShot(self, attacker_id, points, effects_index, damage_factor, last_material_is_shield):
                test.shots.append(attacker_id)

        big_world.Model = Model
        big_world.PyTerrainSelectedArea = Area
        big_world.Servo = lambda matrix: ('servo', matrix)
        self.own_vehicle = Vehicle(True)
        big_world.entity = lambda vehicle_id: self.own_vehicle if vehicle_id == OWN_VEHICLE else None
        module('Math', Vector2=lambda x, y: (x, y))
        module('Vehicle', Vehicle=Vehicle)
        config = {'miscParams': {'projectileSpeedFactor': 0.8}}
        package('items', []).vehicles = module('items.vehicles', g_cache=type('Cache', (object,), {'commonConfig': config})())
        return Vehicle

    def enter_battle_with_gun(self, yaw_limits):
        session = BattleSession()
        self.player = Player(ACCOUNT, 4242)
        self.player.vehicleTypeDescriptor = type('Descriptor', (object,), {'gun': type('Gun', (object,), {'turretYawLimits': yaw_limits})()})()
        self.player.gunRotator = type('GunRotator', (object,), {'turretYaw': 0.0})()
        self.player.guiSessionProvider = session
        self.player.playerVehicleID = OWN_VEHICLE
        self.player.team = 1
        self.player.arena = session.arena
        self.events.onAvatarReady()
        return session

    def test_round_five_battle_wounds_traverse_circle_and_shell_stats(self):
        self.install_hud_stubs()
        vehicle = self.install_round_five_stubs()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        sys.modules['gui.mods.otmetki.core.client.hud'].hud_layer(app).update_settings('consumables', {'show_shell_stats': True})
        instances = sys.modules['gui.mods.otmetki.core.registry'].registry().instances
        self.vehicle.item = type('Vehicle', (object,), {'intCD': 1, 'name': 'ussr:R04_T-34'})()
        self.assertEqual(instances['hangar_info'].ui_actions()[0]['link'], '/t/r04-t-34/armor')
        self.vehicle.item = None

        session = self.enter_battle_with_gun((-0.26, 0.26))
        consumables = self.hud_components()['consumables']['text']
        self.assertIn(u'258 мм', consumables)
        self.assertIn(u'урон 390', consumables)
        self.assertIn(u'1 000 м/с', consumables)
        session.shared.ammo.onCurrentShellChanged(12)
        self.assertIn(u'480', self.hud_components()['consumables']['text'])

        self.player.gunRotator.turretYaw = 0.2
        instances['gun_arc'].render()
        arc = self.hud_components()['gun_arc']['text']
        self.assertIn(u'УГН', arc)
        self.assertIn(u'◄ 26°', arc)
        self.assertIn(u'3° ►', arc)

        self.assertEqual(self.player.models, [])
        self.key_down(type('KeyEvent', (object,), {'key': 48})())
        circle = self.player.models[0]
        self.assertEqual(circle.root.items[0].args, ('content/Interface/CheckPoint/CheckPoint.visual', (30.0, 30.0), 0.5, 0xFFFFFFFF))
        self.assertEqual(circle.motors, [('servo', 'own-matrix')])
        self.key_down(type('KeyEvent', (object,), {'key': 48, 'isRepeatedEvent': lambda event: True})())
        self.assertEqual(self.player.models, [circle])
        self.key_down(type('KeyEvent', (object,), {'key': 48})())
        self.assertEqual(self.player.models, [])
        self.key_down(type('KeyEvent', (object,), {'key': 48})())
        session.arena.onVehicleKilled(OWN_VEHICLE, ENEMY_VEHICLE, 0, 0)
        self.assertEqual(self.player.models, [])

        front_hull_pen = 4 | (1 << 8) | (120 << 16) | (100 << 24) | (250 << 32) | (130 << 40) | (110 << 48) | (255 << 56)
        self.own_vehicle.showDamageFromShot(ENEMY_VEHICLE, [front_hull_pen], 0, 1.0, False)
        vehicle(False).showDamageFromShot(ENEMY_VEHICLE, [front_hull_pen], 0, 1.0, False)
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.RECEIVED_DAMAGE, ENEMY_VEHICLE, Extra(390))])
        self.assertEqual(self.shots, [ENEMY_VEHICLE, ENEMY_VEHICLE])
        self.assertNotIn('otmetki.battle_hits', self.components)
        self.events.onAvatarBecomeNonPlayer()
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        label = self.components['otmetki.battle_hits']['text']
        self.assertIn(u'Боевые раны · T-34', label)
        self.assertIn(u'Попаданий 1', label)
        rows = instances['battle_hits'].ui_page()['rows']
        self.assertEqual(rows[0]['id'], '4242')
        self.assertEqual(rows[0]['details'][1]['value'], u'Корпус, лоб · пробитие · −390 · Pz. IV')
        self.assertEqual([mark['tone'] for mark in rows[0]['figure']['marks']], ['pen'])
        self.assertTrue(os.path.isfile(os.path.join(app.config_dir, 'battle_hits_%d.json' % ACCOUNT)))
        instances['battle_hits'].ui_action('clear', '4242')
        self.assertEqual(instances['battle_hits'].ui_page()['rows'], [])
        self.assertNotIn('otmetki.battle_hits', self.components)

    def test_bush_circle_leaves_with_the_battle_it_was_drawn_in(self):
        self.install_hud_stubs()
        self.install_round_five_stubs()
        self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        self.enter_battle_with_gun(None)
        avatar = self.player
        self.key_down(type('KeyEvent', (object,), {'key': 48})())
        self.assertEqual(len(avatar.models), 1)
        self.player = Player(ACCOUNT)
        self.events.onAvatarBecomeNonPlayer()
        self.assertEqual(avatar.models, [])
        self.key_down(type('KeyEvent', (object,), {'key': 48})())
        self.assertEqual(self.player.models, [])

    def test_round_four_hangar_helpers_and_private_mode(self):
        self.install_hud_stubs()
        self.install_round_four_stubs()
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        instances = sys.modules['gui.mods.otmetki.core.registry'].registry().instances
        self.assertEqual(instances['personal_missions'].ui_page()['rows'], [])
        self.assertNotIn('otmetki.personal_missions', self.components)
        app.ui.show('otmetki.session', 'mine', {'x': 0, 'y': 0, 'alignX': 'right', 'alignY': 'top'})
        sys.modules['gui.mods.otmetki.core.client.hud'].component_config(app).get('streamer_mode').update({'private': True})
        app.bus.emit('component_settings', 'streamer_mode', ['private'])
        self.assertNotIn('otmetki.session', self.components)
        sys.modules['gui.mods.otmetki.core.client.hud'].component_config(app).get('streamer_mode').update({'private': False})
        app.bus.emit('component_settings', 'streamer_mode', ['private'])
        self.assertEqual(self.components['otmetki.session']['text'], 'mine')
        for step in range(3):
            results = _support.battle_results()
            results['arenaUniqueID'] = 900 + step
            results['common']['winnerTeam'] = 2
            self.events.onBattleResultsReceived(True, results)
        self.assertTrue([text for text in self.messages if u'поражений подряд' in text], self.messages)

    def install_site_vehicle(self):
        test = self

        class Stats(object):
            # RU 1.45 gui/shared/gui_items/dossier/stats.py: the random-battle max records of a vehicle dossier.

            def getMaxDamage(self):
                return 2000

            def getMaxAssisted(self):
                return 3000

            def getMaxFrags(self):
                return 4

            def getMaxXp(self):
                return 1100

        dossier = type('Dossier', (object,), {'getRandomStats': lambda item: Stats()})()
        self.vehicle.item = type('Vehicle', (object,), {'intCD': 1, 'name': 'ussr:R04_T-34', 'level': 5, 'crew': []})()
        self.vehicle.getDossier = lambda: dossier
        return test

    def answer(self, name, data):
        for method, url, headers, body, callback in list(self.fetches):
            if method == 'POST' and url.endswith('/mod/me/' + name):
                self.fetches.remove((method, url, headers, body, callback))
                callback(Response(200, json.dumps(data).encode('utf-8')))

    def site_rows(self):
        tanks = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'ratings-tanks.example.json'))
        goals = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'goals.example.json'))
        tanks['account_id'] = goals['account_id'] = ACCOUNT
        return tanks, goals

    def test_records_goals_and_efficiency_from_the_site(self):
        self.install_hud_stubs()
        self.install_site_vehicle()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        app = self.load(list(ENTRY_MODULES))
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()

        def failing_listener(tank_id):
            raise RuntimeError('listener')

        sys.modules['gui.mods.otmetki.core.client.me'].tank_ratings(app).listeners.insert(0, failing_listener)
        tanks, goals = self.site_rows()
        self.answer('tanks', tanks)
        self.answer('goals', goals)
        instances = sys.modules['gui.mods.otmetki.core.registry'].registry().instances
        self.assertEqual(instances['personal_best'].book.get(1), {'damage': 6812, 'assist': 5120, 'frags': 6, 'xp': 2740})
        self.assertIn(u'Ср. урон 3 000', self.components['otmetki.session_goals']['text'])
        self.assertEqual(self.sounds, [])

        session = self.enter_battle(1, tank_id=1)
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.DAMAGE, ENEMY_VEHICLE, Extra(1500)), Feedback(kinds.SPOTTED, ENEMY_VEHICLE, None),
                                                   Feedback(kinds.KILL, ENEMY_VEHICLE, None)])
        panels = self.hud_components()
        self.assertIn(u'осталось 5 312', panels['personal_best']['text'])
        self.assertIn(u'WN8 боя', panels['battle_efficiency']['text'])
        self.assertIn(u'Урон 1 500 / ср. 1 20', panels['battle_efficiency']['text'])
        self.assertIn(u'Ср. урон 3 000: нужно', panels['session_goals']['text'])
        self.assertNotIn('otmetki.session_goals', self.components)
        self.events.onAvatarBecomeNonPlayer()

        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        results = _support.battle_results()
        results['personal'][1]['damageDealt'] = 7050
        self.events.onBattleResultsReceived(True, results)
        card = [text for text in self.messages if u'новый рекорд' in text]
        self.assertTrue(card, self.messages)
        self.assertIn(u'урон 7 050 (было 6 812)', card[0])
        self.assertEqual(self.sounds, ['mp3:sixthSense:otmetki_record.mp3'])
        stored = _support.load_json(os.path.join(app.config_dir, 'personal_best_%d.json' % ACCOUNT))
        self.assertEqual(stored['tanks']['1']['damage'], 7050)

        for step in range(1, 30):
            app.bus.emit('tick', time.time() + step * 5)
        done = dict(goals['goals'][0], current=3050.0, status='achieved')
        self.answer('goals', dict(goals, goals=[done]))
        self.assertTrue([text for text in self.messages if u'цель выполнена' in text], self.messages)
        self.assertEqual(self.sounds[-1], 'mp3:sixthSense:otmetki_goal.mp3')

    def test_replay_analysis_notice_and_session_share(self):
        self.install_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        replay_id = '0f8e2d4c-6b1a-4f3e-9d2c-7a5b3c1d9e8f'
        app.bus.emit('replay_uploaded', '777', replay_id)
        app.bus.emit('tick', time.time() + 120)
        polls = [fetch for fetch in self.fetches if fetch[1].endswith('/mod/me/replays')]
        self.assertEqual(len(polls), 1)
        self.assertEqual(json.loads(polls[0][3])['replay_ids'], [replay_id])
        answer = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'replay-analysis.example.json'))
        answer['account_id'] = ACCOUNT
        polls[0][4](Response(200, json.dumps(answer).encode('utf-8')))
        self.assertTrue([text for text in self.messages if u'разбор реплея готов' in text and u'точность 83%' in text], self.messages)

        instances = sys.modules['gui.mods.otmetki.core.registry'].registry().instances
        stats = instances['session_stats']
        self.assertEqual(stats.ui_actions(), [])
        self.assertFalse([fetch for fetch in self.fetches if '/mod/me/session-share' in fetch[1]])
        app.config.update({'share_session_report': True, 'share_session_channel': 'both'})
        app.bus.emit('component_settings', 'session_stats', ['share_session_report'])
        shares = [fetch for fetch in self.fetches if fetch[1].endswith('/mod/me/session-share')]
        self.assertEqual(json.loads(shares[0][3])['channels'], ['telegram', 'discord'])
        shares[0][4](Response(200, b'{}'))
        self.assertEqual(app.state_file.read({})['session_share_synced'], [True, 'both'])
        self.assertEqual(stats.ui_action('share_now')['kind'], 'error')
        self.events.onBattleResultsReceived(True, _support.battle_results())
        self.assertEqual(stats.ui_action('share_now')['kind'], 'info')
        sent = [fetch for fetch in self.fetches if fetch[1].endswith('/mod/me/session-share/send')]
        self.assertEqual(json.loads(sent[0][3])['session_id'], stats.session.session_id)

        app.config.update({'share_session_channel': 'discord'})
        app.bus.emit('component_settings', 'session_stats', ['share_session_channel'])
        shares = [fetch for fetch in self.fetches if fetch[1].endswith('/mod/me/session-share')]
        shares[-1][4](Response(409, b'{"error":"channel_not_linked"}'))
        self.assertTrue([text for text in self.messages if u'привяжите выбранный канал' in text], self.messages)
        app.bus.emit('tick', time.time() + 3600)
        self.assertEqual(len([fetch for fetch in self.fetches if fetch[1].endswith('/mod/me/session-share')]), len(shares))

    def install_customization_stubs(self):
        test = self
        self.outfits = []

        class OutfitApplier(object):

            def __init__(self, vehicle, outfit_data):
                self.vehicle, self.outfit_data = vehicle, outfit_data

            def request(self, callback):
                test.outfits.append(self.outfit_data)
                callback(type('Result', (object,), {'success': True, 'userMsg': 'style removed'})())

        module('gui.shared.gui_items.processors.common', OutfitApplier=OutfitApplier)
        package('items.components', [])
        module('items.components.c11n_constants', SeasonType=type('SeasonType', (object,), {'ALL': 7}))
        module('items.customizations', CustomizationOutfit=lambda: 'empty-component')
        package('vehicle_outfit', [])
        module('vehicle_outfit.outfit', Outfit=lambda component=None, vehicleCD=None: ('outfit', component, vehicleCD))

    def test_hangar_small_wins(self):
        self.install_hud_stubs()
        device_class, vehicle_class = self.install_garage_stubs()
        self.install_customization_stubs()
        self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        instances = sys.modules['gui.mods.otmetki.core.registry'].registry().instances
        vehicle = self.vehicle.item
        vehicle.descriptor.makeCompactDescr = lambda: 'cd-1'
        tweaks = instances['hangar_tweaks']
        self.assertEqual(tweaks.ui_action('remove_style')['text'], tweaks.app.translate('hangar_tweaks_refused_nothing'))
        vehicle.isStyleInstalled = True
        self.assertEqual(instances['hangar_tweaks'].ui_action('remove_style')['kind'], 'info')
        self.assertEqual(self.outfits, [((('outfit', 'empty-component', 'cd-1'), 7),)])
        self.assertEqual(self.result_messages, ['style removed'])

        class Tankman(object):

            def __init__(self, cost, role):
                self.cost, self.roleUserName = cost, role

            def getNextSkillXpCost(self):
                return self.cost

        levels = {'ussr:R04_T-34': (5, 7)}
        lobby = type('ILobbyContext', (object,), {})
        self.services[lobby] = type('LobbyContext', (object,), {'getServerSettings': lambda context: type('Settings', (object,), {
            'getRandomBattleLevelsForDemonstrator': lambda settings: levels})()})()
        module('skeletons.gui.lobby_context', ILobbyContext=lobby)
        vehicle.name, vehicle.type, vehicle.level, vehicle.isElite = 'ussr:R04_T-34', 'mediumTank', 5, True
        vehicle.shortUserName = u'Т-34'
        vehicle.crew = [(0, Tankman(0, u'Командир')), (1, Tankman(8400, u'Наводчик')), (2, None)]
        instances['hangar_info'].render(SERVER_TIME)
        text = self.components['otmetki.hangar_info']['text']
        self.assertIn(u'Т-34', text)
        self.assertIn(u'бои 5–7 ур.', text)
        self.assertIn(u'до навыка 8 400 опыта (Наводчик)', text)
        self.assertIn(u'ускоренное обучение', text)

    def leave_battle_early(self, app):
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        results = _support.battle_results()
        self.player = Player(ACCOUNT, results['arenaUniqueID'])
        self.player.battleResultsCache = self.results_cache
        self.events.onAvatarReady()
        self.events.onAvatarBecomeNonPlayer()
        self.player = Player(ACCOUNT)
        self.player.battleResultsCache = self.results_cache
        self.events.onAccountShowGUI()
        return results

    def battle_events(self, app):
        return [event for event in app.outbox.events if event.get('type') == 'battle_result']

    def test_early_exit_results_come_from_the_game_own_request(self):
        app = self.load(['mod_otmetki'])
        results = self.leave_battle_early(app)
        for step in range(40):
            app.battles.poll_pending_results(SERVER_TIME + 100 * step)
        self.assertEqual(self.results_cache.server_requests, [])
        self.assertEqual((app.battles.pending_arenas, app.battles.shots_by_arena, app.battles.queue_wait_by_arena), ([], {}, {}))
        self.assertEqual(self.battle_events(app), [])
        self.results_cache.get(results['arenaUniqueID'], lambda code, data: None)
        self.assertEqual(self.results_cache.server_requests, [results['arenaUniqueID']])
        self.results_cache.saved[(self.player.name, results['arenaUniqueID'])] = results
        self.results_service.onResultPosted(type('ReusableInfo', (object,), {'arenaUniqueID': results['arenaUniqueID']})(), None, None)
        self.assertEqual(len(self.battle_events(app)), 1)
        self.assertEqual(self.results_cache.server_requests, [results['arenaUniqueID']])

    def test_early_exit_results_are_read_from_the_disk_cache(self):
        app = self.load(['mod_otmetki'])
        results = self.leave_battle_early(app)
        self.results_cache.saved[(self.player.name, results['arenaUniqueID'])] = results
        app.battles.poll_pending_results(SERVER_TIME)
        self.assertEqual(len(self.battle_events(app)), 1)
        self.assertEqual(self.results_cache.server_requests, [])
        self.assertEqual(app.battles.pending_arenas, [])

    def install_garage_stubs(self):
        test = self
        self.processors = []

        class Device(object):

            def __init__(self, name):
                self.name = name
                self.isRemovable = True
                self.intCD = len(name)

        class Vehicle(object):

            def __init__(self, devices):
                self.invID = 7
                self.intCD = 1
                self.optDevices = type('OptDevices', (object,), {'installed': list(devices)})()
                self.crew = []
                self.lastCrew = None
                self.descriptor = type('Descriptor', (object,), {'modifications': [11, 12]})()

        class InstallerProcessor(object):

            def __init__(self, vehicle, item, slotIdx, install=True):
                self.vehicle, self.item, self.slot, self.install = vehicle, item, slotIdx, install

            def request(self, callback):
                test.processors.append((self, callback))

        class Items(object):

            def __init__(self):
                self.vehicle = Vehicle([Device('rammer'), Device('vents'), None])
                self.free_berths = 0

            def getVehicle(self, inv_id):
                return self.vehicle if inv_id == self.vehicle.invID else None

            def freeTankmenBerthsCount(self):
                return self.free_berths

        self.items = Items()
        items_cache = type('IItemsCache', (object,), {})
        self.services[items_cache] = type('ItemsCache', (object,), {'items': self.items})()
        package('skeletons.gui.shared', [])
        sys.modules['skeletons.gui.shared'].IItemsCache = items_cache
        for name in ('gui.shared', 'gui.shared.gui_items', 'gui.shared.gui_items.processors'):
            package(name, [])
        module('gui.shared.gui_items.processors.module',
               getInstallerProcessor=lambda vehicle, item, slotIdx, install=True: InstallerProcessor(vehicle, item, slotIdx, install))
        modifications = {11: type('Modification', (object,), {'name': 'mod_a'})(), 12: type('Modification', (object,), {'name': 'mod_b'})()}
        post_progression = type('PostProgression', (object,), {'modifications': modifications})()
        package('items', []).vehicles = module('items.vehicles', g_cache=type('Cache', (object,), {'postProgression': lambda cache: post_progression})())
        self.vehicle.item = self.items.vehicle
        return Device, Vehicle

    def test_hangar_tweaks_demount_one_slot_at_a_time_from_fresh_state(self):
        self.install_hud_stubs()
        device_class, vehicle_class = self.install_garage_stubs()
        self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        tweaks = sys.modules['gui.mods.otmetki.core.registry'].registry().instances['hangar_tweaks']
        self.assertEqual(tweaks.ui_action('demount_removable')['kind'], 'info')
        self.assertEqual(len(self.processors), 1)
        first, answer = self.processors[0]
        self.assertEqual((first.slot, first.item.name, first.install), (0, 'rammer', False))
        self.items.vehicle = vehicle_class([None, device_class('vents'), None])
        answer(type('Result', (object,), {'success': True, 'userMsg': 'rammer demounted'})())
        self.assertEqual(len(self.processors), 2)
        second, answer = self.processors[1]
        self.assertIs(second.vehicle, self.items.vehicle)
        self.assertEqual((second.slot, second.item.name), (1, 'vents'))
        answer(type('Result', (object,), {'success': False, 'userMsg': 'server busy'})())
        self.assertEqual(self.result_messages, ['rammer demounted', 'server busy'])
        self.assertEqual(len(self.processors), 2)
        self.assertTrue(self.messages)
        self.vehicle.item.crew = [(0, object())]
        self.assertEqual(tweaks.ui_action('crew_to_barracks'), {'kind': 'error', 'text': tweaks.app.translate('hangar_tweaks_refused_berths')})

    def test_loadout_reads_the_installed_field_modifications(self):
        self.install_garage_stubs()
        self.load(['mod_otmetki'])
        tank_id, loadout = sys.modules['gui.mods.otmetki.companion.loadout.client'].read_current_loadout()
        self.assertEqual(loadout['field_modifications'], ['mod_a', 'mod_b'])

    def install_hangar_view_stubs(self):
        test = self
        self.teasers = []
        self.entries = []
        self.banner_loads = []

        class Hangar(object):

            def __onTeaserReceived(self, teaserData, showCallback, closeCallback):
                test.teasers.append(teaserData)

            def __updateCarouselEventEntryState(self):
                self.as_updateCarouselEventEntryStateS(True)

            def as_updateCarouselEventEntryStateS(self, visible):
                test.entries.append(visible)

        class OfferBannerWindow(object):

            @classmethod
            def tryLoad(cls, offerID, controller):
                test.banner_loads.append(offerID)

        for name in ('gui.Scaleform', 'gui.Scaleform.daapi', 'gui.Scaleform.daapi.view', 'gui.Scaleform.daapi.view.lobby',
                     'gui.Scaleform.daapi.view.lobby.hangar', 'gui.impl', 'gui.impl.lobby', 'gui.impl.lobby.offers'):
            package(name, [])
        module('gui.Scaleform.daapi.view.lobby.hangar.Hangar', Hangar=Hangar)
        module('gui.impl.lobby.offers.offer_banner_window', OfferBannerWindow=OfferBannerWindow)
        return Hangar, OfferBannerWindow

    def test_hangar_cleaner_overrides_private_methods_only_on_a_verified_client(self):
        hangar_class, banner_class = self.install_hangar_view_stubs()
        self.load(list(ENTRY_MODULES))
        hangar = hangar_class()
        hangar._Hangar__onTeaserReceived('teaser', None, None)
        hangar._Hangar__updateCarouselEventEntryState()
        banner_class.tryLoad(5, None)
        self.assertEqual((self.teasers, self.entries, self.banner_loads), ([], [True], []))

        self.tearDown()
        self.setUp()
        self.client_version = '1.46.0.0'
        hangar_class, banner_class = self.install_hangar_view_stubs()
        self.load(list(ENTRY_MODULES))
        hangar_class()._Hangar__onTeaserReceived('teaser', None, None)
        banner_class.tryLoad(5, None)
        self.assertEqual((self.teasers, self.banner_loads), (['teaser'], []))

    def ingest_fetches(self):
        return [fetch for fetch in self.fetches if fetch[0] == 'POST' and fetch[1].endswith('/mod/ingest')]

    def test_signed_requests_resync_on_428_and_honour_retry_after(self):
        app = self.load(['mod_otmetki'])
        self.play_battle(app)
        now = SERVER_TIME
        self.assertTrue(app.sender.tick(now))
        first = self.ingest_fetches()[-1]
        signing = sys.modules['gui.mods.otmetki.core.net.signing']
        server_now = int(time.time()) + 600
        first[4](Response(428, b'{"error":"stale_request"}', {'X-Otmetki-Server-Time': str(server_now)}))
        retried = self.ingest_fetches()
        self.assertEqual(len(retried), 2)
        stamp = int(retried[-1][2][signing.TIMESTAMP_HEADER])
        self.assertTrue(abs(stamp - server_now) <= 5, (stamp, server_now))
        retried[-1][4](Response(429, b'', {'Retry-After': '900'}))
        self.assertIsNone(app.sender.in_flight)
        self.assertGreaterEqual(app.outbox.retry_at, now + 900)
        self.assertEqual(len(app.outbox.events), 1)

    def test_battle_hud_switched_off(self):
        self.install_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        app.config.update(dict((key, False) for key in ('battle_damage_log', 'battle_hit_log', 'battle_clock', 'battle_team_hp',
                                                         'battle_sixth_sense', 'hangar_battle_results', 'battle_main_gun', 'battle_consumables',
                                                         'battle_reload_timer', 'battle_efficiency', 'battle_personal_best', 'hangar_session_goals')))
        self.enter_battle(1)
        self.assertEqual(self.hud_components(), {})

    def install_gameface_hud_stubs(self):
        test = self
        self.windows = []
        self.res_id = 7

        class ViewModel(object):

            def __init__(self, properties=0, commands=0):
                self.strings = []
                self.commands = {}
                self._initialize()

            def _initialize(self):
                pass

            def _addStringProperty(self, name, value):
                self.strings.append([name, value])

            def _setString(self, index, value):
                self.strings[index][1] = value

            def _addCommand(self, name):
                self.commands[name] = Event()
                return self.commands[name]

        class ViewSettings(object):

            def __init__(self, layout_id, flags=None, model=None):
                self.layout_id = layout_id
                self.model = model

        class ViewImpl(object):

            def __init__(self, settings):
                self.settings = settings

            def getViewModel(self):
                return self.settings.model

            def _onLoading(self, *args, **kwargs):
                pass

            def _finalize(self):
                pass

        class WindowImpl(object):

            def __init__(self, wndFlags=None, content=None, layer=None, **kwargs):
                self.content = content
                self.layer = layer

            def load(self):
                test.windows.append(self)
                self.content._onLoading()

            def destroy(self):
                test.windows.remove(self)
                self.content._finalize()

        package('frameworks', [])
        module('frameworks.wulf', ViewModel=ViewModel, ViewSettings=ViewSettings, ViewFlags=type('ViewFlags', (object,), {'VIEW': 1}),
               WindowFlags=type('WindowFlags', (object,), {'WINDOW': 1}), WindowLayer=type('WindowLayer', (object,), {'WINDOW': 7}))
        package('gui.impl', [])
        module('gui.impl.pub', ViewImpl=ViewImpl, WindowImpl=WindowImpl)
        module('openwg_gameface', res_id_by_key=lambda key: test.res_id if key == 'otmetki/ui/hud' else -1,
               ModDynAccessor=lambda key: (lambda: 'layout:' + key), gf_mod_inject=lambda model, key, styles=None, modules=None: None)

    def hud_page(self):
        return json.loads(self.windows[-1].content.getViewModel().strings[0][1])

    def moe_snapshot(self, app):
        snapshot = {'tank_id': 1, 'name': 'ussr:R04_T-34', 'tier': 5, 'damage_rating': 8150, 'moving_avg_damage': 2500, 'marks_on_gun': 1,
                    'battles': 120}
        app.marks.hangar_moe[1] = snapshot
        app.bus.emit('vehicle_moe', snapshot)
        reads = [callback for method, url, headers, body, callback in self.fetches if method == 'GET' and url.endswith('/v1/moe/1')]
        self.assertEqual(len(reads), 1)
        curve = {'tank_id': 1, 'thresholds': {'65': 2000, '85': 2600, '95': 3100}}
        reads[0](Response(200, json.dumps(curve).encode('utf-8')))

    def test_marks_panel_in_battle_and_hangar_marks(self):
        self.install_hud_stubs()
        kinds = sys.modules['BattleFeedbackCommon'].BATTLE_EVENT_TYPE
        app = self.load(list(ENTRY_MODULES))
        app.credentials.save(Credentials('device-1', 's' * 40, ACCOUNT))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        self.moe_snapshot(app)
        hangar = self.hud_components()['hangar_marks']
        self.assertTrue(hangar['lobby'] and not hangar['battle'])
        self.assertIn('81.50%', hangar['text'])
        self.assertIn('2 600', hangar['text'])

        session = self.enter_battle(1, tank_id=1)
        self.assertNotIn('hangar_marks', self.hud_components())
        panel = self.hud_components()['marks_panel']
        self.assertTrue(panel['battle'] and panel['drag'])
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.DAMAGE, ENEMY_VEHICLE, Extra(390)),
                                                   Feedback(kinds.DAMAGE, ALLY_VEHICLE, Extra(50))])
        self.assertIn('390', self.hud_components()['marks_panel']['text'])
        session.vehicle_state.getControllingVehicleID = lambda: ALLY_VEHICLE
        session.feedback.onPlayerFeedbackReceived([Feedback(kinds.RADIO_ASSIST, ENEMY_VEHICLE, Extra(640))])
        self.assertIn('1 030', self.hud_components()['marks_panel']['text'])
        session.feedback.onPlayerSummaryFeedbackReceived(Summary())
        self.assertIn('2 790', self.hud_components()['marks_panel']['text'])
        self.events.onAvatarBecomeNonPlayer()
        self.assertNotIn('marks_panel', self.hud_components())
        self.assertIn('moe_pace', [key for key, dump in app.state_parts])

    def test_gameface_backend_is_preferred_and_falls_back(self):
        self.install_hud_stubs()
        self.install_gameface_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        layer = sys.modules['gui.mods.otmetki.core.client.hud'].hud_layer(app)
        self.assertEqual(layer.backend.names, ['gameface', 'guiflash'])
        self.assertEqual(layer.backend_name, 'gameface')
        app.bus.emit('hud_edit', True)
        self.assertEqual(self.hud_components(), {})
        self.assertEqual(len(self.windows), 1)
        self.assertEqual(self.windows[0].layer, 7)
        page = self.hud_page()
        panels = dict((panel['id'], panel) for panel in page['panels'])
        self.assertTrue(page['cursor'])
        self.assertIn('390', panels['otmetki.hud.damage_log']['text'])
        model = self.windows[0].content.getViewModel()
        model.commands['send']({'message': json.dumps({'type': 'moved', 'id': 'otmetki.hud.damage_log', 'x': 40, 'y': 50,
                                                       'align_x': 'center', 'align_y': 'top'})})
        saved = _support.load_json(os.path.join(app.config_dir, 'components.json'))['damage_log']
        self.assertEqual((saved['x'], saved['y'], saved['align_x'], saved['align_y']), (40, 50, 'center', 'top'))
        model.commands['send']({'message': 'not json'})
        app.bus.emit('hud_edit', False)
        self.assertFalse([panel for panel in self.hud_page()['panels'] if panel['id'].startswith('otmetki.hud.')])

        self.res_id = -1
        app.bus.emit('hud_edit', True)
        self.assertEqual(len(self.windows), 1)
        self.assertIn('damage_log', self.hud_components())
        self.assertEqual(layer.backend_name, 'guiflash')

    def test_gameface_labels_stay_in_their_space(self):
        self.install_hud_stubs()
        self.install_gameface_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        app.ui.show('otmetki.hangar_test', 'hangar only', {'x': 1, 'y': 2, 'alignX': 'left', 'alignY': 'top'})
        self.assertIn('otmetki.hangar_test', [panel['id'] for panel in self.hud_page()['panels']])
        self.enter_battle(1)
        ids = [panel['id'] for panel in self.hud_page()['panels']]
        self.assertNotIn('otmetki.hangar_test', ids)
        self.assertIn('otmetki.hud.damage_log', ids)
        self.assertFalse(self.hud_page()['cursor'])

    def test_pre_06_guiflash_draws_in_battle_only(self):
        self.install_hud_stubs()
        flash = sys.modules['gui.mods.gambiter'].g_guiFlash
        test = self

        def create_component(alias, kind, props):
            test.components[alias] = dict(props, kind=kind)

        flash.createComponent = create_component
        app = self.load(list(ENTRY_MODULES))
        self.player = Player(ACCOUNT)
        self.events.onAccountShowGUI()
        app.bus.emit('hud_edit', True)
        self.assertEqual(self.components, {})
        self.assertFalse(app.ui.has_panels)
        self.enter_battle(1)
        self.assertIn('damage_log', self.hud_components())
        self.assertTrue(self.hud_components()['damage_log']['multiline'])


if __name__ == '__main__':
    unittest.main()
