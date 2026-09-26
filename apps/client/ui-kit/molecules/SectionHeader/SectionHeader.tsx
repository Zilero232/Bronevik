import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';

import type { SectionHeaderProps } from './SectionHeader.types';

import s from './SectionHeader.module.scss';

export const SectionHeader = ({
  title,
  id,
  description,
  meta,
  action,
  more,
  count,
  variant = 'default',
  as: Heading = 'h2',
  className
}: SectionHeaderProps) => (
  <header className={clsx(s.root, s[variant], className)}>
    <div className={s.text}>
      <Heading className={s.title} id={id}>
        {title}
        {count !== undefined && <span className={s.count}>{count}</span>}
      </Heading>
      {meta && <span className={s.meta}>{meta}</span>}
      {description && <p className={s.description}>{description}</p>}
    </div>
    {(action || more) && (
      <div className={s.action}>
        {action}
        {more && (
          <Link className={s.more} href={more.href}>
            {more.label}
            <ArrowRight aria-hidden size={14} />
          </Link>
        )}
      </div>
    )}
  </header>
);
