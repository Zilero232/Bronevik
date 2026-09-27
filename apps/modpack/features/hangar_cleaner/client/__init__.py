from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.game import client_attr, service
from ....core.hooks import override
from ....core.log import log, log_exception
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import EVENT_ENTRIES, OFFER_BANNERS, TEASER, hides
from ..settings import SCHEMA, SWITCH
from .constants import (EVENT_ENTRY_FLASH, EVENT_ENTRY_METHOD, HANGAR_CLASS, HANGAR_MODULE, OFFERS_METHOD, OFFERS_SKELETON,
                        OFFERS_SKELETON_MODULE, TEASER_METHOD)


class HangarCleaner(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.installed = []
        hangar = client_attr(HANGAR_MODULE, HANGAR_CLASS)
        if hangar is not None:
            self._install(hangar, TEASER_METHOD, self._teaser)
            self._install(hangar, EVENT_ENTRY_METHOD, self._event_entries)
        offers = service(client_attr(OFFERS_SKELETON_MODULE, OFFERS_SKELETON))
        if offers is not None:
            self._install(offers, OFFERS_METHOD, self._offers)
        if not self.installed:
            log('hangar cleaner: hangar view not found, feature off')

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
