'use client';

import { Star, Trash2, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getFavorites, removeFavorite } from '@/shared/api/me';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, IconButton, Skeleton } from '@/ui-kit';

import { useMeMutation, useMeSection } from '../../../model/hooks';
import { MeCard } from '../MeCard';

import s from './FavoritesCard.module.scss';

export const FavoritesCard = () => {
  const t = useTranslations('me.favorites');
  const { data: favorites, isPending } = useMeSection({ section: 'favorites', fetcher: getFavorites });
  const remove = useMeMutation({ section: 'favorites', mutationFn: removeFavorite, successKey: 'favoriteRemoved' });

  return (
    <MeCard description={t('description')} icon={<Star size={18} />} title={t('title')}>
      {isPending && <Skeleton height={160} shape='block' />}
      {favorites?.length === 0 && <p className={s.empty}>{t('empty')}</p>}
      <ul className={s.list}>
        {favorites?.map(({ id, kind, title, label, isOwn, targetId }) => (
          <li key={id} className={s.row}>
            <User className={s.kind} size={14} />
            {kind === 'player' && title ? (
              <Link className={s.name} href={ROUTES.player(title)}>
                {title}
              </Link>
            ) : (
              <span className={s.name}>{title ?? `#${targetId}`}</span>
            )}
            {label && <span className={s.label}>{label}</span>}
            {isOwn && <Badge tone='accent'>{t('own')}</Badge>}
            <IconButton aria-label={t('remove')} disabled={remove.isPending} size='sm' onClick={() => remove.mutate(id)}>
              <Trash2 size={14} />
            </IconButton>
          </li>
        ))}
      </ul>
    </MeCard>
  );
};
