import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { BreadcrumbsProps } from './Breadcrumbs.types';

import s from './Breadcrumbs.module.scss';

export const Breadcrumbs = ({ items, isCurrentAccent = false }: BreadcrumbsProps) => {
  const t = useTranslations('common');

  return (
    <nav aria-label={t('breadcrumbs')}>
      <ol className={s.list} data-accent={isCurrentAccent}>
        {items.map((item, depth) => (
          // eslint-disable-next-line react/no-array-index-key -- a breadcrumb trail is positional, and a label is a ReactNode rather than a key
          <li key={item.href ?? depth} className={s.item}>
            {item.href ? (
              <Link className={s.link} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current='page'>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
