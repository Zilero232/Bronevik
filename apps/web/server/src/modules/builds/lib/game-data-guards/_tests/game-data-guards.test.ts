import { describe, expect, it } from 'vitest';

import { loadIs } from '../../../../gamedata/lib/_tests/fixtures';
import { isCrewSkill, isEquipment, isFieldModification, isOptionalDevice, isVehicleSpec } from '../game-data-guards';

const modification = { name: 'improved_rammer', modifiers: [] };

describe('isVehicleSpec', () => {
  it('accepts a parsed vehicle', () => {
    expect(isVehicleSpec(loadIs())).toBe(true);
  });

  it('rejects a vehicle missing a module list', () => {
    const { turrets: _turrets, ...partial } = loadIs();

    expect(isVehicleSpec(partial)).toBe(false);
    expect(isVehicleSpec(null)).toBe(false);
  });
});

describe('isOptionalDevice', () => {
  it('requires tags on top of a name and modifiers', () => {
    expect(isOptionalDevice({ ...modification, tags: [] })).toBe(true);
    expect(isOptionalDevice(modification)).toBe(false);
  });
});

describe('isEquipment', () => {
  it('requires a kind on top of a name and modifiers', () => {
    expect(isEquipment({ ...modification, kind: 'consumable' })).toBe(true);
    expect(isEquipment(modification)).toBe(false);
  });
});

describe('isFieldModification', () => {
  it('requires a name and a list of modifiers', () => {
    expect(isFieldModification(modification)).toBe(true);
    expect(isFieldModification({ name: modification.name, modifiers: {} })).toBe(false);
    expect(isFieldModification([])).toBe(false);
  });
});

describe('isCrewSkill', () => {
  it('requires params, roles and extras', () => {
    const skill = { name: 'repair', params: [], roles: [], extras: {} };

    expect(isCrewSkill(skill)).toBe(true);
    expect(isCrewSkill({ ...skill, extras: null })).toBe(false);
  });
});
