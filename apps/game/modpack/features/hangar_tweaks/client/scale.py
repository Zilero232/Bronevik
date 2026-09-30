from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.native.settings_core import settings_core
from ....core.hooks import subscribe
from ....core.log import log_exception
from ..model.constants import INTERFACE_SCALE

# RU 1.45 client source: account_helpers/settings_core/options.InterfaceScaleSetting.setSystemValue(scale) resizes the
# stage (event_dispatcher.changeAppResolution) and the glyph cache; InterfaceScaleManager.changeScale(scale) sends
# onScaleChanged and BigWorld's own scale; scaleChanged() puts the scale saved in the preferences back (what a
# resolution change runs through g_guiResetters). Nothing here writes the preferences.


def current_scale():
    return settings_core().interfaceScale.get()


def apply_scale(scale):
    core = settings_core()
    core.options.getSetting(INTERFACE_SCALE).setSystemValue(scale)
    core.interfaceScale.changeScale(scale)


def restore_scale():
    core = settings_core()
    stored = core.getSetting(INTERFACE_SCALE)
    core.options.getSetting(INTERFACE_SCALE).setSystemValue(stored)
    core.interfaceScale.scaleChanged()


def on_scale_changed(callback):
    try:
        subscribe(settings_core().interfaceScale, 'onScaleChanged', callback)
    except Exception:
        log_exception('hangar tweaks: interface scale')
