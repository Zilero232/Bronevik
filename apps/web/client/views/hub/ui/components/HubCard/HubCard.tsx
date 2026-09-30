import { ArrowRight } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';

import type { HubCardProps } from './HubCard.types';

import { HUB_PAGE } from '../../../config';

import s from './HubCard.module.scss';

export const HubCard = ({ item }: HubCardProps) => (
  <Link className={s.root} href={item.href}>
    <span aria-hidden className={s.icon}>
      <item.icon size={HUB_PAGE.iconSize} />
    </span>
    <span className={s.text}>
      <span className={s.label}>{item.label}</span>
      <span className={s.hint}>{item.hint}</span>
    </span>
    <ArrowRight aria-hidden className={s.arrow} size={16} />
  </Link>
);
