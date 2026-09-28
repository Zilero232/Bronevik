import { ExternalLink, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankLink } from '@/entities/tank/tank';
import { buttonVariants, RelativeTime, StoryCard } from '@/ui-kit';

import type { NewsCardProps } from './NewsCard.types';

import { NEWS } from '../../../config';

import s from './NewsCard.module.scss';

export const NewsCard = ({ entry: { item, href, excerpt, isFresh, vehicles }, variant = 'default', isPriority = false }: NewsCardProps) => {
  const t = useTranslations('news');
  const Icon = NEWS.kindIcon[item.kind];

  return (
    <StoryCard
      isExternal
      actions={
        href && (
          <a
            className={buttonVariants({ variant: variant === 'lead' ? 'primary' : 'secondary', size: 'sm' })}
            href={href}
            rel='noopener noreferrer'
            target='_blank'
          >
            {t('read')}
            <ExternalLink aria-hidden size={14} />
          </a>
        )
      }
      chip={
        <>
          <Icon aria-hidden size={12} />
          {t(`filters.${item.kind}`)}
        </>
      }
      flag={
        isFresh && (
          <>
            <Sparkles aria-hidden size={12} />
            {t('fresh')}
          </>
        )
      }
      footer={
        vehicles.length > 0 && (
          <ul aria-label={t('mentions')} className={s.tanks}>
            {vehicles.map((vehicle) => (
              <li key={vehicle.tankId} className={s.tank}>
                <TankLink vehicle={vehicle} />
              </li>
            ))}
          </ul>
        )
      }
      meta={
        <>
          {variant === 'lead' && <span className={s.latest}>{t('latest')}</span>}
          <RelativeTime value={item.publishedAt} />
          {item.gameVersion && <span className={s.version}>{t('version', { version: item.gameVersion })}</span>}
        </>
      }
      cover={item.image}
      excerpt={excerpt}
      glyph={<Icon />}
      href={href}
      isPriority={isPriority}
      title={item.title}
      tone={NEWS.kindTone[item.kind]}
      variant={variant}
    />
  );
};
