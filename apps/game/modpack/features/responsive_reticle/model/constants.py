from __future__ import absolute_import, division, print_function, unicode_literals

REALM_LESTA = 'lesta'
REALM_WG = 'wg'
# constants.CURRENT_REALM of the Lesta client (RU 1.45 client source); every other realm is a WG client.
LESTA_REALMS = ('RU',)
# The arguments of VehicleGunRotator.__rotate after self, per realm. RU 1.45 client source: (shotPoint, timeDiff).
# UNVERIFIED on WG: the same two names are expected there; any other signature keeps the component off.
ROTATE_ARGUMENTS = {
    REALM_LESTA: ('shotPoint', 'timeDiff'),
    REALM_WG: ('shotPoint', 'timeDiff'),
}

# constants.SERVER_TICK_LENGTH (RU 1.45 client source): the stock rotator ticks and the server tracks the aim at 10 Hz.
SERVER_TICK_S = 0.1
# The marker's own tick: BigWorld.callback fires on the first frame after its delay, so 1 ms is every frame.
FRAME_S = 0.001
# The rotator's own bounds (VehicleGunRotator.__MAX_TIME_DIFF, RU 1.45); a frame shorter than FRAME_S is skipped.
MIN_FRAME_DIFF_S = 0.001
MAX_FRAME_DIFF_S = 0.2

# How the marker reaches its new place: within the frame, or over half a server tick.
FOLLOW_INSTANT = 'instant'
FOLLOW_SMOOTH = 'smooth'
FOLLOW_MODES = (FOLLOW_INSTANT, FOLLOW_SMOOTH)
SMOOTH_RELAX_S = 0.05

# The class tag of self-propelled guns (VehicleType.tags, RU 1.45): their marker is the strategic one.
SPG_TAG = 'SPG'
SKIP_REPLAY = 'replay'
SKIP_ARTILLERY = 'artillery'
SKIP_FIXED_YAW = 'fixed yaw'
