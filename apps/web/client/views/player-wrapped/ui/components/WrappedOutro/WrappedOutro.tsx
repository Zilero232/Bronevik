'use client';

import { Check, Link2, Share2, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { WrappedOutroProps } from './WrappedOutro.types';

import s from './WrappedOutro.module.scss';

export const WrappedOutro = ({ nickname, years, copied, onShare, onCopy }: WrappedOutroProps) => {
  const t = useTranslations('wrapped.outro');
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <h2 className={s.title} id={titleId}>
        {t('title')}
      </h2>
      <div className={s.actions}>
        <Button size='sm' onClick={onShare}>
          <Share2 aria-hidden size={16} />
          {t('share')}
        </Button>
        <Button size='sm' variant='secondary' onClick={onCopy}>
          {copied ? <Check aria-hidden size={16} /> : <Link2 aria-hidden size={16} />}
          {t('copy')}
        </Button>
        <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.players.profile(nickname)}>
          <UserRound aria-hidden size={16} />
          {t('profile')}
        </Link>
      </div>
      <nav aria-label={t('years')} className={s.years}>
        {years.map((option) => (
          <Link
            key={option.year}
            aria-current={option.isCurrent ? 'page' : undefined}
            className={s.year}
            data-active={option.isCurrent}
            href={option.href}
          >
            {option.year}
          </Link>
        ))}
      </nav>
    </section>
  );
};
