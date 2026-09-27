'use client';

import { useTranslations } from 'next-intl';

import { EntityPicker } from '@/features/search/pick-entity';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import s from './PlayerSearch.module.scss';

export const PlayerSearch = () => {
  const t = useTranslations('players.head');
  const router = useRouter();

  return (
    <div className={s.root}>
      <EntityPicker kind='player' placeholder={t('placeholder')} onPick={({ nickname }) => router.push(ROUTES.players.profile(nickname))} />
    </div>
  );
};
