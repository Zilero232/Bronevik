'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { SPRING, STAGGER_ITEM } from '@/shared/lib';

import type { FieldModStepProps } from './FieldModStep.types';

import { chooseFieldMod, fieldModSide } from '../../../../../lib/loadout-edit';
import { useBuildContext } from '../../../../../model/context';

import s from './FieldModStep.module.scss';

export const FieldModStep = ({ step }: FieldModStepProps) => {
  const t = useTranslations('builds.panels.fieldMods');
  const { catalog, active, edit } = useBuildContext();
  const layoutId = useId();

  const chosen = fieldModSide({ loadout: active, step });

  const onChoose = (tag: string) => edit((loadout) => chooseFieldMod({ loadout, steps: catalog.fieldSteps, tag }));

  return (
    <motion.li
      aria-label={t('step', { step: step.level })}
      className={s.root}
      data-chosen={chosen ?? 'none'}
      data-single={step.options.length === 1}
      role='group'
      variants={STAGGER_ITEM}
    >
      {step.options.map(({ id, tag, name }, index) => (
        <button
          key={id}
          aria-pressed={chosen === index}
          className={s.option}
          data-side={index === 0 ? 'left' : 'right'}
          type='button'
          onClick={() => onChoose(tag)}
        >
          {chosen === index && <motion.span className={s.indicator} layoutId={layoutId} transition={SPRING} />}
          <span className={s.name}>{name}</span>
        </button>
      ))}
      <span aria-hidden className={s.node}>
        {step.level}
      </span>
    </motion.li>
  );
};
