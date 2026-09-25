import type { OptionalDevice } from '@bronevik/gamedata';

import { calculateLoadout, CREW, resolveModules, roleFactor, VISION } from '@bronevik/gamedata';
import { describe, expect, it } from 'vitest';

import { loadCatalog, loadIs } from './fixtures';

const vehicle = loadIs();
const catalog = loadCatalog();
const device = (name: string): OptionalDevice => {
  const found = catalog.optionalDevices.find((item) => item.name === name);

  if (!found) {
    throw new Error(`No device ${name}`);
  }

  return found;
};

const equipment = (name: string) => catalog.equipment.filter((item) => item.name === name);
const skill = (name: string) => catalog.crew.skills.filter((item) => item.name === name).map((item) => ({ skill: item }));
const modifierValue = (item: OptionalDevice, attribute: string) => item.modifiers.find((modifier) => modifier.attribute === attribute);

const rammer = device('trophyUpgradedTankRammer');
const ventilation = device('improvedVentilation_tier2');
const aimDrives = device('enhancedAimDrives_tier2');
const stereoscope = device('stereoscope_tier1');
const base = calculateLoadout({ vehicle });
const topGun = resolveModules({ vehicle }).gun;

describe('module presets', () => {
  it('uses the first modules for stock and the highest tier for top', () => {
    const stock = calculateLoadout({ vehicle, modules: 'stock' });

    expect(stock.modules).toMatchObject({ chassis: 'IS-1', turret: 'IS-85', engine: 'V-2IS', radio: '_10RK' });
    expect(base.modules).toMatchObject({ chassis: 'IS-2M', turret: 'IS-122', engine: 'V-2-54IS', radio: '_12RT' });
  });

  it('accepts an explicit module selection', () => {
    const custom = calculateLoadout({ vehicle, modules: { turret: 'IS-85', gun: '_85mm_D-5T' } });

    expect(custom.modules.gun).toBe('_85mm_D-5T');
    expect(() => calculateLoadout({ vehicle, modules: { gun: 'nope' } })).toThrow();
  });

  it('adds the turret hit points to the hull', () => {
    const turret = vehicle.turrets.find((item) => item.name === base.modules.turret);

    expect(base.maxHealth).toBe(vehicle.hull.maxHealth + (turret?.maxHealth ?? 0));
  });
});

describe('crew', () => {
  it('gives every non-commander a tenth of the commander level', () => {
    expect(base.crew.levels.commander).toBe(CREW.maxLevel);
    expect(base.crew.levels.loader).toBe(CREW.maxLevel + CREW.maxLevel / CREW.commanderAdditionRatio);
  });

  it('scales reload and aiming time by the 0.57 + 0.43 × level role factor', () => {
    expect(base.reloadTime).toBeCloseTo(topGun.reloadTime / roleFactor(base.crew.levels.loader), 3);
    expect(base.aimingTime).toBeCloseTo(topGun.aimingTime / roleFactor(base.crew.levels.gunner), 3);
  });

  it('adds ventilation, food and brotherhood to the crew level', () => {
    const vents = modifierValue(ventilation, 'miscAttrs/crewLevelIncrease')?.value ?? 0;
    const food = equipment('ration')[0].modifiers[0].value;
    const brotherhood = Number(catalog.crew.skills.find((item) => item.name === 'brotherhood')?.extras.crewLevelIncrease);

    const boosted = calculateLoadout({
      vehicle,
      optionalDevices: [{ device: ventilation }],
      consumables: equipment('ration'),
      crew: { skills: skill('brotherhood') }
    });

    expect(boosted.crew.crewLevelIncrease).toBeCloseTo(vents + food + brotherhood);
    expect(boosted.crew.levels.commander).toBeCloseTo(CREW.maxLevel + vents + food + brotherhood);
    expect(boosted.reloadTime).toBeLessThan(base.reloadTime);
  });
});

describe('optional devices and directives', () => {
  it('applies a rammer multiplicatively to the reload time', () => {
    const withRammer = calculateLoadout({ vehicle, optionalDevices: [{ device: rammer }] });

    expect(withRammer.reloadTime / base.reloadTime).toBeCloseTo(modifierValue(rammer, 'miscAttrs/gunReloadTimeFactor')?.value ?? 0, 3);
  });

  it('uses the specialization value in a matching slot', () => {
    const factor = modifierValue(aimDrives, 'miscAttrs/gunAimingTimeFactor');
    const normal = calculateLoadout({ vehicle, optionalDevices: [{ device: aimDrives }] });
    const specialized = calculateLoadout({ vehicle, optionalDevices: [{ device: aimDrives, specialized: true }] });

    expect(normal.aimingTime / base.aimingTime).toBeCloseTo(factor?.value ?? 0, 3);
    expect(specialized.aimingTime / base.aimingTime).toBeCloseTo(factor?.specValue ?? 0, 3);
  });

  it('applies an equipment directive only when its device is installed', () => {
    const directives = equipment('rammerBattleBooster');
    const directiveOnly = calculateLoadout({ vehicle, directives });
    const withRammer = calculateLoadout({ vehicle, optionalDevices: [{ device: rammer }] });
    const both = calculateLoadout({ vehicle, optionalDevices: [{ device: rammer }], directives });
    const applicable = directives[0].modifiers.find(
      (modifier) =>
        !modifier.requiresDevice?.incompatible.some((tag) => rammer.tags.includes(tag)) &&
        modifier.requiresDevice?.required.every((tag) => rammer.tags.includes(tag))
    );

    expect(directiveOnly.reloadTime).toBe(base.reloadTime);
    expect(both.reloadTime / withRammer.reloadTime).toBeCloseTo(applicable?.value ?? 0, 3);
  });

  it('applies the stereoscope only while standing still and caps the view range', () => {
    const moving = calculateLoadout({ vehicle, optionalDevices: [{ device: stereoscope }] });
    const still = calculateLoadout({ vehicle, optionalDevices: [{ device: stereoscope }], state: { still: true } });
    const factor = stereoscope.modifiers[0].value;

    expect(moving.viewRange).toBe(base.viewRange);
    expect(still.viewRangeUncapped / base.viewRangeUncapped).toBeCloseTo(factor, 3);
    expect(still.viewRange).toBeLessThanOrEqual(VISION.maxRadius);
  });

  it('boosts the engine with fuel and ignores activatable consumables until active', () => {
    const fuel = equipment('gasoline100');
    const limiter = equipment('removedRpmLimiter');

    expect(calculateLoadout({ vehicle, consumables: fuel }).enginePower / base.enginePower).toBeCloseTo(fuel[0].modifiers[0].value, 3);
    expect(calculateLoadout({ vehicle, consumables: limiter }).enginePower).toBe(base.enginePower);
    expect(calculateLoadout({ vehicle, consumables: limiter, state: { consumablesActive: true } }).enginePower).toBeGreaterThan(base.enginePower);
  });
});

describe('crew skills and field modifications', () => {
  it('scales turret-rotation dispersion by the smooth ride per-level value', () => {
    const smoothTurret = skill('gunner_smoothTurret');
    const perLevel = smoothTurret[0].skill.params[0].perLevel;
    const result = calculateLoadout({ vehicle, crew: { skills: smoothTurret } });
    const level = result.crew.skillLevels.gunner_smoothTurret;

    expect(result.dispersionTurretRotation / base.dispersionTurretRotation).toBeCloseTo(1 + perLevel * level, 3);
  });

  it('lets a skill directive grant a skill the crew has not learned', () => {
    const virtuoso = catalog.crew.skills.filter((item) => item.name === 'driver_virtuoso');
    const result = calculateLoadout({ vehicle, directives: equipment('virtuosoBattleBooster'), crew: { catalog: virtuoso } });

    expect(result.crew.skillLevels.driver_virtuoso).toBeGreaterThanOrEqual(CREW.maxLevel);
    expect(result.hullTraverse).toBeGreaterThan(base.hullTraverse);
  });

  it('applies field modification modifiers to the static attributes', () => {
    const modification = catalog.postProgression.modifications.find((item) =>
      item.modifiers.some((modifier) => modifier.attribute === 'miscAttrs/healthFactor')
    );

    const factor = modification?.modifiers.find((modifier) => modifier.attribute === 'miscAttrs/healthFactor')?.value ?? 1;
    const result = calculateLoadout({ vehicle, fieldModifications: modification ? [modification] : [] });

    expect(result.maxHealth).toBe(Math.round(base.maxHealth * factor));
  });
});
