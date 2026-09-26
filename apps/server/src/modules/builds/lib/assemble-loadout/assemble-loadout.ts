import type { CrewSkill as CrewSkillData, Equipment, FieldModification, InstalledDevice } from '@otmetki/gamedata';

import { isNonNullish, unique } from 'remeda';

import type { AssembledLoadout, AssembleLoadoutInput, PickProvisionsInput } from './assemble-loadout.types';

import { LOADOUT_DEFAULTS } from '../../config';
import { isCrewSkill, isEquipment, isFieldModification, isOptionalDevice } from '../game-data-guards';

export const assembleLoadout = ({ tankId, vehicle, request, provisions, skills }: AssembleLoadoutInput): AssembledLoadout => {
  const { loadout } = request;
  const ignored: string[] = [];
  const fits = (row: AssembleLoadoutInput['provisions'][number]) => row.tankIds.includes(tankId);
  const byId = new Map(provisions.map((row) => [row.provisionId, row]));

  const pick = <T>({ ids, type, guard }: PickProvisionsInput<T>): T[] =>
    ids.filter(isNonNullish).flatMap((id) => {
      const row = byId.get(id);

      if (!row || row.type !== type || !fits(row) || !guard(row.data)) {
        ignored.push(`${type}:${id}`);

        return [];
      }

      return [row.data];
    });

  const optionalDevices: InstalledDevice[] = loadout.equipment.flatMap((id, slot) => {
    const [device] = pick({ ids: id === null ? [] : [id], type: 'optionalDevice', guard: isOptionalDevice });

    return device ? [{ device, specialized: request.specialized[slot] ?? false }] : [];
  });

  const consumables: Equipment[] = pick({ ids: loadout.consumables, type: 'equipment', guard: isEquipment });
  const directives: Equipment[] = pick({ ids: loadout.directives, type: 'directive', guard: isEquipment });

  const modificationsByTag = new Map(
    provisions.filter((row) => row.type === 'fieldModification' && fits(row)).map((row) => [row.tag ?? row.name, row.data])
  );

  const fieldModifications: FieldModification[] = loadout.fieldModifications.flatMap((name) => {
    const data = modificationsByTag.get(name);

    if (!isFieldModification(data)) {
      ignored.push(`fieldModification:${name}`);

      return [];
    }

    return [data];
  });

  const definitions = new Map(skills.flatMap((row) => (isCrewSkill(row.data) ? [[row.skill, row.data] as const] : [])));
  const wanted = unique(Object.values(loadout.crewSkills).flat());

  const crewSkills = wanted.flatMap((name): { skill: CrewSkillData }[] => {
    const skill = definitions.get(name);

    if (!skill) {
      ignored.push(`crewSkill:${name}`);

      return [];
    }

    return [{ skill }];
  });

  const profileId = loadout.profileId ?? LOADOUT_DEFAULTS.preset;
  const preset = profileId === 'stock' ? 'stock' : 'top';

  return {
    profileId: request.modules ? 'custom' : preset,
    ignored,
    input: {
      vehicle,
      modules: request.modules ?? preset,
      optionalDevices,
      consumables,
      directives,
      fieldModifications,
      crew: { level: request.crewLevel, skills: crewSkills, catalog: [...definitions.values()] },
      state: request.state
    }
  };
};
