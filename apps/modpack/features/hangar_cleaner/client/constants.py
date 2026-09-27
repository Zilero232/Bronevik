from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: gui/Scaleform/daapi/view/lobby/hangar/Hangar.py. The Hangar view subscribes
# `self.__onTeaserReceived` to the promo controller and calls `self.__updateCarouselEventEntryState()`
# (as_updateCarouselEventEntryStateS(isAnyEntryVisible())); `_populate` calls
# `IOffersBannerController.showBanners()`.
HANGAR_MODULE = 'gui.Scaleform.daapi.view.lobby.hangar.Hangar'
HANGAR_CLASS = 'Hangar'
TEASER_METHOD = '_Hangar__onTeaserReceived'
EVENT_ENTRY_METHOD = '_Hangar__updateCarouselEventEntryState'
EVENT_ENTRY_FLASH = 'as_updateCarouselEventEntryStateS'
OFFERS_SKELETON_MODULE = 'skeletons.gui.offers'
OFFERS_SKELETON = 'IOffersBannerController'
OFFERS_METHOD = 'showBanners'
