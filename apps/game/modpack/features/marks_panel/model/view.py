from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import DETAIL_SWITCHES, REST_STYLE


class PanelView(object):
    """The settings one render reads. With `alt_detail` on the panel rests in its short style (compact instead of
    extended) and shows the extended view with every line and the detail line while Alt is held."""

    def __init__(self, settings, held=False):
        self.settings = settings
        self.overrides = {'detail': False}
        if not settings.get('alt_detail'):
            return
        if held:
            self.overrides = dict((key, True) for key in DETAIL_SWITCHES + ('detail',))
            self.overrides['style'] = 'extended'
        elif settings.get('style') == 'extended':
            self.overrides['style'] = REST_STYLE

    def get(self, key):
        return self.overrides[key] if key in self.overrides else self.settings.get(key)
