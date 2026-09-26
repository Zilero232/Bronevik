'use client';

import { WEBHOOK } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';

import { CodeBlock, Tabs } from '@/ui-kit';

import { WEBHOOK_EVENT_KEYS, WEBHOOK_EXAMPLES } from '../../../../../config';

import s from './EventPayloads.module.scss';

export const EventPayloads = () => {
  const t = useTranslations('developers.webhooks');

  return (
    <div className={s.root}>
      <h4 className={s.heading}>{t('eventsTitle')}</h4>
      <Tabs
        items={WEBHOOK.events.map((event) => ({
          value: event,
          label: <code className={s.event}>{event}</code>,
          content: (
            <div className={s.panel}>
              <p className={s.text}>{t(`events.${WEBHOOK_EVENT_KEYS[event]}`)}</p>
              <CodeBlock code={JSON.stringify(WEBHOOK_EXAMPLES[event], null, 2)} language='json' title={t('payload')} />
            </div>
          )
        }))}
      />
    </div>
  );
};
