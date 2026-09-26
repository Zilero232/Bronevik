'use client';

import { useTranslations } from 'next-intl';

import { GameIcon } from '@/entities/tank/build';

import type { FieldModStepProps } from './FieldModStep.types';

import { BUILD_VIEW } from '../../../../../config';
import { useFieldModStep } from '../../../../../model/hooks';

import s from './FieldModStep.module.scss';

export const FieldModStep = ({ step }: FieldModStepProps) => {
  const t = useTranslations('builds.panels.fieldMods');
  const { chosen, onChoose } = useFieldModStep({ step });

  return (
    <li aria-label={t('step', { step: step.level })} className={s.root} role='group'>
      <span aria-hidden className={s.level}>
        {step.level}
      </span>
      <div className={s.options}>
        {step.options.map(({ id, tag, name, image }, index) => (
          <button key={id} aria-pressed={chosen === index} className={s.option} type='button' onClick={onChoose(tag)}>
            <GameIcon size={BUILD_VIEW.iconSize.gear} src={image} />
            <span className={s.name}>{name}</span>
          </button>
        ))}
      </div>
    </li>
  );
};
