'use client';

import type { Nation } from '@otmetki/icons';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { NATION_ICONS, NATIONS } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { useTreeParams } from '../../../model/hooks';

import s from './NationSelector.module.scss';

export const NationSelector = () => {
  const t = useTranslations('game.nations');
  const tTree = useTranslations('tree.nations');
  const { nation, setNation } = useTreeParams();

  return (
    <RadioGroup<Nation> aria-label={tTree('label')} className={s.root} value={nation} onValueChange={setNation}>
      {NATIONS.map((value) => {
        const Icon = NATION_ICONS[value];

        return (
          <Radio.Root<Nation> nativeButton key={value} className={s.chip} render={<button type='button' />} value={value}>
            <Icon aria-hidden className={s.icon} palette='color' size={16} />
            <span>{t(value)}</span>
          </Radio.Root>
        );
      })}
    </RadioGroup>
  );
};
