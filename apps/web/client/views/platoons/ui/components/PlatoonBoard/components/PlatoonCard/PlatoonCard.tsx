'use client';

import { Mic, MicOff } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankStrip } from '@/entities/tank/tank';
import { ContactPlayer } from '@/features/community/contact-player';
import { PlayerStatsLine } from '@/features/community/player-stats';
import { Link } from '@/shared/i18n/navigation';
import { Badge, Button, Card, RelativeTime, TierNumeral } from '@/ui-kit';

import type { PlatoonCardProps } from './PlatoonCard.types';

import { usePlatoonCard } from '../../../../../model/hooks';

import s from './PlatoonCard.module.scss';

export const PlatoonCard = ({ post }: PlatoonCardProps) => {
  const t = useTranslations('platoons.card');
  const format = useFormatter();
  const { vehicles, availabilityText, availabilityState, modesText, profileHref, isOwn, isClosing, onClose } = usePlatoonCard(post);

  return (
    <Card className={s.root} padding='sm'>
      <header className={s.head}>
        <Link className={s.nick} href={profileHref}>
          {post.nickname ?? t('unknownNick')}
        </Link>
        {isOwn && <Badge tone='accent'>{t('own')}</Badge>}
        <span className={s.expiry}>
          {t('expires')} <RelativeTime value={post.expiresAt} />
        </span>
      </header>
      <PlayerStatsLine stats={post.stats} />
      <dl className={s.facts}>
        <div className={s.fact}>
          <dt className={s.label}>{t('tiers')}</dt>
          <dd className={s.tiers}>{post.tiers.length === 0 ? t('anyTier') : post.tiers.map((tier) => <TierNumeral key={tier} tier={tier} />)}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('modes')}</dt>
          <dd>{post.modes.length === 0 ? t('anyMode') : modesText}</dd>
        </div>
        <div className={s.fact}>
          <dt className={s.label}>{t('voice')}</dt>
          <dd className={s.voice}>
            {post.hasVoice ? <Mic size={14} /> : <MicOff size={14} />}
            {post.hasVoice ? t('voiceYes') : t('voiceNo')}
          </dd>
        </div>
        {post.minWn8 !== null && (
          <div className={s.fact}>
            <dt className={s.label}>{t('minWn8')}</dt>
            <dd className={s.numeric}>{format.number(post.minWn8)}</dd>
          </div>
        )}
        <div className={s.fact}>
          <dt className={s.label}>{t('when')}</dt>
          <dd className={s.when} data-state={availabilityState}>
            {availabilityText}
          </dd>
        </div>
      </dl>
      {vehicles.length > 0 && <TankStrip label={t('tanks')} vehicles={vehicles} />}
      {post.message && <p className={s.message}>{post.message}</p>}
      <footer className={s.foot}>
        <ContactPlayer accountId={post.accountId} nickname={post.nickname} />
        {isOwn && (
          <Button disabled={isClosing} size='sm' variant='ghost' onClick={onClose}>
            {t('close')}
          </Button>
        )}
      </footer>
    </Card>
  );
};
