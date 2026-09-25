'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { ArrowLeftRight, Check, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FavoriteButton } from '@/features/player/toggle-favorite';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import { useProfileContext } from '../../../../../model/context';

import s from './HeroActions.module.scss';

export const HeroActions = () => {
  const t = useTranslations('profile.hero');
  const { accountId } = useProfileContext();
  const { copied, copy } = useCopy();

  return (
    <div className={s.root}>
      <FavoriteButton kind='player' targetId={accountId} />
      <Link
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        href={{ pathname: ROUTES.comparePlayers, query: { ids: String(accountId) } }}
      >
        <ArrowLeftRight size={15} />
        {t('compare')}
      </Link>
      <Button size='sm' variant='ghost' onClick={() => copy(window.location.href)}>
        {copied ? <Check size={15} /> : <Share2 size={15} />}
        {copied ? t('copied') : t('share')}
      </Button>
    </div>
  );
};
