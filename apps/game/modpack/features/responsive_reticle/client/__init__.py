from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import controls_own_vehicle, player
from ....core.client.component import FeatureComponent
from ....core.client.game import client_attr
from ....core.client.timer import Ticker, game_time
from ....core.hooks import override
from ....core.log import log
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import (
    TickCache,
    TickGate,
    argument_names,
    frame_time_diff,
    realm_of,
    relax_time,
    server_tick,
    skip_reason,
    supports_rotate,
)
from ..model.constants import FRAME_S
from ..settings import SCHEMA, SWITCH
from .constants import (
    AVATAR_CLASS,
    AVATAR_MODULE,
    CLIENT_MODE_ATTR,
    DISPERSION_METHOD,
    LAST_SHOT_POINT_ATTR,
    MARKER_METHOD,
    PLUGINS_MODULE,
    ROTATE_METHOD,
    ROTATOR_CLASS,
    ROTATOR_MODULE,
    SHOT_POINT_ATTR,
    SHOT_RESULT_METHOD,
    SHOT_RESULT_PLUGIN,
    STARTED_ATTR,
    TARGET_LAST_ATTR,
    TARGET_LOCK,
    TIME_ATTR,
)


def _is_replay():
    is_playing = client_attr('BattleReplay', 'isPlaying')
    return bool(is_playing()) if is_playing is not None else False


def _descriptor(battle_player):
    return getattr(battle_player, 'vehicleTypeDescriptor', None)


def _class_tags(battle_player):
    return getattr(getattr(_descriptor(battle_player), 'type', None), 'tags', ())


# RU 1.45 client source: VehicleDescriptor.gun.staticTurretYaw, set on guns that never turn sideways.
def _static_yaw(battle_player):
    return getattr(getattr(_descriptor(battle_player), 'gun', None), 'staticTurretYaw', None)


def _target_locked():
    modes = client_attr('constants', 'AIMING_MODE')
    handler = getattr(player(), 'inputHandler', None)
    lock = getattr(modes, TARGET_LOCK, None)
    if handler is None or lock is None:
        return False
    return bool(handler.getAimingMode(lock))


# The stock rotator turns the own gun and moves its marker once per server tick. This component runs the same
# client-side prediction every frame between them and stamps the rotator's clock, so the stock tick still sends the
# aim to the server at 10 Hz and skips the turning it no longer needs. The dispersion and the shot-result colour are
# cached per server tick while a frame runs. A frame it skips (the auto-aim lock, a stopped rotator) leaves the stock
# tick to do everything as before.
class ResponsiveReticle(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.realm = realm_of(client_attr('constants', 'CURRENT_REALM'))
        self.rotator = None
        self.active = False
        self.in_frame = False
        self.dispersion = TickCache()
        self.shot_results = TickGate()
        self.ticker = Ticker(FRAME_S, self._on_frame)
        self.supported = self._hook_client()
        bus = app.bus
        bus.on('battle_ready', self._on_battle_ready)
        bus.on('battle_leave', self.stop)

    def _hook_client(self):
        rotator_class = client_attr(ROTATOR_MODULE, ROTATOR_CLASS)
        rotate = getattr(rotator_class, ROTATE_METHOD, None)
        if rotate is None:
            log('responsive reticle: the client has no gun rotator to follow, off')
            return False
        names = argument_names(rotate)
        if not supports_rotate(names, self.realm):
            log('responsive reticle: unknown %s rotate signature %r, off' % (self.realm, names))
            return False
        avatar_class = client_attr(AVATAR_MODULE, AVATAR_CLASS)
        if getattr(avatar_class, DISPERSION_METHOD, None) is not None:
            override(avatar_class, DISPERSION_METHOD)(self._dispersion)
        plugin_class = client_attr(PLUGINS_MODULE, SHOT_RESULT_PLUGIN)
        if getattr(plugin_class, SHOT_RESULT_METHOD, None) is not None:
            override(plugin_class, SHOT_RESULT_METHOD)(self._shot_result)
        return True

    def _on_battle_ready(self, battle_player):
        self.stop()
        if not self.enabled() or not self.supported:
            return
        reason = skip_reason(_is_replay(), _class_tags(battle_player), _static_yaw(battle_player))
        if reason is not None:
            log('responsive reticle: off in this battle (%s)' % reason)
            return
        self.rotator = getattr(battle_player, 'gunRotator', None)
        if self.rotator is None:
            return
        self.active = True
        self.ticker.start()

    def stop(self):
        self.active = False
        self.ticker.stop()
        self.rotator = None
        self.dispersion.clear()
        self.shot_results.clear()

    def settings_changed(self, changed):
        if not self.enabled():
            self.stop()

    def _drives(self, rotator):
        if not getattr(rotator, STARTED_ATTR, False) or not getattr(rotator, CLIENT_MODE_ATTR, False):
            return False
        return controls_own_vehicle() and not _target_locked()

    def _on_frame(self):
        if not self.active or not self.enabled():
            self.stop()
            return False
        rotator = self.rotator
        if not self._drives(rotator):
            return True
        now = game_time()
        time_diff = frame_time_diff(now, getattr(rotator, TIME_ATTR, None))
        if time_diff is not None:
            self._turn(rotator, now, time_diff)
        return True

    def _turn(self, rotator, now, time_diff):
        shot_point = self._shot_point(rotator)
        self.in_frame = True
        try:
            setattr(rotator, TIME_ATTR, now)
            getattr(rotator, ROTATE_METHOD)(shot_point, time_diff)
            getattr(rotator, MARKER_METHOD)(relax_time(self.settings.get('follow'), time_diff))
        finally:
            self.in_frame = False

    @staticmethod
    def _shot_point(rotator):
        source = getattr(rotator, SHOT_POINT_ATTR, None)
        shot_point = source() if source is not None else None
        if shot_point is None and getattr(rotator, TARGET_LAST_ATTR, False):
            shot_point = getattr(rotator, LAST_SHOT_POINT_ATTR, None)
        return shot_point

    def _dispersion(self, original, avatar, *args, **kwargs):
        if not self.in_frame:
            return original(avatar, *args, **kwargs)
        return self.dispersion.get(server_tick(game_time()), lambda: original(avatar, *args, **kwargs))

    def _shot_result(self, original, plugin, marker_type, *args, **kwargs):
        if self.in_frame and not self.shot_results.allow(marker_type, server_tick(game_time())):
            return None
        return original(plugin, marker_type, *args, **kwargs)
