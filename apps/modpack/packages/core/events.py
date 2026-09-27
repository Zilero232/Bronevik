from .log import log_exception


class EventBus(object):
    """Named events with handlers called in subscription order.

    A failing handler is logged and never stops the handlers after it, so one feature cannot break another.
    """

    def __init__(self, on_error=None):
        self._handlers = {}
        self._on_error = on_error or log_exception

    def on(self, name, handler):
        handlers = self._handlers.setdefault(name, [])
        if handler not in handlers:
            handlers.append(handler)
        return handler

    def off(self, name, handler):
        handlers = self._handlers.get(name)
        if handlers and handler in handlers:
            handlers.remove(handler)

    def has(self, name):
        return bool(self._handlers.get(name))

    def emit(self, name, *args, **kwargs):
        for handler in list(self._handlers.get(name, ())):
            try:
                handler(*args, **kwargs)
            except Exception:
                self._on_error('%s handler' % name)
