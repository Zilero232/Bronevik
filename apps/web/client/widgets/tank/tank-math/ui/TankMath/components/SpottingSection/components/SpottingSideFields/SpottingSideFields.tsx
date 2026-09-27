'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { RangeSlider, SegmentedControl, Switch } from '@/ui-kit';

import type { SpottingSideFieldsProps } from './SpottingSideFields.types';

import { SPOTTING_SWITCHES, TANK_MATH } from '../../../../../../config';

import s from './SpottingSideFields.module.scss';

export const SpottingSideFields = ({ side, title, control, foliage, children }: SpottingSideFieldsProps) => {
  const t = useTranslations('tankMath.spotting');

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{title}</legend>
      {children}
      <Controller
        render={({ field }) => (
          <div className={s.group}>
            <span className={s.label}>{t('foliageLabel')}</span>
            <SegmentedControl aria-label={t('foliageLabel')} options={foliage} size='sm' value={field.value} onChange={field.onChange} />
          </div>
        )}
        control={control}
        name={`${side}.foliage`}
      />
      {SPOTTING_SWITCHES.map(({ group, keys }) => (
        <div key={group} className={s.switches}>
          <span className={s.label}>{t(`groups.${group}`)}</span>
          {keys.map((key) => (
            <Controller
              key={key}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  description={t(`switches.${key}.hint`)}
                  label={t(`switches.${key}.label`)}
                  onCheckedChange={field.onChange}
                />
              )}
              control={control}
              name={`${side}.${key}`}
            />
          ))}
        </div>
      ))}
      <Controller
        render={({ field }) => (
          <RangeSlider
            label={t('camoSkill')}
            max={TANK_MATH.camoSkill.max}
            min={TANK_MATH.camoSkill.min}
            step={TANK_MATH.camoSkill.step}
            value={field.value}
            valueLabel={t('camoSkillValue', { value: field.value })}
            onValueChange={field.onChange}
          />
        )}
        control={control}
        name={`${side}.camoSkill`}
      />
    </fieldset>
  );
};
