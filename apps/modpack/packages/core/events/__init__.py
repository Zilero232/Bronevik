"""The app's event bus: one blinker signal per event name (`app.bus`).

Blinker keeps the receivers; the bus adds what the mod needs on top: handlers take the event's own
positional arguments (not blinker's `sender`), run in subscription order on both Pythons, and a failing
handler is logged without stopping the ones after it, so one feature cannot break another.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from collections import OrderedDict  # novermin (2.7 has it; vermin counts 3.1 for the 3.x line)

from ..log import log_exception
from ..vendor.blinker import NamedSignal, Namespace


class OrderedSignal(NamedSignal):
    """A blinker signal whose receivers keep their connection order (2.7's dict does not)."""

    def __init__(self, name, doc=None):
        NamedSignal.__init__(self, name, doc)
        self.receivers = OrderedDict()


class Signals(Namespace):

    def signal(self, name, doc=None):
        try:
            return self[name]
        except KeyError:
            return self.setdefault(name, OrderedSignal(name, doc))


class EventBus(object):
    """Named events with handlers called in subscription order."""

    def __init__(self, on_error=None):
        self.signals = Signals()
        self._on_error = on_error or log_exception

    def signal(self, name):
        return self.signals.signal(name)

    def on(self, name, handler):
        """Subscribe `handler(*args, **kwargs)` to `name`; subscribing the same handler twice is a no-op."""
        return self.signal(name).connect(handler, weak=False)

    def off(self, name, handler):
        if name in self.signals:
            self.signals[name].disconnect(handler)

    def has(self, name):
        return name in self.signals and bool(self.signals[name].receivers)

    def emit(self, name, *args, **kwargs):
        signal = self.signals.get(name)
        if signal is None:
            return
        for handler in list(signal.receivers.values()):
            try:
                handler(*args, **kwargs)
            except Exception:
                self._on_error('%s handler' % name)
