'use client';

import { ExternalLink, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { ModReferencesProps } from './ModReferences.types';

import s from './ModReferences.module.scss';

export const ModReferences = ({ references }: ModReferencesProps) => {
  const t = useTranslations('streamerSettings');

  return (
    <div className={s.root}>
      {references.length > 0 && (
        <ul className={s.list}>
          {references.map((reference) => (
            <li key={reference.id} className={s.item}>
              <span className={s.kind}>{t(`page.modKinds.${reference.kind}`)}</span>
              <a className={s.link} href={reference.officialUrl} rel='nofollow noopener noreferrer' target='_blank'>
                {reference.name}
                <ExternalLink size={12} />
              </a>
              <span className={s.author}>{reference.author}</span>
              {reference.onMost && (
                <Badge shape='plate' title={t('page.onMostHint')} tone='steel'>
                  {t('page.onMost')}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className={s.fairPlay}>
        <ShieldAlert size={14} />
        {t('common.fairPlay')}
      </p>
    </div>
  );
};
