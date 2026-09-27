# -*- coding: utf-8 -*-
import json
import os
import random
import shutil
import sys
import tempfile
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
           'messenger', 'notification')


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
OWN_VEHICLE = 101
ENEMY_VEHICLE = 202
ALLY_VEHICLE = 303
HIT_STATES = ('VEHICLE_HEALTH', 'VEHICLE_HIT', 'VEHICLE_RICOCHET', 'VEHICLE_ARMOR_PIERCED', 'VEHICLE_CRITICAL_HIT', 'VEHICLE_DEAD')


class Extra(object):

    def __init__(self, damage=0, shell=SHELL_TYPES.ARMOR_PIERCING, crits=0):
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


class Response(object):

    def __init__(self, code, body):
        self.responseCode = code
        self.body = body
        self.headers = {}


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
               VEHICLE_VIEW_STATE=type('VEHICLE_VIEW_STATE', (object,), {'FIRE': 1, 'DEVICES': 2, 'HEALTH': 4, 'OBSERVED_BY_ENEMY': 4096,
                                                                          'SWITCHING': 16384}))
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
        self.assertEqual(sorted(described), ['battle_clock', 'damage_log', 'hit_log', 'sixth_sense', 'team_hp'])
        self.assertFalse(described['team_hp'][2])
        self.assertTrue(described['damage_log'][2])
        self.assertIn('390', described['damage_log'][0])
        app.bus.emit('hud_edit', True)
        panels = self.hud_components()
        self.assertEqual(sorted(panels), ['battle_clock', 'damage_log', 'hit_log', 'sixth_sense'])
        self.assertIn('Pz. IV', panels['hit_log']['text'])
        app.bus.emit('hud_edit', False)
        self.assertEqual(self.hud_components(), {})
        app.bus.emit('hud_edit', True)
        self.enter_battle(1)
        self.assertNotIn('390', self.hud_components().get('damage_log', {}).get('text', ''))
        self.assertNotIn('sixth_sense', self.hud_components())

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
                                                                                               'RECRUIT_REMINDER': 13}))
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
        self.assertEqual(self.notifications, [1, 13, 4])

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
        self.assertEqual(sorted(reads), ['overview', 'tanks'])
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

    def test_battle_hud_switched_off(self):
        self.install_hud_stubs()
        app = self.load(list(ENTRY_MODULES))
        app.config.update(dict((key, False) for key in ('battle_damage_log', 'battle_hit_log', 'battle_clock', 'battle_team_hp',
                                                         'battle_sixth_sense', 'hangar_battle_results')))
        self.enter_battle(1)
        self.assertEqual(self.hud_components(), {})


if __name__ == '__main__':
    unittest.main()
