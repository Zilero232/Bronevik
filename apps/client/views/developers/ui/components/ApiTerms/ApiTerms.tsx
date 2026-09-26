'use client';

import { useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader } from '@/ui-kit';

import { API_TERMS } from '../../../config';

import s from './ApiTerms.module.scss';

export const ApiTerms = () => {
  const t = useTranslations('developers.terms');

  return (
    <Card id='terms'>
      <CardHeader title={t('title')} />
      <CardBody>
        <ul className={s.list}>
          {API_TERMS.items.map((item) => (
            <li key={item} className={s.item}>
              {t(`items.${item}`)}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};
