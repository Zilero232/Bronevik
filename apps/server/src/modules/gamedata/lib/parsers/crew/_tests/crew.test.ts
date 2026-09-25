import { CREW_ROLES } from '@bronevik/gamedata';
import { describe, expect, it } from 'vitest';

import { COMMON_FIXTURES, readFixture } from '../../../_tests/fixtures';
import { parseCrew, parsePerks } from '../crew';

const tankmenXml = readFixture(COMMON_FIXTURES.tankmen);
const perksXml = readFixture(COMMON_FIXTURES.perks);
const crew = parseCrew({ tankmenXml, perksXml });
const skill = (name: string) => crew.skills.find((item) => item.name === name);

describe('parseCrew', () => {
  it('reads the five roles and lists the skills available to each', () => {
    expect(crew.roles.map((role) => role.role).sort()).toEqual([...CREW_ROLES].sort());

    const gunner = crew.roles.find((role) => role.role === 'gunner');

    expect(gunner?.skills).toContain('gunner_smoothTurret');
    expect(gunner?.skills).toContain('brotherhood');
    expect(gunner?.skills).not.toContain('driver_virtuoso');
  });

  it('assigns role-prefixed skills to their role and the rest to everyone', () => {
    expect(skill('driver_virtuoso')).toMatchObject({ role: 'driver', roles: ['driver'], isCommon: false });
    expect(skill('brotherhood')).toMatchObject({ role: 'common', isCommon: true });
    expect(skill('brotherhood')?.roles).toHaveLength(CREW_ROLES.length);
    expect(skill('gunner_smoothTurret')?.singleOnVehicle).toBe(true);
  });

  it('takes per-level values from the perk the skill points at', () => {
    const perks = parsePerks(perksXml);
    const eagleEye = skill('commander_eagleEye');
    const perk = eagleEye?.vsePerk === undefined ? undefined : perks.get(eagleEye.vsePerk);

    expect(perk).toBeDefined();
    expect(eagleEye?.params.find((param) => param.name === 'circularVisionRadius')?.perLevel).toBe(perk?.circularVisionRadius);
    expect(skill('loader_desperado')?.params.some((param) => param.situational)).toBe(true);
    expect(skill('brotherhood')?.extras.crewLevelIncrease).toBeGreaterThan(0);
  });
});
