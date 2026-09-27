from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import client_attr
from ....core.hooks import override
from ....core.log import log, safe
from ..constants import BUTTON_HOSTS
from ..window import BUTTON_LAYOUT, HangarButtonView


def _host_class():
    for module_name, class_name in BUTTON_HOSTS:
        host = client_attr(module_name, class_name)
        if host is not None:
            return host
    return None


# UNVERIFIED on Lesta 1.45: the hangar host view names and setChildView.
class HangarButton(object):

    def __init__(self, on_open):
        self.on_open = on_open
        self.host = None

    @safe
    def install(self):
        if HangarButtonView is None or self.host is not None:
            return self.host is not None
        host = _host_class()
        if host is None:
            log('ui: no hangar Gameface view to host the button, use ModsList or Ctrl+Shift+T')
            return False
        on_open = self.on_open

        @override(host, '_onLoading')
        def _on_loading(original, view, *args, **kwargs):
            result = original(view, *args, **kwargs)
            view.setChildView(BUTTON_LAYOUT(), HangarButtonView(on_open))
            return result

        self.host = host
        return True
