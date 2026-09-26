import { CalendarPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EVENTS_FEED } from '@/shared/api/events';
import { buttonVariants, Card, CardHeader, CopyField } from '@/ui-kit';

import s from './IcsSubscribe.module.scss';

export const IcsSubscribe = () => {
  const t = useTranslations('events.ics');

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <div className={s.body}>
        <p className={s.hint}>{t('hint')}</p>
        <a className={buttonVariants({ variant: 'primary', size: 'sm', block: true })} href={EVENTS_FEED.webcal}>
          <CalendarPlus aria-hidden size={14} />
          {t('subscribe')}
        </a>
        <CopyField label={t('url')} value={EVENTS_FEED.ics} />
      </div>
    </Card>
  );
};
