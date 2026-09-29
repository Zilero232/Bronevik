from __future__ import absolute_import, division, print_function, unicode_literals

PREVIEW_ELAPSED_S = 3
PREVIEW_SIZE = (160, 110)

# The icons the package ships (assets/assets.json: otmetki_sixth_sense_icons): `<name>[_dim]_<size>.png`.
ICON_ROOT = 'gui/maps/icons/otmetki/sixth_sense/icons'
ICON_RENDITIONS = (64, 128)
DIM_SUFFIX = '_dim'
# The pulse swaps the icon and its dimmed frame every half second while the lamp is lit.
PULSE_PERIOD_S = 0.5
# How long the stock lamp stays lit (SixthSense.as): our ring drains over it when the player set no own time.
LAMP_DURATION_S = 10

KIND = 'sixth_sense'

# Client setting of the detection sound (settings_constants.SOUND.DETECTION_ALERT_SOUND, RU 1.45): its value is
# the index into DetectionAlertSound._WWISE_EVENTS = ('lightbulb', 'lightbulb_02', 'sixthSense'); 'sixthSense'
# is the user sound, played from audioww/sixthSense.mp3.
DETECTION_SOUND = 'bulbVoices'
LAMP_SOUND_INDEX = {'lightbulb': 0, 'lightbulb_02': 1, 'otmetki': 2}
