'use client';

import { Info, Share2 } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Card } from '@/ui-kit';

import type { DailyResultProps } from './DailyResult.types';

import { PuzzleCountdown } from '../PuzzleCountdown';
import { StreakFigures } from '../StreakFigures';

import s from './DailyResult.module.scss';

export const DailyResult = ({ status, title, text, shareLabel, detail, streak, currentStreak, onShare, onExpire }: DailyResultProps) => (
  <Card aria-live='polite' className={s.root} data-status={status} variant='panel'>
    <div className={s.head}>
      <h2 className={s.title}>{title}</h2>
      <p className={s.text}>{text}</p>
    </div>
    <StreakFigures currentStreak={currentStreak} streak={streak} />
    <div className={s.actions}>
      <Button size='md' onClick={onShare}>
        <Share2 size={16} />
        {shareLabel}
      </Button>
      <Link className={buttonVariants({ variant: 'secondary', size: 'md' })} href={detail.href}>
        <Info size={16} />
        {detail.label}
      </Link>
    </div>
    <PuzzleCountdown onExpire={onExpire} />
  </Card>
);
