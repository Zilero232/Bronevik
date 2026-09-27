from __future__ import absolute_import, division, print_function, unicode_literals

# gui.shared.gui_items.Vehicle (RU 1.45): the flags as the ammunition panel shows them.
READERS = {
    'auto_repair': 'isAutoRepair',
    'auto_load': 'isAutoLoad',
    'auto_equip': 'isAutoEquip',
    'auto_boosters': 'isAutoBattleBoosterEquip',
}
# gui.shared.gui_items.processors.vehicle (RU 1.45): Processor(vehicle, value).
PROCESSORS = {
    'auto_repair': 'VehicleAutoRepairProcessor',
    'auto_load': 'VehicleAutoLoadProcessor',
    'auto_equip': 'VehicleAutoEquipProcessor',
    'auto_boosters': 'VehicleAutoBattleBoosterEquipProcessor',
}
