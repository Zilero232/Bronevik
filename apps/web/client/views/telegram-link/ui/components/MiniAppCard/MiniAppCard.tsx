'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardBody, CardHeader } from '@/ui-kit';

import type { MiniAppCardProps } from './MiniAppCard.types';

import { botLink } from '../../../lib/bot-link';

import s from './MiniAppCard.module.scss';

export const MiniAppCard = ({ botUsername }: MiniAppCardProps) => {
  const t = useTranslations('telegram.miniApp');

  return (
    <Card>
      <CardHeader title={t('title')} />
      <CardBody className={s.body}>
        <p className={s.description}>{t('description')}</p>
        <a className={buttonVariants({ block: true })} href={botLink({ username: botUsername })} rel='noreferrer' target='_blank'>
          {t('open')}
          <ExternalLink size={14} />
        </a>
        <Link className={buttonVariants({ variant: 'ghost', block: true })} href={ROUTES.miniApp}>
          {t('preview')}
        </Link>
      </CardBody>
    </Card>
  );
};
