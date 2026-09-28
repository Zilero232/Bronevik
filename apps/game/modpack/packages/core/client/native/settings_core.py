from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import log_exception
from ...native_settings import merge_value, write_settings
from ..game import service


def settings_core():
    try:
        from skeletons.account_helpers.settings_core import ISettingsCore
    except ImportError:
        return None
    return service(ISettingsCore)


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
    """Writes settings the way the game's settings window does (apply, store, confirm, clear). False without a core."""
    core = settings_core()
    if core is None:
        return False
    if not values:
        return True
    try:
        write_settings(core, values)
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
