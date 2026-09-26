import { unique } from 'remeda';

import type { CreateImportPlanInput, DeviceRowInput, EquipmentRowInput, ProvisionRow } from '../importer.types';

import { resolveVehicleProgression } from '../../parsers/post-progression';
import { PROVISION_TYPE } from '../importer.constants';
import { compatibleTanks, prices } from './vehicle-modules';

const deviceRow = ({ device, vehicles }: DeviceRowInput): ProvisionRow => ({
  provisionId: device.provisionId,
  name: device.displayName,
  tag: device.name,
  type: PROVISION_TYPE.optionalDevice,
  description: device.descriptionKey,
  image: device.icon,
  ...prices(device.price),
  tankIds: compatibleTanks({ filter: device.vehicleFilter, vehicles }),
  data: { ...device }
});

const equipmentRow = ({ item, vehicles }: EquipmentRowInput): ProvisionRow => ({
  provisionId: item.provisionId,
  name: item.displayName,
  tag: item.name,
  type: item.kind === 'directive' ? PROVISION_TYPE.directive : PROVISION_TYPE.consumable,
  description: item.descriptionKey,
  image: item.icon,
  ...prices(item.price),
  tankIds: compatibleTanks({ filter: item.vehicleFilter, vehicles }),
  data: { ...item }
});

export const buildProvisionRows = ({ data }: CreateImportPlanInput): ProvisionRow[] => {
  const { vehicles, postProgression } = data;
  const tanksByModification = new Map<string, number[]>();

  for (const vehicle of vehicles) {
    for (const step of resolveVehicleProgression({
      progression: postProgression,
      treeName: vehicle.postProgressionTree,
      vehicleTier: vehicle.tier
    })) {
      for (const modification of [step.modification, ...(step.pair ?? [])]) {
        if (modification) {
          tanksByModification.set(modification.name, [...(tanksByModification.get(modification.name) ?? []), vehicle.tankId]);
        }
      }
    }
  }

  return [
    ...data.optionalDevices.map((device) => deviceRow({ device, vehicles })),
    ...data.equipment.filter((item) => item.kind === 'consumable' || item.kind === 'directive').map((item) => equipmentRow({ item, vehicles })),
    ...postProgression.modifications.map((modification) => ({
      provisionId: modification.provisionId,
      name: modification.locName ?? modification.name,
      tag: modification.name,
      type: PROVISION_TYPE.fieldModification,
      image: modification.imgName,
      tankIds: unique(tanksByModification.get(modification.name) ?? []),
      data: { ...modification }
    }))
  ];
};
