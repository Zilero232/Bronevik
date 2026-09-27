"""The Gameface window: a ViewModel with one string property (`state`) and one command (`send`), its
ViewImpl and a WindowImpl, registered through OpenWG Gameface (openwg_gameface, a runtime dependency we
do not bundle; Lesta needs its Lesta-compatible build). API names follow docs.wotstat.info
(Gameface theory) and are UNVERIFIED on Lesta 1.45."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...protocol import (BUTTON_MARKER, BUTTON_MARKER_VALUE, GAMEFACE_ROOT, MESSAGE_ARG, RES_MAP_BUTTON, RES_MAP_WINDOW, SEND_COMMAND,
                         STATE_PROPERTY)

try:
    from frameworks.wulf import ViewFlags, ViewModel, ViewSettings, WindowFlags
    from gui.impl.pub import ViewImpl, WindowImpl
    from openwg_gameface import ModDynAccessor, gf_mod_inject
    AVAILABLE = True
except ImportError:
    AVAILABLE = False

# Module-level accessors: a plain function stored on a class would become an unbound method on Python 2.
SETTINGS_LAYOUT = ModDynAccessor(RES_MAP_WINDOW) if AVAILABLE else None
BUTTON_LAYOUT = ModDynAccessor(RES_MAP_BUTTON) if AVAILABLE else None


def message_of(args):
    """The JSON text of a `send` command: the page calls model.send({message: '<json>'})."""
    if isinstance(args, dict):
        return args.get(MESSAGE_ARG)
    getter = getattr(args, 'get', None)
    return getter(MESSAGE_ARG) if getter is not None else None


if AVAILABLE:

    class SettingsViewModel(ViewModel):

        def __init__(self, properties=1, commands=1):
            super(SettingsViewModel, self).__init__(properties=properties, commands=commands)

        def _initialize(self):
            super(SettingsViewModel, self)._initialize()
            self._addStringProperty(STATE_PROPERTY, '')
            self.send = self._addCommand(SEND_COMMAND)

        def set_state(self, text):
            self._setString(0, text)

    class SettingsGameView(ViewImpl):

        def __init__(self, controller):
            settings = ViewSettings(SETTINGS_LAYOUT(), flags=ViewFlags.VIEW, model=SettingsViewModel())
            super(SettingsGameView, self).__init__(settings)
            self.controller = controller

        @property
        def viewModel(self):
            return super(SettingsGameView, self).getViewModel()

        def _onLoading(self, *args, **kwargs):
            super(SettingsGameView, self)._onLoading(*args, **kwargs)
            self.viewModel.send += self._on_send
            self.controller.on_loaded(self)

        def _finalize(self):
            self.viewModel.send -= self._on_send
            self.controller.on_destroyed(self)
            super(SettingsGameView, self)._finalize()

        def _on_send(self, args=None):
            self.controller.on_message(message_of(args))

    class SettingsWindow(WindowImpl):

        def __init__(self, controller):
            super(SettingsWindow, self).__init__(wndFlags=WindowFlags.WINDOW, content=SettingsGameView(controller))

    class ButtonViewModel(ViewModel):
        """The injected button.js finds this model by its marker property and calls `open`."""

        def __init__(self, properties=1, commands=1):
            super(ButtonViewModel, self).__init__(properties=properties, commands=commands)

        def _initialize(self):
            super(ButtonViewModel, self)._initialize()
            self._addStringProperty(BUTTON_MARKER, BUTTON_MARKER_VALUE)
            self.open = self._addCommand('open')
            gf_mod_inject(self, RES_MAP_BUTTON, styles=[GAMEFACE_ROOT + '/button.css'], modules=[GAMEFACE_ROOT + '/button.js'])

    class HangarButtonView(ViewImpl):
        """A child of a hangar Gameface view; its only job is to inject the button's JS/CSS into the page."""

        def __init__(self, on_open):
            settings = ViewSettings(BUTTON_LAYOUT(), flags=ViewFlags.VIEW, model=ButtonViewModel())
            super(HangarButtonView, self).__init__(settings)
            self.on_open = on_open

        def _onLoading(self, *args, **kwargs):
            super(HangarButtonView, self)._onLoading(*args, **kwargs)
            self.getViewModel().open += self._on_open

        def _finalize(self):
            self.getViewModel().open -= self._on_open
            super(HangarButtonView, self)._finalize()

        def _on_open(self, args=None):
            self.on_open()

else:
    SettingsWindow = None
    HangarButtonView = None
