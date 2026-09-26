'use client';

import { Info, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Card } from '@/ui-kit';

import { useGameResult } from '../../../model/hooks';
import { Countdown } from '../Countdown';
import { ResultStats } from '../ResultStats';

import s from './GameResult.module.scss';

export const GameResult = () => {
  const t = useTranslations('play.result');
  const { target, guessCount, status, isWon, onShare } = useGameResult();

  return (
    <Card aria-live='polite' className={s.root} data-status={status} variant='panel'>
      <div className={s.head}>
        <h2 className={s.title}>{isWon ? t('wonTitle', { count: guessCount }) : t('lostTitle')}</h2>
        <p className={s.text}>{t(isWon ? 'wonText' : 'lostText', { name: target.name })}</p>
      </div>
      <ResultStats />
      <div className={s.actions}>
        <Button size='md' onClick={onShare}>
          <Share2 size={16} />
          {t('share')}
        </Button>
        <Link className={buttonVariants({ variant: 'secondary', size: 'md' })} href={ROUTES.tank(target.slug)}>
          <Info size={16} />
          {t('openTank')}
        </Link>
      </div>
      <Countdown />
    </Card>
  );
};
