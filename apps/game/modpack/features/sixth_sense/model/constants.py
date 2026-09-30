from __future__ import absolute_import, division, print_function, unicode_literals

PREVIEW_ELAPSED_S = 3
PREVIEW_SIZE = (160, 110)

# The icons the package ships (assets/assets.json: otmetki_sixth_sense_icons): `<name>[_dim]_<size>.png`.
ICON_ROOT = 'gui/maps/icons/otmetki/sixth_sense/icons'
ICON_RENDITIONS = (64, 128)
DIM_SUFFIX = '_dim'
# The pulse swaps the icon and its dimmed frame every half second while the lamp is lit.
PULSE_PERIOD_S = 0.5
# How long the own vehicle stays visible after it leaves the enemy's line of sight: the ring drains over it when the
# player set no own time. The value is server-side; RU 1.45 client text menu.po extraParams/name/vehicleOwnSpottingTime
# names its default: 10 seconds.
LAMP_DURATION_S = 10.0
# The own vehicle's miscAttrs key the client itself fills (items/vehicles.py VehicleDescriptor._updateAttributes, RU
# 1.45): the improved radio communication device (optional_devices.xml improvedRadioCommunication) adds 1.5 s, 2.0 s
# in its specialisation slot (StaticOptionalDevice.updateVehicleDescrAttrs picks the slot's level); the time drops by it.
OWN_SPOTTING_ATTR = 'decreaseOwnSpottingTime'
# The tick of the optional countdown sound (assets/assets.json: otmetki_sixth_sense_sound).
TICK_SOUND = 'otmetki_tick'

# Client vehicle states (gui/battle_control/battle_constants.VEHICLE_VIEW_STATE, RU 1.45) by name. The stock
# SixthSenseIndicator resets its lamp on SWITCHING (a switch of the controlled vehicle, respawn included:
# vehicle_state_ctrl.movingToRespawn); RESPAWNING goes with it as in the stock markers and minimap, and
# DESTROYED / CREW_DEACTIVATED mark the controlled vehicle out of the fight (vehicle_state_ctrl._update).
OBSERVED = 'observed'
ENDED = 'ended'
VEHICLE_STATES = (
    ('OBSERVED_BY_ENEMY', OBSERVED),
    ('SWITCHING', ENDED),
    ('RESPAWNING', ENDED),
    ('DESTROYED', ENDED),
    ('CREW_DEACTIVATED', ENDED),
)
# Arena periods (constants.ARENA_PERIOD) that end the lamp: the round is over.
ENDING_PERIODS = ('AFTERBATTLE',)

KIND = 'sixth_sense'

# Client setting of the detection sound (settings_constants.SOUND.DETECTION_ALERT_SOUND, RU 1.45): its value is
# the index into DetectionAlertSound._WWISE_EVENTS = ('lightbulb', 'lightbulb_02', 'sixthSense'); 'sixthSense'
# is the user sound, played from audioww/sixthSense.mp3.
DETECTION_SOUND = 'bulbVoices'
LAMP_SOUND_INDEX = {'lightbulb': 0, 'lightbulb_02': 1, 'otmetki': 2}
