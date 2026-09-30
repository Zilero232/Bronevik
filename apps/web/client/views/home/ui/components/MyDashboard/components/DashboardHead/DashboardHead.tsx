'use client';

import { LogOut, Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NicknameForm } from '@/features/player/own-nickname';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar, Button, Popover } from '@/ui-kit';

import type { DashboardHeadProps } from './DashboardHead.types';

import { HOME_ICON } from '../../../../../config';

import s from './DashboardHead.module.scss';

export const DashboardHead = ({ summary, onForget }: DashboardHeadProps) => {
  const t = useTranslations('home.dashboard');
  const tMenu = useTranslations('ownPlayer.menu');

  return (
    <header className={s.root}>
      <Avatar name={summary.nickname} size='md' />
      <div className={s.identity}>
        <p className={s.eyebrow}>{t('title')}</p>
        <p className={s.line}>
          <Link className={s.name} href={ROUTES.players.profile(summary.nickname)}>
            {summary.nickname}
          </Link>
          {summary.clan && (
            <Link aria-label={t('clan', { tag: summary.clan.tag })} className={s.clan} href={ROUTES.clans.detail(summary.clan.tag)}>
              [{summary.clan.tag}]
            </Link>
          )}
        </p>
      </div>
      <div className={s.actions}>
        <Popover
          trigger={
            <Button size='sm' variant='ghost'>
              <Repeat aria-hidden size={HOME_ICON.dashboard} />
              <span className={s.actionLabel}>{t('switch')}</span>
            </Button>
          }
          align='end'
          description={tMenu('description')}
          title={tMenu('switch')}
        >
          <NicknameForm isLabelShown={false} />
        </Popover>
        <Button aria-label={t('forget')} size='sm' title={t('forget')} variant='ghost' onClick={onForget}>
          <LogOut aria-hidden size={HOME_ICON.dashboard} />
        </Button>
      </div>
    </header>
  );
};
