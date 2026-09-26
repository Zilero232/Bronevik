'use client';

import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { PLATFORM_ICONS } from '@/entities/streamer/channel';
import { buttonVariants, Card, CardHeader, RelativeTime, TankImage } from '@/ui-kit';

import type { LiveBlockProps } from './LiveBlock.types';

import { STREAMER_PAGE } from '../../../config';
import { useLiveBlock } from '../../../model/hooks';

import s from './LiveBlock.module.scss';

export const LiveBlock = ({ live, channels }: LiveBlockProps) => {
  const t = useTranslations('streamersDirectory.public.live');
  const tPlatforms = useTranslations('streamersDirectory.channel.platforms');
  const format = useFormatter();
  const { vehicle, watchUrl } = useLiveBlock({ live, channels });

  const PlatformIcon = PLATFORM_ICONS[live.platform];

  return (
    <Card className={s.root} padding='md'>
      <CardHeader
        action={
          watchUrl && (
            <a className={buttonVariants({ size: 'sm' })} href={watchUrl} rel='noopener noreferrer' target='_blank'>
              {t('watch')}
              <ExternalLink size={STREAMER_PAGE.iconSize} />
            </a>
          )
        }
        meta={live.checkedAt && <RelativeTime value={live.checkedAt} />}
        title={<LiveLamp label={t('title')} />}
      />
      <dl className={s.grid}>
        <div className={s.cell}>
          <dt>{t('platform')}</dt>
          <dd className={s.platform}>
            <PlatformIcon aria-hidden size={STREAMER_PAGE.iconSize} />
            {tPlatforms(live.platform)}
          </dd>
        </div>
        <div className={s.cell}>
          <dt>{t('viewers')}</dt>
          <dd className={s.value}>{live.viewers === null ? '—' : format.number(live.viewers)}</dd>
        </div>
        <div className={s.cell}>
          <dt>{t('tank')}</dt>
          <dd className={s.tank}>
            {vehicle && <TankImage isDecorative size='small' tank={vehicle} />}
            {vehicle?.name ?? live.tankName ?? t('tankUnknown')}
          </dd>
        </div>
      </dl>
    </Card>
  );
};
