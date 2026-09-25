'use client';

import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { SPRING } from '@/shared/lib';

import type { CrewRoleProps } from './CrewRole.types';

import { BUILD_VIEW } from '../../../../../config';
import { skillsOfRole } from '../../../../../lib/build-catalog';
import { roleSkills, toggleSkill } from '../../../../../lib/loadout-edit';
import { useBuildContext } from '../../../../../model/context';

import s from './CrewRole.module.scss';

export const CrewRole = ({ role }: CrewRoleProps) => {
  const t = useTranslations('builds.panels.crew');
  const { catalog, active, edit } = useBuildContext();
  const headingId = useId();

  const max = BUILD_VIEW.maxSkillsPerRole;
  const skills = skillsOfRole({ skills: catalog.skills, role });
  const learned = roleSkills({ loadout: active, role });
  const isFull = learned.length >= max;
  const pips = Array.from({ length: max }, (_, index) => ({ id: `pip-${index}`, isOn: index < learned.length }));

  const onToggle = (skillId: string) => edit((loadout) => toggleSkill({ loadout, role, skillId, max }));

  return (
    <div aria-labelledby={headingId} className={s.root} data-full={isFull} role='group'>
      <div className={s.head}>
        <h3 className={s.title} id={headingId}>
          {t(`roles.${role}`)}
        </h3>
        <span className={s.counter} title={isFull ? t('full') : undefined}>
          <span className={s.srOnly}>{t('counter', { count: learned.length, max })}</span>
          {pips.map(({ id, isOn }) => (
            <motion.span aria-hidden key={id} animate={{ scale: isOn ? 1 : 0.6 }} className={s.pip} data-on={isOn} transition={SPRING} />
          ))}
        </span>
      </div>
      <div className={s.chips}>
        {skills.map(({ id: skillId, name }) => {
          const isOn = learned.includes(skillId);

          return (
            <motion.button
              key={skillId}
              aria-pressed={isOn}
              className={s.chip}
              data-on={isOn}
              disabled={!isOn && isFull}
              title={skillId}
              type='button'
              whileTap={{ scale: 0.94 }}
              onClick={() => onToggle(skillId)}
            >
              {isOn && <Check aria-hidden size={12} strokeWidth={3} />}
              {name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
