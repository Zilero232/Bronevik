import { useTranslations } from 'next-intl';

import { TANK_COLLECTION_SLUGS } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { CollectionLinksProps } from './CollectionLinks.types';

import s from './CollectionLinks.module.scss';

export const CollectionLinks = ({ current }: CollectionLinksProps) => {
  const t = useTranslations('vehicleCatalog.collections');

  return (
    <nav aria-label={t('label')} className={s.root}>
      <h2 className={s.title}>{t('heading')}</h2>
      <ul className={s.list}>
        {TANK_COLLECTION_SLUGS.map((slug) => (
          <li key={slug}>
            <Link aria-current={slug === current ? 'page' : undefined} className={s.link} href={ROUTES.tanks.collection(slug)}>
              {t(`items.${slug}.short`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
