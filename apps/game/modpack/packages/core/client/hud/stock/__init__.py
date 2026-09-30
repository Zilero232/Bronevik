"""Hides the stock battle HUD elements our Gameface panels replace, and follows the stock GUI toggles.

RU 1.45 client source (gui/Scaleform/daapi/view/battle/shared/page.py): `SharedPage._setComponentsVisibility(visible,
hidden)` is how the battle page shows and hides its components, again and again (control mode, full stats, postmortem),
so a one-off hide gets undone. We wrap it: the original always runs, with our suppressed aliases moved from `visible` to
`hidden` (`core.hud.stock`). Only `ClassicPage` and its subclasses are touched, and only in the battle types that replace
stock elements (`core.hud.modes.suppresses`: random, training, comp7); the event pages built on ClassicPage (Waffentrager,
story mode), Frontline and Steel Hunter keep every stock element. An alias the page has no component for is never hidden
(`page.components`, the DAAPI components the page registered). An alias we gave back is shown again at once
(`as_setComponentsVisibilityS`), or handed to the page's full-stats set while Tab is open so it comes back with the rest.

`GameEvent.GUI_VISIBILITY` (V) and `GameEvent.FULL_STATS` (Tab) take our battle panels off the screen with the stock GUI.
`GameEvent.SHOW_EXTENDED_INFO` (Alt held, the key the stock markers, players panel and damage log expand on) goes out as
`battle_extended_info(held)` on the app bus for the panels with an alternate mode.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....hooks import override
from ....hud.modes import suppresses
from ....hud.stock import StockSuppression
from ....log import log, log_exception, safe
from .constants import EXTENDED_INFO_DOWN, EXTENDED_INFO_EVENT, FULL_STATS_DOWN, GUI_VISIBLE

try:
    from gui.Scaleform.daapi.view.battle.classic.page import ClassicPage
    from gui.Scaleform.daapi.view.battle.shared.page import SharedPage
    IMPORT_ERROR = None
except Exception as error:  # the battle page moved: every stock element stays
    ClassicPage = SharedPage = None
    IMPORT_ERROR = error


class StockControl(object):

    def __init__(self, layer, bus):
        self.layer = layer
        self.bus = bus
        self.suppression = StockSuppression()
        self.page = None
        self.installed = False
        self.gui_visible = True
        self.full_stats = False
        self.extended = False
        self.hidden = frozenset()

    @safe
    def install(self):
        if self.installed:
            return True
        self.installed = True
        if IMPORT_ERROR is not None:
            log('HUD: stock panels stay (battle page: %s)' % IMPORT_ERROR)
            return False
        control = self

        @override(SharedPage, '_setComponentsVisibility')
        def _set_components_visibility(original, page, visible=None, hidden=None):
            if page is control.page and control.hidden:
                visible, hidden = control.suppression.filter(visible, hidden, control.hidden)
            return original(page, visible, hidden)

        @override(SharedPage, '_populate')
        def _populate(original, page, *args, **kwargs):
            result = original(page, *args, **kwargs)
            control.attach(page)
            return result

        @override(SharedPage, '_dispose')
        def _dispose(original, page, *args, **kwargs):
            control.detach(page)
            return original(page, *args, **kwargs)

        self._listen_gui()
        return True

    def attach(self, page):
        if ClassicPage is None or not isinstance(page, ClassicPage):
            return
        self.page = page
        self.hidden = frozenset()
        self.gui_visible, self.full_stats = True, False
        self.layer.set_gui_hidden(False)
        self._set_extended(False)
        self.sync()

    def detach(self, page):
        if page is self.page:
            self.page = None
            self.hidden = frozenset()
            self.layer.set_gui_hidden(False)
            self._set_extended(False)

    def present(self, alias):
        """Whether the attached page has a stock component `alias` (True while the page has registered none yet)."""
        components = getattr(self.page, 'components', None)
        if not isinstance(components, dict) or not components:
            return True
        return alias in components

    def in_force(self):
        """The suppressed aliases that apply to the attached page in the current battle type."""
        if self.page is None or not suppresses(self.layer.mode):
            return frozenset()
        return frozenset(alias for alias in self.suppression.aliases if self.present(alias))

    def want(self, owner, aliases):
        """Replace `aliases` for `owner` (a component id); `()` gives them back to the stock page."""
        self.install()
        self.suppression.want(owner, aliases)
        self.sync(owner)

    def sync(self, owner=None):
        """Hide what is in force and not hidden yet, give back what we hid and no longer replace."""
        target = self.in_force()
        hidden, released = target - self.hidden, self.hidden - target
        self.hidden = target
        self._hide(hidden)
        self._show(released)
        if hidden or released:
            log('HUD: stock %s hidden, %s restored (%s)' % (sorted(hidden) or '-', sorted(released) or '-', owner or 'battle type'))

    def _hide(self, aliases):
        page = self.page
        if page is None or not aliases:
            return
        try:
            page.as_setComponentsVisibilityS(set(), set(aliases))
        except Exception:
            log_exception('HUD: hide stock %s' % sorted(aliases))

    def _show(self, aliases):
        page = self.page
        if page is None or not aliases:
            return
        toggling = getattr(page, '_fsToggling', None)
        if toggling:
            toggling.update(aliases)
            return
        try:
            page.as_setComponentsVisibilityS(set(aliases), set())
        except Exception:
            log_exception('HUD: restore stock %s' % sorted(aliases))

    def _listen_gui(self):
        try:
            from gui.shared import EVENT_BUS_SCOPE, events, g_eventBus
        except ImportError:
            return
        game_event = getattr(events, 'GameEvent', None)
        for name, handler in (('GUI_VISIBILITY', self._on_gui_visibility), ('FULL_STATS', self._on_full_stats),
                              ('SHOW_EXTENDED_INFO', self._on_extended_info)):
            event = getattr(game_event, name, None)
            if event is not None:
                g_eventBus.addListener(event, handler, EVENT_BUS_SCOPE.BATTLE)

    @safe
    def _on_gui_visibility(self, event):
        self.gui_visible = bool((getattr(event, 'ctx', None) or {}).get(GUI_VISIBLE, True))
        self._follow()

    @safe
    def _on_full_stats(self, event):
        self.full_stats = bool((getattr(event, 'ctx', None) or {}).get(FULL_STATS_DOWN, False))
        self._follow()

    @safe
    def _on_extended_info(self, event):
        self._set_extended(bool((getattr(event, 'ctx', None) or {}).get(EXTENDED_INFO_DOWN, False)))

    def _set_extended(self, held):
        if held != self.extended:
            self.extended = held
            self.bus.emit(EXTENDED_INFO_EVENT, held)

    def _follow(self):
        self.layer.set_gui_hidden(self.page is not None and (not self.gui_visible or self.full_stats))
