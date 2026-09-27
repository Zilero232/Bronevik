'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import { CALCULATOR_IDS, TOOL_GAMES, TOOLS_LAYOUT } from '../../../config';
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
      <span className={s.heading}>{t('games.label')}</span>
      <ul className={s.list}>
        {TOOL_GAMES.map((game) => (
          <li key={game.key}>
            <Link className={s.item} href={game.href}>
              <game.icon aria-hidden className={s.icon} size={15} />
              {t(`games.${game.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
