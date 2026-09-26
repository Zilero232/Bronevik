'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Skeleton } from '@/ui-kit';

import type { PlusTeaserProps } from './PlusTeaser.types';

import { PLUS_FEATURE_ICONS, PLUS_GATE } from '../../config';
import { usePlusTeaser } from '../../model/hooks';
import { PlusBadge } from '../PlusBadge';

import s from './PlusTeaser.module.scss';

export const PlusTeaser = ({ feature, className }: PlusTeaserProps) => {
  const t = useTranslations('plus');
  const titleId = useId();
  const { action, trialDays, isPending, isStarting, onStartTrial } = usePlusTeaser();

  const Icon = PLUS_FEATURE_ICONS[feature];

  return (
    <section aria-labelledby={titleId} className={clsx(s.root, className)}>
      <span aria-hidden className={s.icon}>
        <Icon size={PLUS_GATE.iconSize} />
      </span>
      <div className={s.body}>
        <header className={s.head}>
          <h3 className={s.title} id={titleId}>
            {t(`gate.${feature}.title`)}
          </h3>
          <PlusBadge />
        </header>
        <p className={s.text}>{t(`gate.${feature}.text`)}</p>
      </div>
      <div className={s.action}>
        {match({ isPending, action })
          .with({ isPending: true }, () => <Skeleton height={36} shape='block' width={180} />)
          .with({ action: 'signIn' }, () => (
            <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.auth.login}>
              {t('teaser.signIn')}
            </Link>
          ))
          .with({ action: 'trial' }, () => (
            <Button disabled={isStarting} onClick={onStartTrial}>
              {t('teaser.trial', { days: trialDays })}
            </Button>
          ))
          .with({ action: 'subscribe' }, () => (
            <Link className={buttonVariants()} href={ROUTES.plus}>
              {t('teaser.subscribe')}
            </Link>
          ))
          .otherwise(() => null)}
      </div>
    </section>
  );
};
