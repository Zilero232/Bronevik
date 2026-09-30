from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.hud import component_config
from ....core.log import log
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_CHOOSE, ACTION_NATIVE, build_page, override_changes, space_names, space_path
from ..settings import SCHEMA, SWITCH
from .space import available_paths, controller, current_name, is_default_scene, overrides, write_overrides


# The hangar space the player picked stands in for the game's default one: written into the client's default hangar
# config the way its server event notifications write theirs, so an event hangar and the hangars of other modes still
# win, and taken out again when the switch goes off or the choice goes back to the game's own.
class HangarSpace(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.owned = None
        app.bus.on('hangar', self.apply)

    def settings_changed(self, changed):
        self.apply()

    def wanted_path(self):
        return space_path(self.settings.get('space')) if self.enabled() else None

    def apply(self):
        switcher = controller()
        if switcher is None or self.app.in_battle:
            return
        wanted = self.wanted_path()
        changes = override_changes(overrides(switcher), self.owned, wanted)
        self.owned = wanted
        if not changes:
            return
        write_overrides(switcher, changes)
        log('hangar space: %s' % (wanted or 'the game default'))
        if is_default_scene(switcher):
            switcher.processPossibleSceneChange()

    def ui_page(self):
        if not self.enabled_in_hangar():
            return None
        names = space_names(available_paths())
        return build_page(names, self.settings.get('space'), current_name(), self.app.translate)

    def ui_action(self, action, row=None, value=None):
        if not self.enabled_in_hangar() or action not in (ACTION_CHOOSE, ACTION_NATIVE):
            return None
        chosen = row if action == ACTION_CHOOSE else u''
        if chosen and chosen not in space_names(available_paths()):
            return self.notice_error('hangar_space_refused_missing')
        component_config(self.app).update(self.component_id, {'space': chosen})
        self.apply()
        return self.notice_info('hangar_space_sent')
