'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { SITE_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { NavPanelProps } from './NavPanel.types';

import { FeaturedEvent } from '../FeaturedEvent';
import { FeaturedStreamers } from '../FeaturedStreamers';
import { FeaturedTank } from '../FeaturedTank';
import { NavPanelLink } from '../NavPanelLink';

import s from './NavPanel.module.scss';

export const NavPanel = ({ group, activeHref }: NavPanelProps) => {
  const t = useTranslations('nav');

  return (
    <div className={s.root} data-featured={group.featured !== null}>
      <div className={s.main}>
        <span className={s.title}>{t(`groups.${group.key}`)}</span>
        <ul className={s.links}>
          {group.items.map((item) => (
            <li key={item.key}>
              <NavPanelLink isActive={activeHref === item.href} item={item} />
            </li>
          ))}
        </ul>
        <NavigationMenu.Link closeOnClick className={s.hub} render={<Link href={SITE_NAV.hub.href} />}>
          <SITE_NAV.hub.icon aria-hidden size={16} />
          {t('allSections')}
          <ArrowRight aria-hidden className={s.hubArrow} size={14} />
        </NavigationMenu.Link>
      </div>
      {group.featured !== null && (
        <div className={s.featured}>
          {match(group.featured)
            .with('topTank', () => <FeaturedTank />)
            .with('currentEvent', () => <FeaturedEvent />)
            .with('liveStreamers', () => <FeaturedStreamers />)
            .exhaustive()}
        </div>
      )}
    </div>
  );
};
