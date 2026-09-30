from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: settings_constants.GAME.CAROUSEL_TYPE / DOUBLE_CAROUSEL_TYPE, stored as the index into
# options.CarouselTypeSetting.CAROUSEL_TYPES ('single', 'double') and DoubleCarouselTypeSetting ('adaptive', 'small').
CAROUSEL_TYPE = 'carouselType'
DOUBLE_CAROUSEL_TYPE = 'doubleCarouselType'
CAROUSEL_ROW_MODES = {'single': 0, 'double': 1}
CAROUSEL_TILE_MODES = {'adaptive': 0, 'small': 1}

ACTION_DEMOUNT = 'demount_removable'
ACTION_CREW = 'crew_to_barracks'
ACTION_RETURN = 'return_crew'
ACTION_STYLE = 'remove_style'
# The window's buttons in order, each with its i18n key (hangar_tweaks_<key>, hangar_tweaks_<key>_confirm).
ACTION_KEYS = (
    (ACTION_DEMOUNT, 'demount'),
    (ACTION_CREW, 'crew'),
    (ACTION_RETURN, 'return'),
    (ACTION_STYLE, 'style'),
)

# RU 1.45 client source: settings_constants.GRAPHICS.INTERFACE_SCALE, written as the index into
# settingsCore.interfaceScale.getScaleOptions() (graphics.getInterfaceScalesList of the screen: 0 = auto, then the
# scales the screen allows; options.InterfaceScaleSetting._set/_save); a scale the screen does not offer is left alone.
INTERFACE_SCALE = 'interfaceScale'
INTERFACE_SCALES = {'auto': 0.0, 'x1': 1.0, 'x1_25': 1.25, 'x1_5': 1.5, 'x1_75': 1.75, 'x2': 2.0}
SCALE_TOLERANCE = 1e-3

REFUSE_LOCKED = 'locked'
REFUSE_NOTHING = 'nothing'
REFUSE_BERTHS = 'berths'
