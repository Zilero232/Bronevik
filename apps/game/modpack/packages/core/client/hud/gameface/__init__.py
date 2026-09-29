"""OpenWG Gameface as a HUD backend: one transparent Gameface window, the ui package's HUD page
(`packages/ui/gameface/hud.html`, registered as `otmetki/ui/hud` in its res_map), draws every label.

OpenWG Gameface (openwg_gameface, MIT) only registers resources and injects scripts; the window itself is the
client's wulf `WindowImpl` + `ViewImpl`, the same classes the settings window uses. The client opens Gameface
windows in battle too (RU 1.45 client source: `PopOverWindow(..., WindowLayer.TOP_WINDOW)` in the prebattle
ammunition panel, the Gameface tooltips of the battle full stats). UNVERIFIED on Lesta 1.45: that a
non-modal WINDOW over the battle page takes no keyboard focus and passes the mouse through where the page
has `pointer-events: none`; that it survives the change from the hangar to the battle (a destroyed window is
opened again on the next label update). Any failure to open marks the backend broken, and the chain moves on
to GUIFlash.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....hud import HudBackend
from ....hud.surface import HUD_MESSAGE_ARG, HUD_RES_MAP_ID, HUD_SEND_COMMAND, HUD_STATE_PROPERTY, SPACE_LOBBY, HudSurface
from ....log import log, log_exception, safe
from ..modifier import ModifierWatch
from ..space import current_space, cursor_events
from .constants import INVALID_RES_ID, WINDOW_LAYER

try:
    from frameworks.wulf import ViewFlags, ViewModel, ViewSettings, WindowFlags, WindowLayer
    from gui.impl.pub import ViewImpl, WindowImpl
    import openwg_gameface
    IMPORT_ERROR = None
except Exception as error:  # any failure inside a third-party import must not stop the core
    openwg_gameface = None
    IMPORT_ERROR = error


def message_of(args):
    if isinstance(args, dict):
        return args.get(HUD_MESSAGE_ARG)
    getter = getattr(args, 'get', None)
    return getter(HUD_MESSAGE_ARG) if getter is not None else None


def layout_id():
    """The resource id of the HUD page, or None until OpenWG Gameface has validated the res_map (or when
    the ui package, which ships the page, is not installed)."""
    finder = getattr(openwg_gameface, 'res_id_by_key', None)
    if finder is None:
        return None
    try:
        found = finder(HUD_RES_MAP_ID)
    except Exception:
        return None
    return found if isinstance(found, int) and found != INVALID_RES_ID else None


if IMPORT_ERROR is None:

    class HudViewModel(ViewModel):

        def __init__(self, properties=1, commands=1):
            super(HudViewModel, self).__init__(properties=properties, commands=commands)

        def _initialize(self):
            super(HudViewModel, self)._initialize()
            self._addStringProperty(HUD_STATE_PROPERTY, '')
            self.send = self._addCommand(HUD_SEND_COMMAND)

        def set_state(self, text):
            self._setString(0, text)

    class HudView(ViewImpl):

        def __init__(self, layout, backend):
            super(HudView, self).__init__(ViewSettings(layout, flags=ViewFlags.VIEW, model=HudViewModel()))
            self.backend = backend

        @property
        def viewModel(self):
            return super(HudView, self).getViewModel()

        def _onLoading(self, *args, **kwargs):
            super(HudView, self)._onLoading(*args, **kwargs)
            self.viewModel.send += self._on_send
            self.backend.on_loaded(self)

        def _finalize(self):
            self.viewModel.send -= self._on_send
            self.backend.on_destroyed(self)
            super(HudView, self)._finalize()

        @safe
        def _on_send(self, args=None):
            self.backend.on_message(message_of(args))

    class HudWindow(WindowImpl):

        def __init__(self, layout, backend):
            super(HudWindow, self).__init__(wndFlags=WindowFlags.WINDOW, content=HudView(layout, backend),
                                            layer=getattr(WindowLayer, WINDOW_LAYER))

else:
    HudWindow = None


class GamefaceBackend(HudBackend):

    name = 'gameface'

    def __init__(self):
        self.surface = HudSurface()
        self.window = None
        self.view = None
        self.broken = False
        self.listeners = []
        self.press_listeners = []
        self.cursor = False
        self.modifier = ModifierWatch(self._on_modifier)
        self._listen_cursor()

    @classmethod
    def usable(cls):
        return IMPORT_ERROR is None

    @classmethod
    def missing_reason(cls):
        return 'OpenWG Gameface: %s' % (IMPORT_ERROR or 'not installed')

    def available(self):
        return self.usable() and not self.broken and layout_id() is not None

    def create(self, alias, props):
        self.surface.create(alias, props, current_space())
        if self.sync():
            return True
        self.surface.delete(alias)
        return False

    def update(self, alias, props):
        return self.surface.update(alias, props) and self.sync()

    def delete(self, alias):
        return self.surface.delete(alias) and self.sync()

    def listen(self, on_moved):
        if on_moved not in self.listeners:
            self.listeners.append(on_moved)

    def draws_buttons(self):
        return True

    def listen_press(self, on_press):
        if on_press not in self.press_listeners:
            self.press_listeners.append(on_press)

    def set_modifier(self, mode):
        self.modifier.set_mode(mode)

    def state_text(self):
        space = current_space()
        return self.surface.encode(space, space == SPACE_LOBBY or self.cursor, self.modifier.held)

    def push_state(self):
        if self.view is not None:
            self.view.viewModel.set_state(self.state_text())

    @safe
    def sync(self):
        if not self.surface.aliases(current_space()):
            self.close()
            return True
        if self.window is None and not self.open():
            return False
        self.push_state()
        return True

    def open(self):
        layout = layout_id()
        if layout is None or self.broken:
            return False
        try:
            self.modifier.install()
            self.window = HudWindow(layout, self)
            self.window.load()
        except Exception:
            log_exception('HUD: Gameface window')
            log('HUD: the Gameface HUD window failed to open, falling back to GUIFlash')
            self.broken = True
            self.window = None
            return False
        return True

    @safe
    def close(self):
        window, self.window, self.view = self.window, None, None
        if window is not None:
            window.destroy()

    def on_loaded(self, view):
        self.view = view
        view.viewModel.set_state(self.state_text())

    def on_destroyed(self, view):
        if self.view is view or self.view is None:
            self.view = None
            self.window = None

    @safe
    def on_message(self, raw):
        decoded = self.surface.handle(raw)
        if decoded is None:
            return
        command, fields = decoded
        if command == 'ready':
            self.push_state()
        elif command == 'pressed':
            for listener in list(self.press_listeners):
                listener(fields['id'])
        elif command in ('moved', 'resized'):
            props = dict((key, value) for key, value in fields.items() if key != 'id')
            for listener in list(self.listeners):
                listener(fields['id'], props)

    def _listen_cursor(self):
        found = cursor_events()
        if found is None:
            return
        bus, scope, show, hide = found
        bus.addListener(show, self._on_show_cursor, scope)
        bus.addListener(hide, self._on_hide_cursor, scope)

    @safe
    def _on_show_cursor(self, *args):
        self.cursor = True
        self.push_state()

    @safe
    def _on_hide_cursor(self, *args):
        self.cursor = False
        self.push_state()

    @safe
    def _on_modifier(self, held):
        self.push_state()
