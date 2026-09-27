from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import safe
from ..constants import ICON_PATH, MODS_LIST_ID

try:
    from gui.modsListApi import g_modsListApi
except ImportError:
    g_modsListApi = None


class ModsListButton(object):
    """An entry in ModsList (poliroid, MIT) when a Lesta-compatible release is installed."""

    def __init__(self, on_open):
        self.on_open = on_open
        self.added = False

    @safe
    def install(self, name, description):
        if g_modsListApi is None or self.added:
            return self.added
        g_modsListApi.addModification(id=MODS_LIST_ID, name=name, description=description, icon=ICON_PATH, enabled=True,
                                      login=False, lobby=True, callback=self.on_open)
        self.added = True
        return True
