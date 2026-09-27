# -*- coding: utf-8 -*-
"""Import smoke of the in-game UI against stubbed client modules: OpenWG Gameface (frameworks.wulf,
gui.impl.pub, openwg_gameface), ModsList, the InputHandler and the settings core.

The entry scripts load in shuffled orders; then the window opens from the ModsList entry, receives the
state JSON, and page messages go through the real bridge into the features (a minimap choice becomes a
client setting, a HUD-free build still works). Everything the stubs model is UNVERIFIED client API.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import json
import os
import random
import shutil
import sys
import tempfile
import types
import unittest

import _support

ACCOUNT = 12345678
ENTRY_MODULES = ('mod_otmetki', 'mod_otmetki_ui', 'mod_otmetki_minimap', 'mod_otmetki_camera', 'mod_otmetki_crosshair',
                 'mod_otmetki_hangar_tweaks', 'mod_otmetki_replay_manager', 'mod_otmetki_replay_upload')
STUBBED = ('gui', 'BigWorld', 'BattleReplay', 'CurrentVehicle', 'PlayerEvents', 'frameworks', 'openwg_gameface', 'Keys', 'helpers',
           'skeletons', 'dossiers2', 'BattleFeedbackCommon')
KEYS = {'KEY_T': 20, 'KEY_LCONTROL': 29, 'KEY_LSHIFT': 42}


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


class Namespace(object):

    def __init__(self, **attrs):
        self.__dict__.update(attrs)


class Sink(object):

    def write(self, text):
        pass

    def flush(self):
        pass


class SettingsCore(object):

    def __init__(self):
        self.values = {'minimapSize': 1, 'minimapAlpha': 0, 'carouselType': 0, 'arcade': {'net': 100, 'custom': 3}, 'sniper': {'net': 100}}
        self.applied = []

    def getSetting(self, name):
        return self.values.get(name)

    def applySettings(self, diff):
        self.applied.append(dict(diff))
        self.values.update(diff)
        return 'confirmators'

    def confirmChanges(self, confirmators):
        pass

    def applyStorages(self, restart):
        pass


def module(name, **attrs):
    stub = types.ModuleType(str(name))
    stub.__dict__.update(attrs)
    sys.modules[name] = stub
    parent, _, child = name.rpartition('.')
    if parent in sys.modules:
        setattr(sys.modules[parent], child, stub)
    return stub


def package(name, path=()):
    stub = module(name)
    stub.__path__ = list(path)
    return stub


def gameface_stubs(test):

    class ViewModel(object):

        def __init__(self, properties=0, commands=0):
            self.strings = []
            self._initialize()

        def _initialize(self):
            pass

        def _addStringProperty(self, name, value):
            self.strings.append([name, value])

        def _setString(self, index, value):
            self.strings[index][1] = value

        def _addCommand(self, name):
            return Event()

    class ViewSettings(object):

        def __init__(self, layout_id, flags=None, model=None):
            self.layout_id = layout_id
            self.model = model

    class ViewImpl(object):

        def __init__(self, settings):
            self.settings = settings
            self.children = []

        def getViewModel(self):
            return self.settings.model

        def _onLoading(self, *args, **kwargs):
            pass

        def _finalize(self):
            pass

        def setChildView(self, layout_id, view):
            self.children.append(view)

    class WindowImpl(object):

        def __init__(self, wndFlags=None, content=None):
            self.content = content

        def load(self):
            test.windows.append(self)
            self.content._onLoading()

        def destroy(self):
            self.content._finalize()
            test.windows.remove(self)

    package('frameworks')
    module('frameworks.wulf', ViewModel=ViewModel, ViewSettings=ViewSettings, ViewFlags=type(str('ViewFlags'), (object,), {'VIEW': 1}),
           WindowFlags=type(str('WindowFlags'), (object,), {'WINDOW': 1}))
    package('gui.impl')
    module('gui.impl.pub', ViewImpl=ViewImpl, WindowImpl=WindowImpl)
    module('openwg_gameface', ModDynAccessor=lambda key: (lambda: 'layout:' + key),
           gf_mod_inject=lambda model, key, styles=None, modules=None: test.injected.append((key, styles, modules)))


class UiSmokeTest(unittest.TestCase):

    def setUp(self):
        self.saved_cwd = os.getcwd()
        self.saved_stdout = sys.stdout
        sys.stdout = Sink()
        self.game_dir = tempfile.mkdtemp()
        os.chdir(self.game_dir)
        self.purge()
        self.windows = []
        self.injected = []
        self.mods_list = []
        self.messages = []
        self.pressed = set()
        self.core = SettingsCore()
        self.player = type(str('Player'), (object,), {'databaseID': ACCOUNT, 'arenaUniqueID': None})()
        self.events = type(str('PlayerEvents'), (object,), {})()
        for name in ('onAccountShowGUI', 'onEnqueued', 'onDequeued', 'onArenaCreated', 'onAvatarReady', 'onAvatarBecomeNonPlayer',
                     'onBattleResultsReceived'):
            setattr(self.events, name, Event())
        self.input = type(str('InputHandler'), (object,), {'onKeyDown': Event()})()
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
        module('BigWorld', callback=lambda delay, fn: None, player=lambda: test.player, fetchURL=lambda *args, **kwargs: None,
               isKeyDown=lambda key: key in test.pressed)
        module('BattleReplay', isPlaying=lambda: False)
        vehicle = type(str('CurrentVehicle'), (object,), {'item': None, 'onChanged': Event()})()
        module('CurrentVehicle', g_currentVehicle=vehicle)
        module('PlayerEvents', g_playerEvents=self.events)
        module('Keys', **KEYS)
        kinds = type(str('BATTLE_EVENT_TYPE'), (object,), {'DAMAGE': 1, 'RADIO_ASSIST': 2, 'TRACK_ASSIST': 3, 'STUN_ASSIST': 4, 'KILL': 5})
        module('BattleFeedbackCommon', BATTLE_EVENT_TYPE=kinds)
        package('dossiers2')
        package('dossiers2.ui')
        module('dossiers2.ui.achievements', ACHIEVEMENT_BLOCK=type(str('ACHIEVEMENT_BLOCK'), (object,), {'TOTAL': 'total'}))
        module('helpers', dependency=Namespace(instance=lambda interface: test.core))
        package('skeletons')
        package('skeletons.account_helpers')
        module('skeletons.account_helpers.settings_core', ISettingsCore=object)
        package('gui')
        module('gui.SystemMessages', SM_TYPE=type(str('SM_TYPE'), (object,), {'Information': 'info'}),
               pushMessage=lambda text, type=None: test.messages.append(text))
        module('gui.InputHandler', g_instance=self.input)
        module('gui.modsListApi', g_modsListApi=Namespace(addModification=lambda **kwargs: test.mods_list.append(kwargs)))
        gameface_stubs(self)
        entry_dirs = [os.path.join(base, 'entry') for base in _support.source_dirs()]
        package('gui.mods', [path for path in entry_dirs if os.path.isdir(path)])
        package('gui.mods.otmetki', [_support.PACKAGES_DIR, _support.MODPACK_DIR])

    def load(self, entries):
        import importlib
        for name in entries:
            importlib.import_module('gui.mods.' + name)
        return sys.modules['gui.mods.otmetki.companion.app.client'].g_app

    def state(self):
        view = self.windows[-1].content
        return json.loads(view.getViewModel().strings[0][1])

    def send(self, **message):
        self.windows[-1].content.getViewModel().send({'message': json.dumps(message)})

    def open_hangar(self, seed):
        entries = list(ENTRY_MODULES)
        random.Random(seed).shuffle(entries)
        app = self.load(entries)
        self.events.onAccountShowGUI()
        return app

    def test_window_opens_and_edits_in_any_load_order(self):
        for seed in range(3):
            self.tearDown()
            self.setUp()
            app = self.open_hangar(seed)
            registry = sys.modules['gui.mods.otmetki.core.registry'].registry()
            assert 'ui' in registry.instances and 'minimap' in registry.instances
            assert [view.name for view in app.settings_ui.views] == ['gameface']
            assert len(self.mods_list) == 1 and self.mods_list[0]['id'] == 'otmetki'

            self.mods_list[0]['callback']()
            assert len(self.windows) == 1
            state = self.state()
            ids = [component['id'] for component in state['components']]
            assert ids[0] == 'companion' and 'minimap' in ids and 'replay_manager' in ids, ids

            self.send(type='set', component='minimap', key='size', value='3')
            assert self.core.applied[-1] == {'minimapSize': 3}
            self.send(type='set', component='crosshair', key='preset', value='clean')
            assert self.core.applied[-1]['arcade']['custom'] == 3 and self.core.applied[-1]['arcade']['net'] == 0
            self.send(type='set', component='companion', key='send_shots', value=False)
            assert app.config.get('send_shots') is False
            assert self.state()['revision'] == 3

    def test_hotkey_and_battle_close_the_window(self):
        self.open_hangar(0)
        self.pressed.update([KEYS['KEY_LCONTROL'], KEYS['KEY_LSHIFT']])
        self.input.onKeyDown(Namespace(key=KEYS['KEY_T']))
        assert len(self.windows) == 1
        self.input.onKeyDown(Namespace(key=KEYS['KEY_T']))
        assert self.windows == []
        self.input.onKeyDown(Namespace(key=KEYS['KEY_T']))
        self.events.onAvatarReady()
        assert self.windows == []

    def test_profiles_and_close_from_the_page(self):
        app = self.open_hangar(1)
        self.mods_list[0]['callback']()
        self.send(type='profile_save', name='Streamer')
        self.send(type='set', component='companion', key='send_shots', value=False)
        profile_id = self.state()['profiles']['active']
        self.send(type='profile_load', id=profile_id)
        assert app.config.get('send_shots') is True
        with open(os.path.join('mods', 'configs', 'otmetki', 'profiles.json')) as handle:
            assert json.load(handle)['profiles'][0]['name'] == 'Streamer'
        self.send(type='close')
        assert self.windows == []


if __name__ == '__main__':
    unittest.main()
