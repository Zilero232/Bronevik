from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import player
from ....core.log import log_exception

# RU 1.45 client source: PlayerAvatar.getVehicleDescriptor() (the own vehicle's descriptor, with the chosen specialisation
# slot), VehicleDescriptor.iterOptDevsWithSlots() (each installed device with its slot, in slot order; a device in a slot
# of one of its categories gets the slot's bonus, SupplySlotFilter's plain set intersection), and the stock battle
# tooltip of a device (gui/shared/tooltips/battle_opt_devices.py): the name from artefacts/<tierlessName>/name, the effect
# from artefacts/<groupName>/battle_descr or the device's shortDescriptionSpecial.


def _string(resource):
    from gui.impl import backport
    return backport.text(resource()) if resource.exists() else None


def _texts(device):
    from gui.impl.gen import R
    name = _string(R.strings.artefacts.dyn(device.tierlessName).dyn('name')) or device.userString
    effect = _string(R.strings.artefacts.dyn(device.groupName).dyn('battle_descr'))
    if effect is None:
        effect = (getattr(device, 'shortDescriptionSpecial', None) or u'').format(colorTagOpen='', colorTagClose='')
    return name, effect


def _trophy(device):
    if getattr(device, 'isUpgraded', False):
        return 'upgraded'
    return 'basic' if getattr(device, 'isUpgradable', False) else None


def _device(device, slot):
    name, effect = _texts(device)
    categories = set(getattr(slot, 'categories', None) or ()) & set(getattr(device, 'categories', None) or ())
    return {'name': name, 'effect': effect, 'icon': getattr(device, 'icon', None), 'bonus': bool(categories),
            'deluxe': bool(getattr(device, 'isDeluxe', False)), 'modernized': bool(getattr(device, 'isModernized', False)),
            'level': getattr(device, 'level', None), 'trophy': _trophy(device)}


def own_devices():
    try:
        descriptor = player().getVehicleDescriptor()
        return [_device(device, slot) for device, slot in descriptor.iterOptDevsWithSlots() if device is not None]
    except Exception:
        log_exception('battle loadout: own devices')
        return []
