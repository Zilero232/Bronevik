from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: gui/Scaleform/daapi/view/lobby/hangar/carousels/basic/tank_carousel.py. TankCarousel (and
# every mode carousel built on it) sends CarouselTypeSetting.getRowCount() through TankCarouselMeta.as_rowCountS in
# _populate and _onCarouselSettingsChange; the Flash TankCarousel.as_rowCount lays out any row count
# (HorizontalScrollerViewPort), only its event-entry viewport assumes pairs of rows.
CAROUSEL_MODULE = 'gui.Scaleform.daapi.view.lobby.hangar.carousels.basic.tank_carousel'
CAROUSEL_CLASS = 'TankCarousel'
ROW_COUNT_METHOD = 'as_rowCountS'
