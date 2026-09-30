from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: OptionalDevicesController (gui/battle_control/controllers/consumables/opt_devices_ctrl.py)
# fires these when the descriptor's devices or a device's battle state change; PrebattleSetupsController hands every
# setup switch to AmmoController.updateForNewSetup, which fires onGunSettingsSet.
DEVICE_EVENTS = ('onDescriptorDevicesChanged', 'onOptionalDeviceAdded', 'onOptionalDeviceUpdated')
SETUP_EVENT = 'onGunSettingsSet'
# RU 1.45 client_common/ClientArena.py: the own vehicle's entry of the arena's vehicle list may come after the avatar is
# ready; onVehicleUpdated(vehicleID) fires when an entry changes, onPeriodChange when the battle moves on.
VEHICLE_UPDATED_EVENT = 'onVehicleUpdated'
PERIOD_EVENT = 'onPeriodChange'

NO_VEHICLE = 'the own vehicle is not in the arena list yet'
NOTHING_INSTALLED = 'the own vehicle has no equipment and no directives'

# Where a read took the devices from: the GUI vehicle of the own setups, or the arena's descriptor.
SOURCE_SETUPS = 'setups'
SOURCE_ARENA = 'arena'
