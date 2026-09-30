from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import safe

# RU 1.45 client source: gui/battle_control/avatar_getter.setForcedGuiControlMode(value, stopVehicle, enableAiming,
# cursorVisible), what the client's own battle windows call to show the cursor and hold the vehicle while they are open.
try:
    from gui.battle_control import avatar_getter
except ImportError:
    avatar_getter = None


class BattleCursor(object):

    def __init__(self):
        self.held = False

    @safe
    def hold(self):
        if self.held or avatar_getter is None:
            return self.held
        avatar_getter.setForcedGuiControlMode(True, stopVehicle=True, enableAiming=False)
        self.held = True
        return True

    @safe
    def release(self):
        if not self.held:
            return
        self.held = False
        avatar_getter.setForcedGuiControlMode(False)
