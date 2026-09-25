import type { ModuleBase } from '@bronevik/gamedata';
import type { BuildOptions, ModuleOption, ProvisionKind } from '@bronevik/schemas';

import { LOADOUT } from '@bronevik/schemas';

import { findMockVehicle } from '@/shared/mocks';

import { crewSkillOption, MOCK_FIELD_STEPS, MOCK_PROVISIONS, MOCK_SKILLS, provisionOption } from './mock-catalog';
import { mockVehicleSpec } from './mock-vehicle';

const moduleOption = ({ moduleId, name, displayName, tier }: ModuleBase): ModuleOption => ({ moduleId, name, displayName, tier: tier ?? null });

const optionsOf = (kind: ProvisionKind) => MOCK_PROVISIONS.filter((seed) => seed.kind === kind).map(provisionOption);

export const mockBuildOptions = (tankId: number): BuildOptions | null => {
  const tank = findMockVehicle(tankId);

  if (!tank) {
    return null;
  }

  const vehicle = mockVehicleSpec(tank);
  const fieldOptions = optionsOf('fieldModification');

  return {
    tankId,
    modules: {
      chassis: vehicle.chassis.map(moduleOption),
      turrets: vehicle.turrets.map((turret) => ({ ...moduleOption(turret), guns: turret.guns.map(moduleOption) })),
      engines: vehicle.engines.map(moduleOption),
      radios: vehicle.radios.map(moduleOption)
    },
    crew: vehicle.crew,
    optionalDevices: optionsOf('optionalDevice'),
    consumables: optionsOf('consumable'),
    directives: optionsOf('directive'),
    fieldModifications: MOCK_FIELD_STEPS.map(({ level, tags }) => ({
      level,
      kind: tags.length > 1 ? 'pair' : 'modification',
      options: fieldOptions.filter((option) => tags.includes(option.tag))
    })),
    crewSkills: MOCK_SKILLS.map(crewSkillOption),
    slots: {
      optionalDevices: LOADOUT.equipmentSlots,
      consumables: LOADOUT.consumableSlots,
      directives: LOADOUT.directiveSlots
    }
  };
};
