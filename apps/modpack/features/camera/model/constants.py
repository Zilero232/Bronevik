from __future__ import absolute_import, division, print_function, unicode_literals

# Client setting names; UNVERIFIED on Lesta 1.45 (an unknown name is never written). ZOOM_STEPS is the
# sniper zoom-step selection of the game's own settings window (its raw value is assumed to be the list
# of multipliers; check in the live client, see README "Camera").
ZOOM_STEPS = 'zoomSteps'
DYNAMIC_CAMERA = 'dynamicCamera'
HORIZONTAL_STABILIZATION = 'horStabilizationSnp'

ZOOM_STEP_PRESETS = {
    'x2_x8': [2, 4, 8],
    'x2_x16': [2, 4, 8, 16],
    'x2_x25': [2, 4, 8, 16, 25],
    'x4_x25': [4, 8, 16, 25],
}
