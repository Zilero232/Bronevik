from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.native import NativeSettingsComponent
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_CREW, ACTION_DEMOUNT, plan_crew_unload, plan_demount, to_native
from ..settings import SCHEMA, SWITCH
from .processors import demount, unload_crew
from .vehicle import device_in, free_berths, selected_vehicle, summary


class HangarTweaks(object):
    """Carousel options (client settings, written when changed) and the quick actions of the window."""

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.carousel = NativeSettingsComponent(app, FEATURE_ID, SCHEMA, SWITCH, to_native)
        self.settings = self.carousel.settings

    def _enabled(self):
        return self.app.config.is_enabled(SWITCH) and self.settings.get('quick_actions') and not self.app.in_battle

    def ui_actions(self):
        if not self._enabled():
            return []
        translate = self.app.translate
        return [
            {'id': ACTION_DEMOUNT, 'label': translate('hangar_tweaks_demount'), 'confirm': translate('hangar_tweaks_demount_confirm')},
            {'id': ACTION_CREW, 'label': translate('hangar_tweaks_crew'), 'confirm': translate('hangar_tweaks_crew_confirm')},
        ]

    def ui_action(self, action, row=None, value=None):
        vehicle = selected_vehicle()
        if not self._enabled() or vehicle is None:
            return self._notice('error', 'hangar_tweaks_refused_nothing')
        state = summary(vehicle)
        if action == ACTION_DEMOUNT:
            slots, refusal = plan_demount(state)
            if refusal:
                return self._notice('error', 'hangar_tweaks_refused_%s' % refusal)
            for slot in slots:
                demount(vehicle, device_in(vehicle, slot), slot, self._done)
            return self._notice('info', 'hangar_tweaks_sent')
        if action == ACTION_CREW:
            count, refusal = plan_crew_unload(state, free_berths())
            if refusal:
                return self._notice('error', 'hangar_tweaks_refused_%s' % refusal)
            unload_crew(vehicle, self._done)
            return self._notice('info', 'hangar_tweaks_sent')
        return None

    def _notice(self, kind, key):
        return {'kind': kind, 'text': self.app.translate(key)}

    @safe
    def _done(self, success):
        if not success:
            self.app.ui.notify(self.app.translate('hangar_tweaks_failed'))
