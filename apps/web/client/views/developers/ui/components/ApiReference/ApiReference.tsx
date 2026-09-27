'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants, Card, CardBody, CardHeader } from '@/ui-kit';

import { API_REFERENCE } from '../../../config';

import s from './ApiReference.module.scss';

export const ApiReference = () => {
  const t = useTranslations('developers.reference');

  return (
    <Card id='reference'>
      <CardHeader title={t('title')}>
        <p className={s.description}>{t('description')}</p>
      </CardHeader>
      <CardBody>
        <div className={s.links}>
          <a className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={API_REFERENCE.docsUrl} rel='noreferrer' target='_blank'>
            {t('docs')}
            <ExternalLink size={14} />
          </a>
          <a className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={API_REFERENCE.specUrl} rel='noreferrer' target='_blank'>
            {t('spec')}
            <ExternalLink size={14} />
          </a>
        </div>
      </CardBody>
    </Card>
  );
};
