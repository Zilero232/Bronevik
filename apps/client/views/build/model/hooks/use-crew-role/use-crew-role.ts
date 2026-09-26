'use client';

import type { UseCrewRoleInput } from './use-crew-role.types';

import { BUILD_VIEW } from '../../../config';
import { skillsOfRole } from '../../../lib/build-catalog';
import { roleSkills, toggleSkill } from '../../../lib/loadout-edit';
import { useBuildContext } from '../../context';

export const useCrewRole = ({ role }: UseCrewRoleInput) => {
  const { catalog, active, edit } = useBuildContext();

  const max = BUILD_VIEW.maxSkillsPerRole;
  const learned = roleSkills({ loadout: active, role });
  const isFull = learned.length >= max;
  const skills = skillsOfRole({ skills: catalog.skills, role }).map((skill) => ({ ...skill, isOn: learned.includes(skill.id) }));

  const onToggle = (skillId: string) => () => edit((loadout) => toggleSkill({ loadout, role, skillId, max }));

  return { skills, count: learned.length, max, isFull, onToggle };
};
