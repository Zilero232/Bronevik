import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { BreadcrumbsProps } from './Breadcrumbs.types';

import s from './Breadcrumbs.module.scss';

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const t = useTranslations('common');

  return (
    <nav aria-label={t('breadcrumbs')}>
      <ol className={s.list}>
        {items.map((item) => (
          <li key={item.href ?? 'current'} className={s.item}>
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
