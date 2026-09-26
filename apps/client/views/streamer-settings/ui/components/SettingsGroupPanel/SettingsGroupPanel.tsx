'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SettingsValue, useSettingsFormatter } from '@/entities/streamer/settings';
import { Card, CardHeader } from '@/ui-kit';

import type { SettingsGroupPanelProps } from './SettingsGroupPanel.types';

import s from './SettingsGroupPanel.module.scss';

export const SettingsGroupPanel = ({ group, children }: SettingsGroupPanelProps) => {
  const t = useTranslations('streamerSettings.common');
  const { groupLabel, fieldLabel, sourceLabel, checkedText } = useSettingsFormatter();

  return (
    <Card className={s.root} padding='md' variant='panel'>
      <CardHeader title={groupLabel(group.group)} />
      {group.rows.length > 0 && (
        <dl className={s.rows}>
          {group.rows.map((row) => (
            <div key={row.path} className={s.row}>
              <dt className={s.label}>{fieldLabel(row.path)}</dt>
              <dd className={s.value}>
                <SettingsValue row={row} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {children}
      {group.provenance && (
        <p className={s.source}>
          <span>{t('source')}: </span>
          {group.provenance.sourceUrl ? (
            <a className={s.link} href={group.provenance.sourceUrl} rel='nofollow noopener noreferrer' target='_blank'>
              {sourceLabel(group.provenance.source)}
              <ExternalLink size={11} />
            </a>
          ) : (
            <span>{sourceLabel(group.provenance.source)}</span>
          )}
          <span> · {checkedText(group.provenance.checkedAt)}</span>
        </p>
      )}
    </Card>
  );
};
