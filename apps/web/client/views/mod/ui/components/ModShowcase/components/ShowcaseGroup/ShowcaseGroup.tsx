import { useTranslations } from 'next-intl';

import { OpenInManager } from '@/features/mod/open-in-manager';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { ShowcaseGroupProps } from './ShowcaseGroup.types';

import { ComponentCard } from '../ComponentCard';

import s from './ShowcaseGroup.module.scss';

export const ShowcaseGroup = ({ group }: ShowcaseGroupProps) => {
  const t = useTranslations('mod.showcase');

  return (
    <div className={s.root}>
      <p className={s.lead}>{t(`groups.${group.id}.lead`)}</p>
      <ul className={s.grid}>
        {group.items.map((item) => (
          <ComponentCard key={item.id} item={item} />
        ))}
      </ul>
      {group.id === 'streamers' && (
        <div className={s.actions}>
          <OpenInManager target={{ kind: 'install', preset: 'streamer' }} />
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.streamers.forStreamers}>
            {t('streamerPage')}
          </Link>
        </div>
      )}
    </div>
  );
};
