POLL_EVERY_S = 120.0
# raw key (settings_share.FIELDS) -> settings-core setting name.
# Names come from WoT-era account_helpers.settings_core.settings_constants
# and are UNVERIFIED on Lesta 1.45; a name the core does not know reads as None
# and is dropped by the whitelist, so a wrong entry is harmless.
CORE_NAMES = {
    'fov': 'fov',
    'vsync': 'vertSync',
    'tripleBuffering': 'tripleBuffered',
    'postMortem': 'enablePostMortemEffect',
    'sniperDynamicCamera': 'dynamicCamera',
    'horizontalStabilisation': 'horStabilizationSnp',
    'arcadeSens': 'mouseArcadeSens',
    'sniperSens': 'mouseSniperSens',
    'artillerySens': 'mouseStrategicSens',
    'invert': 'mouseVertInvert',
    'minimapViewRange': 'minimapViewRange',
    'minimapDrawRange': 'minimapDrawRange',
    'volumeMaster': 'masterVolume',
    'volumeMusic': 'musicVolume',
}
