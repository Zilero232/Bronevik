'use client';

import { COMPETITION, COMPETITION_METRICS } from '@otmetki/schemas';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, NumberField } from '@/ui-kit';

import type { CompetitionFormOutput, CompetitionFormValues } from '../../../../../lib/competition-form';
import type { ScoringFieldsProps } from './ScoringFields.types';

import { COMPETITION_FORM } from '../../../../../config';

import s from './ScoringFields.module.scss';

export const ScoringFields = ({ onReset }: ScoringFieldsProps) => {
  const t = useTranslations('competitions');
  const { control } = useFormContext<CompetitionFormValues, unknown, CompetitionFormOutput>();

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('create.scoring')}</legend>
      <p className={s.hint}>{t('create.scoringHint')}</p>
      <div className={s.grid}>
        {COMPETITION_METRICS.map((metric) => (
          <Controller
            key={metric}
            render={({ field }) => (
              <NumberField
                label={t(`metrics.${metric}`)}
                max={COMPETITION.weightMax}
                min={0}
                step={COMPETITION_FORM.weightStep}
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? 0)}
              />
            )}
            control={control}
            name={`scoring.${metric}`}
          />
        ))}
      </div>
      <Button className={s.reset} size='sm' type='button' variant='ghost' onClick={onReset}>
        <RotateCcw size={14} />
        {t('create.resetScoring')}
      </Button>
    </fieldset>
  );
};
