from __future__ import absolute_import, division, print_function, unicode_literals

import types

from ....core.client.component import FeatureComponent
from ....core.client.game import client_attr, client_version, service
from ....core.hooks import override
from ....core.log import log, log_exception
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import EVENT_ENTRIES, OFFER_BANNERS, TEASER, hides, private_overrides_allowed
from ..settings import SCHEMA, SWITCH
from .constants import (BANNER_WINDOW_CLASS, BANNER_WINDOW_METHOD, BANNER_WINDOW_MODULE, EVENT_ENTRY_FLASH, EVENT_ENTRY_METHOD, HANGAR_CLASS,
                        HANGAR_MODULE, OFFERS_METHOD, OFFERS_SKELETON, OFFERS_SKELETON_MODULE, TEASER_METHOD)


def _own_function(owner, name):
    return isinstance(getattr(owner, '__dict__', {}).get(name), types.FunctionType)


class HangarCleaner(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.installed = []
        self._install_hangar()
        offers = service(client_attr(OFFERS_SKELETON_MODULE, OFFERS_SKELETON))
        if offers is not None:
            self._install(offers, OFFERS_METHOD, self._offers)
        banner_window = client_attr(BANNER_WINDOW_MODULE, BANNER_WINDOW_CLASS)
        if banner_window is not None:
            self._install(banner_window, BANNER_WINDOW_METHOD, self._banner_window)
        log('hangar cleaner: hooks %s' % (', '.join(self.installed) or 'none, feature off'))

    def _install_hangar(self):
        hangar = client_attr(HANGAR_MODULE, HANGAR_CLASS)
        if hangar is None:
            return
        version = client_version()
        if not private_overrides_allowed(version):
            log('hangar cleaner: client %r not verified, teaser and event entries left alone' % version)
            return
        for name in (TEASER_METHOD, EVENT_ENTRY_METHOD):
            if not _own_function(hangar, name):
                log('hangar cleaner: Hangar.%s not found, teaser and event entries left alone' % name)
                return
        if getattr(hangar, EVENT_ENTRY_FLASH, None) is None:
            log('hangar cleaner: Hangar.%s not found, event entries left alone' % EVENT_ENTRY_FLASH)
        else:
            self._install(hangar, EVENT_ENTRY_METHOD, self._event_entries)
        self._install(hangar, TEASER_METHOD, self._teaser)

    def _install(self, owner, name, handler):
        if getattr(owner, name, None) is None:
            return
        try:
            override(owner, name)(handler)
            self.installed.append(name)
        except Exception:
            log_exception('hangar cleaner %s' % name)

    def hides(self, element):
        return hides(element, self.settings.to_dict(), self.enabled())

    def _teaser(self, original, view, *args, **kwargs):
        if self.hides(TEASER):
            return None
        return original(view, *args, **kwargs)

    def _event_entries(self, original, view, *args, **kwargs):
        if not self.hides(EVENT_ENTRIES):
            return original(view, *args, **kwargs)
        getattr(view, EVENT_ENTRY_FLASH)(False)
        return None

    def _offers(self, original, *args, **kwargs):
        if self.hides(OFFER_BANNERS):
            return None
        return original(*args, **kwargs)

    def _banner_window(self, original, *args, **kwargs):
        if self.hides(OFFER_BANNERS):
            return None
        return original(*args, **kwargs)
