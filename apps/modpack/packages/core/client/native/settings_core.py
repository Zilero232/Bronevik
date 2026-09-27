from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import log_exception
from ...native_settings import merge_value


def settings_core():
    try:
        from helpers import dependency
        from skeletons.account_helpers.settings_core import ISettingsCore
        return dependency.instance(ISettingsCore)
    except Exception:
        return None


def read_settings(names):
    """{name: value} of the player's settings the core knows (an unknown name is left out), or None."""
    core = settings_core()
    if core is None:
        return None
    values = {}
    for name in names:
        try:
            value = core.getSetting(name)
        except Exception:
            continue
        if value is not None:
            values[name] = value
    return values


def apply_settings(values):
    """Writes settings the way the game's settings window does (apply, confirm, store). False without a core."""
    core = settings_core()
    if core is None:
        return False
    if not values:
        return True
    try:
        confirmators = core.applySettings(dict(values))
        confirm = getattr(core, 'confirmChanges', None)
        if confirm is not None:
            confirm(confirmators)
        apply_storages = getattr(core, 'applyStorages', None)
        if apply_storages is not None:
            apply_storages(False)
    except Exception:
        log_exception('apply client settings')
        return False
    return True


def apply_changed(values):
    """Applies only the values that differ from the current ones (unknown names are skipped)."""
    current = read_settings(list(values))
    if current is None:
        return False
    diff = {}
    for name, value in values.items():
        if name in current:
            value = merge_value(current[name], value)
            if current[name] != value:
                diff[name] = value
    return apply_settings(diff)
