'use client';

import { KeyFigure } from '@/ui-kit';

import { useHeroFigures } from '../../../../../model/hooks';

import s from './HeroFigures.module.scss';

export const HeroFigures = () => {
  const { figures } = useHeroFigures();

  if (figures.length === 0) {
    return null;
  }

  return (
    <div className={s.root}>
      {figures.map(({ key, label, value, format, suffix, tone }) => (
        <KeyFigure key={key} className={s.figure} format={format} label={label} size='xl' suffix={suffix} tone={tone} value={value} />
      ))}
    </div>
  );
};
