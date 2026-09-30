'use client';

import { LayoutDashboard, LogOut, Repeat, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Popover } from '@/ui-kit';

import { OWN_NICKNAME } from '../../config';
import { useOwnPlayerMenu } from '../../model/hooks';
import { NicknameForm } from '../NicknameForm';

import s from './OwnPlayerMenu.module.scss';

export const OwnPlayerMenu = () => {
  const t = useTranslations('ownPlayer.menu');
  const { isReady, player, isOpen, isSwitching, onOpenChange, close, startSwitch, forget } = useOwnPlayerMenu();

  if (!isReady) {
    return null;
  }

  return (
    <Popover
      trigger={
        <button
          aria-label={player ? t('open', { nickname: player.nickname }) : t('ask')}
          className={s.trigger}
          data-set={player !== null}
          type='button'
        >
          <UserRound aria-hidden size={OWN_NICKNAME.iconSize} />
          <span className={s.name}>{player ? player.nickname : t('ask')}</span>
        </button>
      }
      align='end'
      description={player && !isSwitching ? undefined : t('description')}
      open={isOpen}
      title={player && !isSwitching ? t('title', { nickname: player.nickname }) : t('ask')}
      onOpenChange={onOpenChange}
    >
      {player && !isSwitching ? (
        <div className={s.body}>
          <nav aria-label={t('linksLabel')} className={s.links}>
            <Link className={s.link} href={{ pathname: ROUTES.home, hash: OWN_NICKNAME.dashboardHash }} onClick={close}>
              <LayoutDashboard aria-hidden size={OWN_NICKNAME.iconSize} />
              {t('dashboard')}
            </Link>
            <Link className={s.link} href={ROUTES.players.profile(player.nickname)} onClick={close}>
              <UserRound aria-hidden size={OWN_NICKNAME.iconSize} />
              {t('profile')}
            </Link>
          </nav>
          <div className={s.actions}>
            <button className={s.action} type='button' onClick={startSwitch}>
              <Repeat aria-hidden size={OWN_NICKNAME.iconSize} />
              {t('switch')}
            </button>
            <button className={s.action} type='button' onClick={forget}>
              <LogOut aria-hidden size={OWN_NICKNAME.iconSize} />
              {t('forget')}
            </button>
          </div>
          <p className={s.note}>{t('note')}</p>
        </div>
      ) : (
        <NicknameForm className={s.form} isLabelShown={false} onDone={close} />
      )}
    </Popover>
  );
};
