from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.garage import fresh_vehicle, run_in_order, run_processor

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


def _style_remover(vehicle):
    # The customization window's own way to take a style off (styled_mode._sellItem, RU 1.45 :317-323): an empty outfit
    # for every season through OutfitApplier puts the style back in the depot. The CustomizationsSeller that follows it
    # there sells the style for credits, so it is left out on purpose.
    from gui.shared.gui_items.processors.common import OutfitApplier
    from items.components.c11n_constants import SeasonType
    from items.customizations import CustomizationOutfit
    from vehicle_outfit.outfit import Outfit
    outfit = Outfit(component=CustomizationOutfit(), vehicleCD=vehicle.descriptor.makeCompactDescr())
    return OutfitApplier(vehicle, ((outfit, SeasonType.ALL),))


def _demount_step(vehicle, slot, device_in):
    def make():
        current = fresh_vehicle(vehicle)
        device = device_in(current, slot)
        return _installer(current, device, slot) if device is not None else None
    return make


def demount(vehicle, slots, device_in, done):
    # One slot at a time, each built from the vehicle as the items cache holds it after the previous
    # answer: the hangar's own demount never sends overlapping inventory requests.
    run_in_order([_demount_step(vehicle, slot, device_in) for slot in slots], done, 'demount')


def unload_crew(vehicle, done):
    run_processor(lambda: _unload(vehicle), done, 'crew unload')


def remove_style(vehicle, done):
    run_processor(lambda: _style_remover(vehicle), done, 'style removal')


def return_crew(vehicle, done):
    run_processor(lambda: _return(vehicle), done, 'crew return')
