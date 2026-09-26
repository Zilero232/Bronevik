'use client';

import { useTranslations } from 'next-intl';

import { CALCULATOR_IDS, TOOLS_LAYOUT } from '../../../config';
import { useActiveCalculator } from '../../../model/hooks';

import s from './CalculatorNav.module.scss';

export const CalculatorNav = () => {
  const t = useTranslations('tools');
  const [active, setActive] = useActiveCalculator();

  return (
    <nav aria-label={t('nav')} className={s.root}>
      <ul className={s.list}>
        {CALCULATOR_IDS.map((id) => (
          <li key={id}>
            <button aria-controls={TOOLS_LAYOUT.panelId} aria-pressed={active === id} className={s.item} type='button' onClick={() => setActive(id)}>
              {t(`calcs.${id}`)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
