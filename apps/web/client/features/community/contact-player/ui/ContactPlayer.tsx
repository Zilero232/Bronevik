'use client';

import { clsx } from 'clsx';
import { Check, Copy, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { ContactPlayerProps } from './ContactPlayer.types';

import { useContactPlayer } from '../model/hooks';

import s from './ContactPlayer.module.scss';

export const ContactPlayer = ({ nickname, accountId, className }: ContactPlayerProps) => {
  const t = useTranslations('community.contact');
  const { canCopy, copied, profileHref, onCopy } = useContactPlayer({ nickname, accountId });

  return (
    <div className={clsx(s.root, className)}>
      {canCopy && (
        <Button size='sm' title={t('copyHint')} variant='secondary' onClick={onCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {t('copy')}
        </Button>
      )}
      <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={profileHref}>
        <UserRound size={14} />
        {t('profile')}
      </Link>
    </div>
  );
};
