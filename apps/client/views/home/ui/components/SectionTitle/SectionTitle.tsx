import { ArrowRight } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';

import type { SectionTitleProps } from './SectionTitle.types';

import s from './SectionTitle.module.scss';

export const SectionTitle = ({ id, title, meta, aside, more }: SectionTitleProps) => (
  <header className={s.root}>
    <div className={s.heading}>
      <h2 className={s.title} id={id}>
        {title}
      </h2>
      {meta && <span className={s.meta}>{meta}</span>}
    </div>
    {aside && <div className={s.aside}>{aside}</div>}
    {more && (
      <Link className={s.more} href={more.href}>
        {more.label}
        <ArrowRight aria-hidden size={14} />
      </Link>
    )}
  </header>
);
