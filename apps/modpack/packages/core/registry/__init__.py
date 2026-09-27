"""Lazy feature registry.

The client imports every `mod_*.pyc` in hash order, so there is no load order between packages. Each
feature's entry script calls `registry().register(...)` whenever it runs; the host (the companion app)
calls `registry().bind(host)` when it starts. A feature registered before the host is attached on
`bind`, one registered after is attached at once. Both calls are idempotent.
"""
from ..log import log, log_exception


class FeatureRegistry(object):

    def __init__(self):
        self.factories = []
        self.instances = {}
        self.host = None

    def register(self, feature_id, factory):
        if feature_id in [entry[0] for entry in self.factories]:
            return False
        self.factories.append((feature_id, factory))
        if self.host is not None:
            self._attach(feature_id, factory)
        return True

    def bind(self, host):
        if self.host is not None:
            return self.host is host
        self.host = host
        for feature_id, factory in list(self.factories):
            self._attach(feature_id, factory)
        return True

    def _attach(self, feature_id, factory):
        if feature_id in self.instances:
            return
        try:
            self.instances[feature_id] = factory(self.host)
        except Exception:
            log_exception('feature %s' % feature_id)
            return
        log('feature %s attached' % feature_id)

    def get(self, feature_id):
        return self.instances.get(feature_id)


_state = {'registry': None}


def registry():
    """The process-wide registry, created on first use (core has no init of its own)."""
    if _state['registry'] is None:
        _state['registry'] = FeatureRegistry()
    return _state['registry']


def reset():
    """Tests only: forget the process-wide registry."""
    _state['registry'] = None
