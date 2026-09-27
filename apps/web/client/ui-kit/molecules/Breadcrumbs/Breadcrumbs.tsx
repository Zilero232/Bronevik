import { useLocale, useTranslations } from 'next-intl';

import { resolveLocale } from '@/shared/i18n';
import { Link } from '@/shared/i18n/navigation';
import { breadcrumbTrail } from '@/shared/lib';
import { breadcrumbJsonLd, JsonLd } from '@/shared/seo/json-ld';

import type { BreadcrumbsProps } from './Breadcrumbs.types';

import s from './Breadcrumbs.module.scss';

export const Breadcrumbs = ({ items, isCurrentAccent = false, className }: BreadcrumbsProps) => {
  const t = useTranslations('common');
  const locale = resolveLocale(useLocale());
  const trail = breadcrumbTrail(items);

  return (
    <nav aria-label={t('breadcrumbs')} className={className}>
      <ol className={s.list} data-accent={isCurrentAccent}>
        {items.map((item, depth) => (
          // eslint-disable-next-line react/no-array-index-key -- a breadcrumb trail is positional, and a label is a ReactNode rather than a key
          <li key={item.href ?? depth} className={s.item}>
            {item.href ? (
              <Link className={s.link} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current={depth === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      {trail && <JsonLd data={breadcrumbJsonLd({ items: trail, locale })} />}
    </nav>
  );
};
