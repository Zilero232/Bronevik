from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import ACTION_RECOMMENDED, ACTION_RESTORE, INITIAL_REVISION, NATIVE, PENDING, STEP_APPLY, STEP_NATIVE


def _dict_of(value):
    return dict(value) if isinstance(value, dict) else {}


def client_keys(schema):
    """The keys of `schema` that are client settings: those whose choices offer 'native', sorted."""
    return tuple(sorted(key for key, choices in schema.choices.items() if NATIVE in choices))


def native_choices(keys):
    return dict((key, NATIVE) for key in keys)


def recommended(schema, keys):
    """The recommended client values: the schema defaults of `keys`."""
    return dict((key, schema.defaults[key]) for key in keys)


def is_recommended(values, schema, keys):
    return all(values.get(key) == schema.defaults[key] for key in keys)


def offered_action(has_backup, holds_recommended):
    """The card's one button: restore while a backup exists, else the recommended values unless they are set."""
    if has_backup:
        return ACTION_RESTORE
    if holds_recommended:
        return None
    return ACTION_RECOMMENDED


class NativeState(object):
    """The one-time client presets in state.json: `backups` {component: {'settings', 'account'}} of the client values
    a component replaced, and `stamps` {component: revision}, PENDING while a fresh install still has to write them."""

    def __init__(self, backups=None, stamps=None):
        self.backups = _dict_of(backups)
        self.stamps = _dict_of(stamps)

    def enroll(self, component_id, fresh_install):
        """Stamps a component seen for the first time: due on a fresh install, done otherwise. True when it was new."""
        if component_id in self.stamps:
            return False
        self.stamps[component_id] = PENDING if fresh_install else INITIAL_REVISION
        return True

    def is_due(self, component_id):
        return self.stamps.get(component_id) == PENDING

    def hangar_step(self, component_id, is_enabled):
        """What a component due its presets does in the hangar: STEP_APPLY them with its switch on, else STEP_NATIVE
        (its client values go to 'native', so turning it on later writes nothing unasked). None when not due."""
        if not self.is_due(component_id):
            return None
        return STEP_APPLY if is_enabled else STEP_NATIVE

    def settle(self, component_id):
        self.stamps[component_id] = INITIAL_REVISION

    def backup(self, component_id):
        backup = self.backups.get(component_id)
        if not isinstance(backup, dict):
            return None
        return _dict_of(backup.get('settings')), _dict_of(backup.get('account'))

    def keep(self, component_id, settings, account):
        self.backups[component_id] = {'settings': dict(settings), 'account': dict(account)}

    def drop(self, component_id):
        self.backups.pop(component_id, None)

    def dump_backups(self):
        return dict(self.backups)

    def dump_stamps(self):
        return dict(self.stamps)
