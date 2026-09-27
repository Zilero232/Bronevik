# -*- coding: utf-8 -*-
"""Import smoke of the whole mod against stubbed client modules.

The entry scripts are imported in shuffled orders, as the client does (hash order), under the real
in-game package name gui.mods.otmetki. Then a login, a battle and its results run through the event
hooks, checking the wiring end to end: the battle_result reaches the outbox, the session feature
stamps it and keeps its state, and the session summary is shown after the battle.
"""
import os
import random
import shutil
import sys
import tempfile
import types
import unittest

import _support
from otmetki.companion.binding import Credentials

ACCOUNT = 12345678
# The ui package (packages/ui) registers through the core registry like a feature.
REGISTERED = tuple(_support.feature_ids()) + ('ui',)
ENTRY_MODULES = ('mod_otmetki',) + tuple('mod_otmetki_' + key for key in REGISTERED)
STUBBED = ('gui', 'BigWorld', 'BattleReplay', 'CurrentVehicle', 'PlayerEvents', 'BattleFeedbackCommon', 'dossiers2', 'constants', 'SoundGroups')


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
    """Swallows the mod's [OTMETKI] log lines while the smoke test runs."""

    def write(self, text):
        pass

    def flush(self):
        pass


class Player(object):

    def __init__(self, account_id=None, arena_id=None):
        self.databaseID = account_id
        self.arenaUniqueID = arena_id
        self.guiSessionProvider = None


def module(name, **attrs):
    stub = types.ModuleType(name)
    stub.__dict__.update(attrs)
    sys.modules[name] = stub
    return stub


def package(name, path):
    stub = module(name)
    stub.__path__ = list(path)
    return stub


SERVER_TIME = 1790000100.0
OWN_VEHICLE = 101
ENEMY_VEHICLE = 202
ALLY_VEHICLE = 303
HIT_STATES = ('VEHICLE_HEALTH', 'VEHICLE_HIT', 'VEHICLE_RICOCHET', 'VEHICLE_ARMOR_PIERCED', 'VEHICLE_CRITICAL_HIT', 'VEHICLE_DEAD')


class Extra(object):

    def __init__(self, damage=0, shell='ARMOR_PIERCING', crits=0):
        self.damage = damage
        self.shell = shell
        self.crits = crits

    def getDamage(self):
        return self.damage

    def isShot(self):
        return True

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

    def __init__(self, vehicle_id, team, name, max_health, alive=True):
        self.vehicleID = vehicle_id
        self.team = team
        self.vehicleType = type('VehicleType', (object,), {'shortName': name, 'name': name, 'maxHealth': max_health})()
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


class BattleSession(object):
    """The parts of guiSessionProvider and the arena the HUD components hook."""

    def __init__(self):
        self.feedback = type('Feedback', (object,), {})()
        for name in ('onPlayerFeedbackReceived', 'onPlayerSummaryFeedbackReceived', 'onVehicleFeedbackReceived'):
            setattr(self.feedback, name, Event())
        self.vehicle_state = type('VehicleState', (object,), {'getControllingVehicleID': lambda state: OWN_VEHICLE})()
        self.vehicle_state.onVehicleStateUpdated = Event()
        self.shared = type('Shared', (object,), {})()
        self.shared.feedback = self.feedback
        self.shared.vehicleState = self.vehicle_state
        self.dp = ArenaDP([VehicleInfo(OWN_VEHICLE, 1, 'T-34', 1000), VehicleInfo(ALLY_VEHICLE, 1, 'KV-1', 1200),
                           VehicleInfo(ENEMY_VEHICLE, 2, 'Pz. IV', 900)])
        self.arena = type('Arena', (object,), {'period': 3, 'periodEndTime': SERVER_TIME + 300})()
        self.arena.onVehicleKilled = Event()
        self.arena.onVehicleAdded = Event()

    def getArenaDP(self):
        return self.dp


class ClientSmokeTest(unittest.TestCase):

    def setUp(self):
        self.saved_cwd = os.getcwd()
        self.saved_stdout = sys.stdout
        sys.stdout = Sink()
        self.game_dir = tempfile.mkdtemp()
        os.chdir(self.game_dir)
        self.purge()
        self.callbacks = []
        self.messages = []
        self.requests = []
        self.player = Player()
        self.events = type('PlayerEvents', (object,), {})()
        for name in ('onAccountShowGUI', 'onEnqueued', 'onDequeued', 'onArenaCreated', 'onAvatarReady', 'onAvatarBecomeNonPlayer',
                     'onBattleResultsReceived'):
            setattr(self.events, name, Event())
        self.vehicle = type('CurrentVehicle', (object,), {'item': None, 'onChanged': Event()})()
        self.install_stubs()

    def tearDown(self):
        os.chdir(self.saved_cwd)
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

        module('BigWorld', callback=lambda delay, fn: test.callbacks.append(fn), player=lambda: test.player, fetchURL=fetch_url,
               serverTime=lambda: SERVER_TIME)
        module('BattleReplay', isPlaying=lambda: False)
        module('CurrentVehicle', g_currentVehicle=self.vehicle)
        module('PlayerEvents', g_playerEvents=self.events)
        kinds = type('BATTLE_EVENT_TYPE', (object,), {'DAMAGE': 1, 'RADIO_ASSIST': 2, 'TRACK_ASSIST': 3, 'STUN_ASSIST': 4, 'KILL': 5,
                                                      'CRIT': 6, 'TANKING': 7, 'RECEIVED_DAMAGE': 8})
        module('BattleFeedbackCommon', BATTLE_EVENT_TYPE=kinds)
        package('dossiers2', [])
        package('dossiers2.ui', [])
        module('dossiers2.ui.achievements', ACHIEVEMENT_BLOCK=type('ACHIEVEMENT_BLOCK', (object,), {'TOTAL': 'total'}))
        package('gui', [])
        system_messages = module('gui.SystemMessages', SM_TYPE=type('SM_TYPE', (object,), {'Information': 'info'}),
                                 pushMessage=lambda text, type=None: test.messages.append(text))
        sys.modules['gui'].SystemMessages = system_messages
        entry_dirs = [os.path.join(base, 'entry') for base in _support.source_dirs()]
        package('gui.mods', [path for path in entry_dirs if os.path.isdir(path)])
        package('gui.mods.otmetki', [_support.PACKAGES_DIR, _support.MODPACK_DIR])

    def load(self, entries):
        import importlib
        for name in entries:
            importlib.import_module('gui.mods.' + name)
        return sys.modules['gui.mods.otmetki.companion.client.app'].g_app

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

            def createComponent(self, alias, kind, props):
                test.components[alias] = dict(props, kind=kind)

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
               VEHICLE_VIEW_STATE=type('VEHICLE_VIEW_STATE', (object,), {'HEALTH': 4, 'OBSERVED_BY_ENEMY': 4096, 'SWITCHING': 16384}))
        module('constants', ARENA_PERIOD=type('ARENA_PERIOD', (object,), {'WAITING': 1, 'PREBATTLE': 2, 'BATTLE': 3, 'AFTERBATTLE': 4}))
        module('SoundGroups', g_instance=type('Sounds', (object,), {'playSound2D': lambda sounds, name: test.sounds.append(name)})())
        return feedback_ids

    def enter_battle(self, results_arena):
        session = BattleSession()
        self.player = Player(ACCOUNT, results_arena)
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
        session.vehicle_state.onVehicleStateUpdated(4096, True)
        session.arena.onVehicleKilled(ALLY_VEHICLE, ENEMY_VEHICLE, 0, 0, 1)

        panels = self.hud_components()
        self.assertEqual(sorted(panels), ['battle_clock', 'damage_log', 'hit_log', 'sixth_sense', 'team_hp'])
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
        self.assertEqual(self.sounds, ['otmetki_lamp'])
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
        summary = [text for text in self.messages if u'87.12%' in text]
        self.assertTrue(summary, self.messages)
        self.assertIn('+1.12%', summary[0])
        self.assertIn('2 150', summary[0])

    def test_battle_hud_switched_off(self):
        self.install_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        app.config.update(dict((key, False) for key in ('battle_damage_log', 'battle_hit_log', 'battle_clock', 'battle_team_hp',
                                                         'battle_sixth_sense', 'hangar_battle_results')))
        self.enter_battle(1)
        self.assertEqual(self.hud_components(), {})


if __name__ == '__main__':
    unittest.main()
