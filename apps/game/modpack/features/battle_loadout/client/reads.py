from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ....core.client.battle import controls_own_vehicle, optional_devices, player, session_provider
from ....core.log import log_exception
from .constants import SET_GROUP_IDS

# RU 1.45 client source: PlayerAvatar.getVehicleDescriptor() (the own vehicle's descriptor, with the chosen
# specialisation slot), VehicleDescriptor.iterOptDevsWithSlots() (each installed device with its slot, in slot order; a
# device in a slot of one of its categories gets the slot's bonus, SupplySlotFilter's plain set intersection), and the
# stock battle tooltip of a device (gui/shared/tooltips/battle_opt_devices.py): the name from
# artefacts/<tierlessName>/name, the effect from artefacts/<groupName>/battle_descr or the device's
# shortDescriptionSpecial.


def _string(resource):
    from gui.impl import backport
    return backport.text(resource()) if resource.exists() else None


def _texts(device):
    from gui.impl.gen import R

    name = _string(R.strings.artefacts.dyn(device.tierlessName).dyn('name')) or device.userString
    effect = _string(R.strings.artefacts.dyn(device.groupName).dyn('battle_descr'))
    if effect is None:
        special = getattr(device, 'shortDescriptionSpecial', None) or u''
        effect = special.format(colorTagOpen='', colorTagClose='')
    return name, effect


def _trophy(device):
    if getattr(device, 'isUpgraded', False):
        return 'upgraded'
    return 'basic' if getattr(device, 'isUpgradable', False) else None


# The stock consumables panel draws a device the server reports a state for (the camouflage net and the binoculars on,
# the improved configuration spent) from OptionalDevicesController.getOptDeviceInBattle: running while getStatus() is
# set, dimmed when isUsed() (gui/Scaleform/daapi/view/battle/shared/consumables_panel.py _updateOptionalDeviceSlot).
# The controller follows the attached vehicle, so the states are read only while that is the own one.
def _state(device):
    if not controls_own_vehicle():
        return False, False

    controller = optional_devices()
    if controller is None:
        return False, False

    item = controller.getOptDeviceInBattle(device.id[1])
    if item is None:
        return False, False
    return bool(item.getStatus()), bool(item.isUsed())


def _device(device, slot, boosted):
    name, effect = _texts(device)
    is_active, is_used = _state(device)
    slot_categories = set(getattr(slot, 'categories', None) or ())
    device_categories = set(getattr(device, 'categories', None) or ())
    return {
        'name': name,
        'effect': effect,
        'icon': getattr(device, 'icon', None),
        'bonus': bool(slot_categories & device_categories),
        'deluxe': bool(getattr(device, 'isDeluxe', False)),
        'modernized': bool(getattr(device, 'isModernized', False)),
        'level': getattr(device, 'level', None),
        'trophy': _trophy(device),
        'boosted': device.compactDescr in boosted,
        'active': is_active,
        'used': is_used,
    }


# The own vehicle as the battle builds it for its own ammunition panels (gui/battle_control/gui_vehicle_builder.py
# VehicleBuilder, as comp7_prebattle_setup_ctrl and the respawn panel use it) from the own Vehicle entity's MY_VEHICLE
# properties (entity_defs/Vehicle.def: setups, setupsIndexes, vehPostProgression, disabledSwitches,
# crewCompactDescrs; Vehicle.set_setups and the rest hand the same values to PrebattleSetupsController).
def _gui_vehicle():
    from gui.battle_control.gui_vehicle_builder import VehicleBuilder

    entity = BigWorld.entity(player().playerVehicleID)
    if entity is None or getattr(entity, 'setups', None) is None:
        return None

    builder = VehicleBuilder()
    builder.setStrCD(entity.typeDescriptor.makeCompactDescr())
    builder.setCrew(list(entity.crewCompactDescrs))
    builder.setAmmunitionSetups(entity.setups, dict(entity.setupsIndexes or {}))
    builder.setPostProgressionState(list(entity.vehPostProgression), list(entity.disabledSwitches))
    return builder.getResult()


def _booster_effect(booster, vehicle, is_replace):
    if booster.isCrewBooster():
        return booster.getCrewBoosterDescription(is_replace)
    if booster.isEquipmentBooster():
        return booster.getOptDeviceBoosterDescription(vehicle)
    return booster.shortDescription


def _booster_attention(booster, vehicle):
    from gui.impl.lobby.tank_setup.tank_setup_helper import isEconomicDirBattleEnabled

    if booster.isEconomicBooster():
        return not isEconomicDirBattleEnabled(session_provider())
    return not booster.isAffectsOnVehicle(vehicle)


# A directive the way the garage ammunition panel shows it (gui/impl/common/ammunition_panel/ammunition_panel_blocks.py
# BattleBoostersBlock._updateOverlayAspects): its frame, the replace frame for a crew directive standing in for a skill
# the crew has not learnt, and the attention mark when it does not affect the vehicle (BattleBooster.isAffectsOnVehicle)
# or is an economic directive in a battle without them (tank_setup_helper.isEconomicDirBattleEnabled). Its effect is the
# text the garage tooltip builds (gui/shared/gui_items/artefacts.py BattleBooster descriptions).
def _booster(booster, vehicle):
    is_unlearnt_skill = booster.isCrewBooster() and not booster.isAffectedSkillLearnt(vehicle)
    is_replace = is_unlearnt_skill and not booster.isBuiltinPerkBooster()
    return {
        'name': booster.userName,
        'effect': _booster_effect(booster, vehicle, is_replace),
        'icon': booster.descriptor.iconName,
        'booster': 'replace' if is_replace else 'boost',
        'attention': _booster_attention(booster, vehicle),
    }


def _is_boosted(device, boosters):
    return any(booster.isOptionalDeviceCompatible(device) for booster in boosters)


def _boosted(boosters, vehicle):
    devices = vehicle.optDevices.installed.getItems()
    return set(device.intCD for device in devices if _is_boosted(device, boosters))


# The field modification setup switch (RU 1.45 Vehicle.isSetupSwitchActive, the check PrebattleSetupsController runs)
# and the active set of its group (vehicle_equipment.py setupLayouts getLayoutIndex, getGroupCapacity).
def _sets(vehicle):
    from post_progression_common import TankSetupGroupsId

    layouts = vehicle.setupLayouts
    sets = {}
    for name, group_attribute in SET_GROUP_IDS.items():
        group = getattr(TankSetupGroupsId, group_attribute)
        if vehicle.isSetupSwitchActive(group):
            sets[name] = {'index': layouts.getLayoutIndex(group), 'total': layouts.getGroupCapacity(group)}
    return sets


def _setups():
    vehicle = _gui_vehicle()
    if vehicle is None:
        return set(), [], {}

    boosters = vehicle.battleBoosters.installed.getItems()
    boosted = _boosted(boosters, vehicle)
    directives = [_booster(booster, vehicle) for booster in boosters]
    return boosted, directives, _sets(vehicle)


def _devices(boosted):
    descriptor = player().getVehicleDescriptor()
    devices = []
    for device, slot in descriptor.iterOptDevsWithSlots():
        if device is not None:
            devices.append(_device(device, slot, boosted))
    return devices


def own_loadout():
    try:
        boosted, directives, sets = _setups()
    except Exception:
        log_exception('battle loadout: own setups')
        boosted, directives, sets = set(), [], {}

    try:
        devices = _devices(boosted)
    except Exception:
        log_exception('battle loadout: own devices')
        devices = []
    return devices + directives, sets
