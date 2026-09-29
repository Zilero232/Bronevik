'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';

import { Link } from '@/shared/i18n/navigation';

import type { FeaturedLinkProps } from './FeaturedLink.types';

import s from './FeaturedLink.module.scss';

export const FeaturedLink = ({ href, eyebrow, title, meta, isAccent = false }: FeaturedLinkProps) => (
  <NavigationMenu.Link closeOnClick className={s.root} render={<Link href={href} />}>
    <span className={s.eyebrow} data-accent={isAccent}>
      {eyebrow}
    </span>
    <span className={s.title}>{title}</span>
    {meta && <span className={s.meta}>{meta}</span>}
  </NavigationMenu.Link>
);
