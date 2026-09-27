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
ENTRY_MODULES = ('mod_otmetki', 'mod_otmetki_marks_panel', 'mod_otmetki_replay_upload', 'mod_otmetki_session_stats')
STUBBED = ('gui', 'BigWorld', 'BattleReplay', 'CurrentVehicle', 'PlayerEvents', 'BattleFeedbackCommon', 'dossiers2')


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

        module('BigWorld', callback=lambda delay, fn: test.callbacks.append(fn), player=lambda: test.player, fetchURL=fetch_url)
        module('BattleReplay', isPlaying=lambda: False)
        module('CurrentVehicle', g_currentVehicle=self.vehicle)
        module('PlayerEvents', g_playerEvents=self.events)
        kinds = type('BATTLE_EVENT_TYPE', (object,), {'DAMAGE': 1, 'RADIO_ASSIST': 2, 'TRACK_ASSIST': 3, 'STUN_ASSIST': 4, 'KILL': 5})
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
            self.assertEqual(sorted(registry.instances), ['marks_panel', 'replay_upload', 'session_stats'], entries)

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


if __name__ == '__main__':
    unittest.main()
