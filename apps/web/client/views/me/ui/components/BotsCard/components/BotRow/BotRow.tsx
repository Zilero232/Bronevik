'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, Button, buttonVariants } from '@/ui-kit';

import type { BotRowProps } from './BotRow.types';

import s from './BotRow.module.scss';

export const BotRow = ({ row, isBusy, onLink, onUnlink }: BotRowProps) => {
  const t = useTranslations('me.bots');
  const { accountId } = row;

  return (
    <li className={s.root} data-available={row.isAvailable}>
      <div className={s.head}>
        <span className={s.provider}>{t(`${row.provider}.name`)}</span>
        <Badge tone={accountId ? 'success' : 'neutral'}>{t(accountId ? 'linked' : 'notLinked')}</Badge>
      </div>
      <p className={s.about}>{t(row.isAvailable ? `${row.provider}.about` : 'unavailable')}</p>
      <div className={s.actions}>
        {accountId && (
          <Button disabled={isBusy} size='sm' variant='ghost' onClick={() => onUnlink({ accountId })}>
            {t('unlink')}
          </Button>
        )}
        {!accountId && row.canLink && (
          <Button disabled={isBusy} size='sm' onClick={() => onLink(row.provider)}>
            {t(`${row.provider}.link`)}
          </Button>
        )}
        {row.links.map(({ key, href }) => (
          <a key={key} className={buttonVariants({ size: 'sm', variant: 'secondary' })} href={href} rel='noreferrer' target='_blank'>
            {t(`links.${key}`)}
            <ExternalLink size={12} />
          </a>
        ))}
      </div>
    </li>
  );
};
