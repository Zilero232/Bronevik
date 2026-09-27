'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader } from '@/ui-kit';

import type { CoachContactsProps } from './CoachContacts.types';

import s from './CoachContacts.module.scss';

export const CoachContacts = ({ contacts }: CoachContactsProps) => {
  const t = useTranslations('coaching.contacts');

  if (contacts.length === 0) {
    return null;
  }

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <CardBody>
        <dl className={s.list}>
          {contacts.map(({ kind, value, href }) => (
            <div key={kind} className={s.row}>
              <dt className={s.label}>{t(kind)}</dt>
              <dd className={s.value}>
                {href ? (
                  <a className={s.link} href={href} rel='noopener noreferrer nofollow' target='_blank'>
                    {kind === 'booking' ? t('bookingAction') : value}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
};
