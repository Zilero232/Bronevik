'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import type { NavPanelProps } from './NavPanel.types';

import { FeaturedEvent } from '../FeaturedEvent';
import { FeaturedTank } from '../FeaturedTank';
import { NavPanelLink } from '../NavPanelLink';

import s from './NavPanel.module.scss';

export const NavPanel = ({ group, activeHref }: NavPanelProps) => {
  const t = useTranslations('nav.groups');

  return (
    <div className={s.root} data-featured={group.featured !== null}>
      <div className={s.main}>
        <span className={s.title}>{t(group.key)}</span>
        <ul className={s.links}>
          {group.items.map((item) => (
            <li key={item.key}>
              <NavPanelLink isActive={activeHref === item.href} item={item} />
            </li>
          ))}
        </ul>
      </div>
      {group.featured !== null && (
        <div className={s.featured}>
          {match(group.featured)
            .with('topTank', () => <FeaturedTank />)
            .with('currentEvent', () => <FeaturedEvent />)
            .exhaustive()}
        </div>
      )}
    </div>
  );
};
