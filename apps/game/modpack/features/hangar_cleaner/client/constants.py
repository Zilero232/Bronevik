from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: gui/Scaleform/daapi/view/lobby/hangar/Hangar.py. The Hangar view subscribes
# `self.__onTeaserReceived` to the promo controller in `_populate` and calls
# `self.__updateCarouselEventEntryState()` (as_updateCarouselEventEntryStateS(isAnyEntryVisible())).
# Both are name-mangled privates: they are overridden only on a verified client version
# (model VERIFIED_CLIENTS), only when the class itself defines them, and before any Hangar is populated
# (the mod loads before the lobby, so the bound `__onTeaserReceived` is already ours). Anything missing:
# the element is left alone and the startup line says so.
HANGAR_MODULE = 'gui.Scaleform.daapi.view.lobby.hangar.Hangar'
HANGAR_CLASS = 'Hangar'
TEASER_METHOD = '_Hangar__onTeaserReceived'
EVENT_ENTRY_METHOD = '_Hangar__updateCarouselEventEntryState'
EVENT_ENTRY_FLASH = 'as_updateCarouselEventEntryStateS'
# Public seams for the offer banners: IOffersBannerController.showBanners() (the hangar's call) and the
# window every load path ends in, OfferBannerWindow.tryLoad(offerID, controller), which the controller's
# LUI observer and offer-update subscriptions reach through `_loadBanners` (gui/offers/
# offers_banner_controller.py, gui/impl/lobby/offers/offer_banner_window.py).
OFFERS_SKELETON_MODULE = 'skeletons.gui.offers'
OFFERS_SKELETON = 'IOffersBannerController'
OFFERS_METHOD = 'showBanners'
BANNER_WINDOW_MODULE = 'gui.impl.lobby.offers.offer_banner_window'
BANNER_WINDOW_CLASS = 'OfferBannerWindow'
BANNER_WINDOW_METHOD = 'tryLoad'
