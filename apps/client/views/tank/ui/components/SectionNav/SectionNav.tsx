'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useSectionNav } from '../../../model/hooks';

import s from './SectionNav.module.scss';

export const SectionNav = () => {
  const t = useTranslations('tank.nav');
  const { items, active, onSelect } = useSectionNav();

  return (
    <nav aria-label={t('label')} className={s.root}>
      <ul className={s.list}>
        {items.map(({ id, label, href }) => (
          <li key={id}>
            <a aria-current={active === id ? 'location' : undefined} className={s.tab} href={href} onClick={() => onSelect(id)}>
              {label}
              {active === id && (
                <motion.span className={s.indicator} layoutId='tank-section-indicator' transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
