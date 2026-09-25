'use client';

import { Info, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SCALE_IN } from '@/shared/lib';
import { Button, buttonVariants } from '@/ui-kit';

import { GUESS_TANK } from '../../../config';
import { shareText } from '../../../lib/share-text';
import { useGuessGame } from '../../../model/context';
import { Countdown } from '../Countdown';
import { ResultStats } from '../ResultStats';

import s from './GameResult.module.scss';

export const GameResult = () => {
  const t = useTranslations('play.result');
  const { number, target, guesses, status } = useGuessGame();

  const isWon = status === 'won';

  const onShare = async () => {
    const text = shareText({
      title: t('shareTitle'),
      number,
      feedback: guesses.map(({ feedback }) => feedback),
      isWon,
      maxGuesses: GUESS_TANK.maxGuesses,
      url: window.location.href
    });

    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied'), { description: t('copiedHint') });
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <motion.section animate='visible' aria-live='polite' className={s.root} data-status={status} initial='hidden' variants={SCALE_IN}>
      <div className={s.head}>
        <span className={s.eyebrow}>{t(isWon ? 'wonEyebrow' : 'lostEyebrow')}</span>
        <h2 className={s.title}>{isWon ? t('wonTitle', { count: guesses.length }) : t('lostTitle')}</h2>
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
    </motion.section>
  );
};
