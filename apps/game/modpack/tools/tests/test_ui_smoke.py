# -*- coding: utf-8 -*-
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
           'skeletons', 'dossiers2', 'BattleFeedbackCommon', 'account_helpers')
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
    # RU 1.45 client source (account_helpers/settings_core/SettingsCore.py): applySettings(diff) returns
    # nothing; applyStorages(restartApproved, force=False) returns (confirmation, revert) pairs that
    # confirmChanges walks; clearStorages() drops the staged values. Only what a storage applied is stored.

    def __init__(self):
        self.values = {'minimapAlpha': 0, 'carouselType': 0, 'arcade': {'net': 100, 'custom': 3}, 'sniper': {'net': 100}}
        self.applied = []
        self.staged = {}
        self.calls = []

    def getSetting(self, name):
        return self.values.get(name)

    def applySettings(self, diff):
        self.calls.append('applySettings')
        self.applied.append(dict(diff))
        self.staged.update(diff)

    def applyStorages(self, restartApproved, force=False):
        self.calls.append('applyStorages')
        return [(None, lambda: None)]

    def confirmChanges(self, confirmators):
        self.calls.append('confirmChanges')
        for confirmation, revert in confirmators:
            if confirmation is not None:
                confirmation()
        self.values.update(self.staged)

    def clearStorages(self):
        self.calls.append('clearStorages')
        self.staged = {}


class AccountSettings(object):
    # RU 1.45 client source (account_helpers/AccountSettings.py): KEY_SETTINGS values by name.
    values = {}

    @classmethod
    def getSettings(cls, name):
        return cls.values.get(name)

    @classmethod
    def setSettings(cls, name, value):
        cls.values[name] = value


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
            self.numbers = []
            self._initialize()

        def _initialize(self):
            pass

        def _addStringProperty(self, name, value):
            self.strings.append([name, value])

        def _setString(self, index, value):
            self.strings[index][1] = value

        def _addNumberProperty(self, name, value):
            self.strings.append([name, value])
            self.numbers.append(name)

        def _setNumber(self, index, value):
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

    class StatusEvent(list):

        def __iadd__(self, handler):
            self.append(handler)
            return self

    class WindowImpl(object):

        def __init__(self, wndFlags=None, content=None, layer=None, parent=None):
            self.content = content
            self.flags = wndFlags
            self.layer = layer
            self.uniqueID = len(test.windows) + 1
            self.windowStatus = 1
            self.onStatusChanged = StatusEvent()
            self.shown = 0

        def load(self):
            test.windows.append(self)
            self.windowStatus = 3
            self.content._onLoading()

        def show(self):
            self.shown += 1

        def destroy(self):
            self.windowStatus = 5
            self.content._finalize()
            test.windows.remove(self)

    package('frameworks')
    module('frameworks.wulf', ViewModel=ViewModel, ViewSettings=ViewSettings, ViewFlags=type(str('ViewFlags'), (object,), {'VIEW': 1}),
           WindowFlags=type(str('WindowFlags'), (object,), {'WINDOW': 1, 'WINDOW_FULLSCREEN': 1024}),
           WindowLayer=type(str('WindowLayer'), (object,), {'WINDOW': 7, 'OVERLAY': 11}),
           WindowStatus=type(str('WindowStatus'), (object,), {'LOADED': 3, 'DESTROYING': 4, 'DESTROYED': 5}))
    package('gui.impl')
    module('gui.impl.pub', ViewImpl=ViewImpl, WindowImpl=WindowImpl)

    class HangarCrewWidget(ViewImpl):
        # RU 1.45 client source: gui/impl/lobby/crew/hangar_crew_widget.py, the hangar's Gameface widget.

        def _onLoading(self, *args, **kwargs):
            pass

    package('gui.impl.lobby')
    package('gui.impl.lobby.crew')
    module('gui.impl.lobby.crew.hangar_crew_widget', HangarCrewWidget=HangarCrewWidget)
    module('openwg_gameface', ModDynAccessor=lambda key: (lambda: 'layout:' + key),
           gf_mod_inject=lambda model, key, styles=None, modules=None: test.injected.append((key, styles, modules)))


class UiSmokeTest(unittest.TestCase):

    def setUp(self):
        self.saved_cwd = os.getcwd()
        self.saved_stdout = sys.stdout
        sys.stdout = Sink()
        self.game_dir = tempfile.mkdtemp()
        os.chdir(self.game_dir)
        self.saved_appdata = os.environ.get('APPDATA')
        os.environ['APPDATA'] = os.path.join(self.game_dir, 'AppData')
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
        self.opened = []
        module('BigWorld', callback=lambda delay, fn: None, player=lambda: test.player, fetchURL=lambda *args, **kwargs: None,
               isKeyDown=lambda key: key in test.pressed, openWebBrowser=test.opened.append)
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
        AccountSettings.values = {'minimapSize': 1}
        package('account_helpers')
        module('account_helpers.AccountSettings', AccountSettings=AccountSettings, MINIMAP_SIZE='minimapSize')
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
            self.mods_list[0]['callback']()
            assert len(self.windows) == 1 and self.windows[0].shown == 1
            assert self.windows[0].flags == 1025 and self.windows[0].layer == 11
            state = self.state()
            ids = [component['id'] for component in state['components']]
            assert ids[0] == 'companion' and 'minimap' in ids and 'replay_manager' in ids, ids

            self.send(type='set', component='minimap', key='transparency', value='40')
            assert self.core.applied[-1] == {'minimapAlpha': 40}
            assert self.core.calls[-4:] == ['applySettings', 'applyStorages', 'confirmChanges', 'clearStorages']
            assert self.core.values['minimapAlpha'] == 40 and self.core.staged == {}
            self.send(type='set', component='minimap', key='size', value='3')
            assert AccountSettings.values['minimapSize'] == 3
            assert all('minimapSize' not in diff for diff in self.core.applied)
            self.send(type='set', component='crosshair', key='preset', value='clean')
            assert self.core.applied[-1]['arcade']['custom'] == 3 and self.core.applied[-1]['arcade']['net'] == 0
            self.send(type='set', component='companion', key='send_shots', value=False)
            assert app.config.get('send_shots') is False
            assert self.state()['revision'] == 4

    def model_value(self, name):
        model = self.windows[-1].content.getViewModel()
        return dict(model.strings)[name]

    def ui_host(self):
        return sys.modules['gui.mods.otmetki.core.registry'].registry().instances['ui']

    def test_modslist_takes_the_place_of_the_hangar_button(self):
        self.open_hangar(0)

        button = self.ui_host().button

        assert len(self.mods_list) == 1
        assert button.settings is None

    def test_esc_asks_the_page_to_step_back(self):
        self.open_hangar(0)
        self.mods_list[0]['callback']()

        self.ui_host().window.step_back()

        assert self.model_value('escape') == 1
        assert len(self.windows) == 1

    def test_the_page_answers_esc_and_the_window_stays(self):
        self.open_hangar(0)
        self.mods_list[0]['callback']()
        window = self.ui_host().window
        window.step_back()

        self.send(type='escape')

        assert not window.watchdog.is_waiting
        assert len(self.windows) == 1

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

    def test_no_child_view_in_the_crew_widget_and_links_in_the_game_browser(self):
        self.open_hangar(2)
        widget_class = sys.modules['gui.impl.lobby.crew.hangar_crew_widget'].HangarCrewWidget
        widget = widget_class(None)
        widget._onLoading()
        assert widget.children == [] and self.injected == []
        assert sys.modules['gui.mods.otmetki.ui.client.browser'].open_url('https://triotmetki.ru/mod')
        assert self.opened == ['https://triotmetki.ru/mod']

    def test_profiles_and_close_from_the_page(self):
        app = self.open_hangar(1)
        self.mods_list[0]['callback']()
        self.send(type='profile_save', name='Streamer')
        self.send(type='set', component='companion', key='flush_interval_seconds', value=30)
        profile_id = self.state()['profiles']['active']
        self.send(type='profile_load', id=profile_id)
        assert app.config.get('flush_interval_seconds') == 15
        with open(os.path.join('mods', 'configs', 'otmetki', 'profiles.json')) as handle:
            assert json.load(handle)['profiles'][0]['name'] == 'Streamer'
        self.send(type='close')
        assert self.windows == []


if __name__ == '__main__':
    unittest.main()
