from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: OptionalDevicesController (gui/battle_control/controllers/consumables/opt_devices_ctrl.py)
# fires these when the descriptor's devices or a device's battle state change; PrebattleSetupsController hands every
# setup switch to AmmoController.updateForNewSetup, which fires onGunSettingsSet.
DEVICE_EVENTS = ('onDescriptorDevicesChanged', 'onOptionalDeviceAdded', 'onOptionalDeviceUpdated')
SETUP_EVENT = 'onGunSettingsSet'
# The badge groups (model SET_GROUPS) by their TankSetupGroupsId names (RU 1.45 common/post_progression_common.py).
SET_GROUP_IDS = {'devices': 'OPTIONAL_DEVICES_AND_BOOSTERS', 'consumables': 'EQUIPMENT_AND_SHELLS'}
