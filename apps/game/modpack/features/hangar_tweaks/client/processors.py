from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.garage import run_processor

# The requests the hangar's own buttons send, RU 1.45 client source: gui.shared.gui_items.processors
# module.getInstallerProcessor(vehicle, item, slotIdx, install=False), tankman.TankmanUnload(vehicleInvID),
# tankman.TankmanReturn(vehicle).


def _installer(vehicle, device, slot):
    from gui.shared.gui_items.processors.module import getInstallerProcessor
    return getInstallerProcessor(vehicle, device, slot, install=False)


def _unload(vehicle):
    from gui.shared.gui_items.processors.tankman import TankmanUnload
    return TankmanUnload(vehicle.invID)


def _return(vehicle):
    from gui.shared.gui_items.processors.tankman import TankmanReturn
    return TankmanReturn(vehicle)


def demount(vehicle, device, slot, done):
    run_processor(lambda: _installer(vehicle, device, slot), done, 'demount')


def unload_crew(vehicle, done):
    run_processor(lambda: _unload(vehicle), done, 'crew unload')


def return_crew(vehicle, done):
    run_processor(lambda: _return(vehicle), done, 'crew return')
