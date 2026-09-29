'use client';

import { ArrowRight, Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

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
      <Link className={s.games} href={ROUTES.play.hub}>
        <Gamepad2 aria-hidden className={s.icon} size={15} />
        {t('games')}
        <ArrowRight aria-hidden className={s.arrow} size={14} />
      </Link>
    </nav>
  );
};
