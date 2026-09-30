from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: OptionalDevicesController (gui/battle_control/controllers/consumables/opt_devices_ctrl.py)
# fires these when the descriptor's devices or a device's battle state change; PrebattleSetupsController hands every
# setup switch to AmmoController.updateForNewSetup, which fires onGunSettingsSet.
DEVICE_EVENTS = ('onDescriptorDevicesChanged', 'onOptionalDeviceAdded', 'onOptionalDeviceUpdated')
SETUP_EVENT = 'onGunSettingsSet'
