from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import selected_vehicle
from ....core.client.native import NativeSettingsComponent
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_CREW, ACTION_DEMOUNT, ACTION_RETURN, plan_crew_return, plan_crew_unload, plan_demount, to_native
from ..settings import SCHEMA, SWITCH
from .processors import demount, return_crew, unload_crew
from .vehicle import device_in, free_berths, summary


class HangarTweaks(NativeSettingsComponent):

    def __init__(self, app):
        NativeSettingsComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS, to_native)

    def _actions_enabled(self):
        return self.enabled_in_hangar() and self.settings.get('quick_actions')

    def ui_actions(self):
        if not self._actions_enabled():
            return []
        translate = self.app.translate
        return [
            {'id': ACTION_DEMOUNT, 'label': translate('hangar_tweaks_demount'), 'confirm': translate('hangar_tweaks_demount_confirm')},
            {'id': ACTION_CREW, 'label': translate('hangar_tweaks_crew'), 'confirm': translate('hangar_tweaks_crew_confirm')},
            {'id': ACTION_RETURN, 'label': translate('hangar_tweaks_return'), 'confirm': translate('hangar_tweaks_return_confirm')},
        ]

    def ui_action(self, action, row=None, value=None):
        vehicle = selected_vehicle()
        if not self._actions_enabled() or vehicle is None:
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
        if action == ACTION_RETURN:
            refusal = plan_crew_return(state)
            if refusal:
                return self._notice('error', 'hangar_tweaks_refused_%s' % refusal)
            return_crew(vehicle, self._done)
            return self._notice('info', 'hangar_tweaks_sent')
        return None

    def _notice(self, kind, key):
        return {'kind': kind, 'text': self.app.translate(key)}

    @safe
    def _done(self, success):
        if not success:
            self.app.ui.notify(self.app.translate('hangar_tweaks_failed'))
