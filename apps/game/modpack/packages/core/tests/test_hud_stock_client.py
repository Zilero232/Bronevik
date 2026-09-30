# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import sys
import types
import unittest

import _support  # noqa: F401
from otmetki.core.hud import ComponentConfig, HudBackend, HudLayer, panel_schema
from otmetki.core.storage import MemoryFile

STUBBED = ('BigWorld', 'gui', 'gui.Scaleform', 'gui.Scaleform.daapi', 'gui.Scaleform.daapi.view', 'gui.Scaleform.daapi.view.battle',
           'gui.Scaleform.daapi.view.battle.shared', 'gui.Scaleform.daapi.view.battle.shared.page', 'gui.Scaleform.daapi.view.battle.classic',
           'gui.Scaleform.daapi.view.battle.classic.page')


class SharedPage(object):

    def __init__(self):
        self.applied = []
        self._fsToggling = set()

    def _populate(self):
        return 'populated'

    def _dispose(self):
        return 'disposed'

    def _setComponentsVisibility(self, visible=None, hidden=None):
        self.applied.append((set(visible or ()), set(hidden or ())))

    def as_setComponentsVisibilityS(self, visible, hidden):
        self.applied.append((set(visible), set(hidden)))


class ClassicPage(SharedPage):
    pass


class EpicPage(SharedPage):
    pass


class Event(object):

    def __init__(self, ctx):
        self.ctx = ctx


class Backend(HudBackend):

    def available(self):
        return True

    def create(self, alias, props):
        return True

    def delete(self, alias):
        return True


def install_stubs():
    saved = dict((name, sys.modules.get(name)) for name in STUBBED)
    for name in STUBBED:
        sys.modules[name] = types.ModuleType(str(name))
    sys.modules['BigWorld'].player = lambda: None
    sys.modules['gui.Scaleform.daapi.view.battle.shared.page'].SharedPage = SharedPage
    sys.modules['gui.Scaleform.daapi.view.battle.classic.page'].ClassicPage = ClassicPage
    return saved


def restore_stubs(saved):
    for name, module in saved.items():
        if module is None:
            sys.modules.pop(name, None)
        else:
            sys.modules[name] = module
    for name in [name for name in sys.modules if name.startswith('otmetki.core.client.hud')]:
        del sys.modules[name]


class StockControlTest(unittest.TestCase):

    def setUp(self):
        self.saved = install_stubs()
        self.originals = dict((name, SharedPage.__dict__[name]) for name in ('_populate', '_dispose', '_setComponentsVisibility'))
        from otmetki.core.client.hud.stock import StockControl
        self.layer = HudLayer(Backend(), ComponentConfig(MemoryFile()))
        self.layer.register('panel', panel_schema({}))
        self.control = StockControl(self.layer)
        assert self.control.install()

    def tearDown(self):
        for name, value in self.originals.items():
            setattr(SharedPage, name, value)
        restore_stubs(self.saved)

    def test_suppressed_alias_stays_hidden_on_the_classic_page(self):
        page = ClassicPage()
        self.control.want('team_hp', ('fragCorrelationBar',))
        assert page._populate() == 'populated'
        assert page.applied[-1] == (set(), {'fragCorrelationBar'})
        page._setComponentsVisibility(visible={'fragCorrelationBar', 'damagePanel'})
        assert page.applied[-1] == ({'damagePanel'}, {'fragCorrelationBar'})
        self.control.want('team_hp', ())
        assert page._fsToggling == set() and page.applied[-1] == ({'fragCorrelationBar'}, set())
        page._setComponentsVisibility(visible={'fragCorrelationBar'})
        assert page.applied[-1] == ({'fragCorrelationBar'}, set())

    def test_other_battle_pages_keep_every_stock_element(self):
        page = EpicPage()
        self.control.want('team_hp', ('fragCorrelationBar',))
        page._populate()
        page._setComponentsVisibility(visible={'fragCorrelationBar'})
        assert page.applied == [({'fragCorrelationBar'}, set())]

    def test_restore_while_full_stats_is_open_waits_for_the_page(self):
        page = ClassicPage()
        page._populate()
        self.control.want('sixth_sense', ('sixthSense',))
        page._fsToggling.add('damagePanel')
        self.control.want('sixth_sense', ())
        assert 'sixthSense' in page._fsToggling

    def test_event_battle_types_keep_the_stock_element(self):
        page = ClassicPage()
        page._populate()
        self.layer.enter_mode('event')
        self.control.want('team_hp', ('fragCorrelationBar',))
        page._setComponentsVisibility(visible={'fragCorrelationBar'})
        assert page.applied == [({'fragCorrelationBar'}, set())]
        self.layer.enter_mode('comp7')
        self.control.sync()
        assert page.applied[-1] == (set(), {'fragCorrelationBar'})

    def test_an_alias_the_page_does_not_have_is_left_alone(self):
        page = ClassicPage()
        page.components = {'damagePanel': object()}
        page._populate()
        self.control.want('team_hp', ('fragCorrelationBar',))
        assert page.applied == [] and self.control.hidden == frozenset()
        page.components['fragCorrelationBar'] = object()
        self.control.sync()
        assert page.applied[-1] == (set(), {'fragCorrelationBar'})

    def test_panels_follow_the_stock_gui_toggles(self):
        page = ClassicPage()
        page._populate()
        self.layer.show('panel', 'text')
        self.control._on_gui_visibility(Event({'visible': False}))
        assert self.layer.gui_hidden
        self.control._on_gui_visibility(Event({'visible': True}))
        self.control._on_full_stats(Event({'isDown': True}))
        assert self.layer.gui_hidden
        self.control._on_full_stats(Event({'isDown': False}))
        assert not self.layer.gui_hidden
        self.control._on_full_stats(Event({'isDown': True}))
        page._dispose()
        assert not self.layer.gui_hidden and self.control.page is None


if __name__ == '__main__':
    unittest.main()
