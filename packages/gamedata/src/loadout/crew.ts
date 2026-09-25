import type { CrewRoleName, CrewSkill, SkillParam } from '../model';
import type { BoostedLevelInput, ComputeCrewInput, CrewSummary, SkillFactorInput } from './loadout.types';

import { CREW, SKILL_BOOST_LEVEL, SKILL_EFFECT } from './loadout.constants';

export const roleFactor = (level: number): number => CREW.baseFactor + (CREW.levelFactor * level) / CREW.maxLevel;

const byRole = (value: (role: CrewRoleName) => number): Record<CrewRoleName, number> => ({
  commander: value('commander'),
  gunner: value('gunner'),
  driver: value('driver'),
  radioman: value('radioman'),
  loader: value('loader')
});

const boostedLevel = ({ learned, increase, multiplier }: BoostedLevelInput): number => {
  if (learned === undefined || learned < CREW.maxLevel) {
    return SKILL_BOOST_LEVEL + increase;
  }

  return multiplier === undefined ? learned + increase : (learned + increase) * multiplier;
};

export const computeCrew = ({ crew, directives, crewLevelIncrease }: ComputeCrewInput): CrewSummary => {
  const base = crew.level ?? CREW.maxLevel;
  const skills = crew.skills ?? [];
  const brotherhood = skills.find((item) => item.skill.name === SKILL_EFFECT.brotherhood.skill);
  const brotherhoodBonus = typeof brotherhood?.skill.extras.crewLevelIncrease === 'number' ? brotherhood.skill.extras.crewLevelIncrease : 0;
  const increase = crewLevelIncrease + (brotherhood ? (brotherhoodBonus * (brotherhood.level ?? CREW.maxLevel)) / CREW.maxLevel : 0);
  const commanderLevel = base + increase;
  const commanderBonus = commanderLevel / CREW.commanderAdditionRatio;
  const levels = byRole((role) => (role === 'commander' ? commanderLevel : base + increase + commanderBonus));
  const skillLevels: Record<string, number> = {};

  for (const { skill, level = CREW.maxLevel } of skills) {
    skillLevels[skill.name] = level + increase + (skill.role === 'commander' ? 0 : commanderBonus);
  }

  for (const directive of directives) {
    const boost = directive.skillBoost;

    if (!boost) {
      continue;
    }

    const learned = skills.find((item) => item.skill.name === boost.skill);

    skillLevels[boost.skill] = boostedLevel({
      learned: learned ? (learned.level ?? CREW.maxLevel) : undefined,
      increase: increase + (boost.skill.startsWith('commander') ? 0 : commanderBonus),
      multiplier: boost.perkLevelMultiplier
    });
  }

  return { crewLevelIncrease: increase, levels, factors: byRole((role) => roleFactor(levels[role])), skillLevels };
};

const findParam = ({ definitions, skill, params }: Omit<SkillFactorInput, 'crew'>): SkillParam | undefined =>
  definitions.find((item: CrewSkill) => item.name === skill)?.params.find((item) => params.includes(item.name));

export const skillFactor = ({ crew, definitions, skill, params }: SkillFactorInput): number => {
  const level = crew.skillLevels[skill];
  const param = findParam({ definitions, skill, params });

  return level === undefined || !param ? 1 : 1 + param.perLevel * level;
};

export const skillAdditive = ({ crew, definitions, skill, params }: SkillFactorInput): number => {
  const level = crew.skillLevels[skill];
  const param = findParam({ definitions, skill, params });

  return level === undefined || !param ? 0 : param.perLevel * Math.round(level);
};
