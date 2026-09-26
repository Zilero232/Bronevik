'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { OVERLAY_OPTIONS } from '@/entities/streamer/overlay';
import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Badge } from '@/ui-kit';

import type { ToolCardProps } from './ToolCard.types';

import { ChatPreview } from '../ChatPreview';

import s from './ToolCard.module.scss';

export const ToolCard = ({ tool, icon: Icon }: ToolCardProps) => {
  const t = useTranslations('streamers.tools');
  const tTheme = useTranslations('streamer.overlays.theme');

  return (
    <article className={s.root} data-tool={tool}>
      <header className={s.head}>
        <Icon aria-hidden className={s.icon} size={22} />
        {tool === 'challenges' && <Badge tone='accent'>{t('challenges.tag')}</Badge>}
      </header>
      <h3 className={s.title}>{t(`${tool}.title`)}</h3>
      <p className={s.text}>{t(`${tool}.text`)}</p>
      {match(tool)
        .with('challenges', () => (
          <span aria-hidden className={s.stamp}>
            {t('challenges.stamp')}
          </span>
        ))
        .with('overlays', () => (
          <ul className={s.chips}>
            {OVERLAY_OPTIONS.themes.map((theme) => (
              <li key={theme} className={s.chip} data-theme-chip={theme}>
                {tTheme(theme)}
              </li>
            ))}
          </ul>
        ))
        .with('commands', () => <ChatPreview />)
        .with('page', () => (
          <code className={s.url}>
            {new URL(SITE.url).host}
            {ROUTES.streamer('')}
            <span className={s.slug}>{t('page.slug')}</span>
          </code>
        ))
        .exhaustive()}
    </article>
  );
};
