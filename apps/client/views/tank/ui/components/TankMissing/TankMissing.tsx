'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState } from '@/ui-kit';

import type { TankMissingProps } from './TankMissing.types';

import s from './TankMissing.module.scss';

export const TankMissing = ({ reason }: TankMissingProps) => {
  const t = useTranslations('tank.missing');
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className={s.root}>
      <EmptyState
        action={
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.tanks}>
            <ArrowLeft aria-hidden size={16} />
            {t('back')}
          </Link>
        }
        code={t(`${reason}.code`)}
        description={t(`${reason}.description`, { slug: decodeURIComponent(slug) })}
        title={t(`${reason}.title`)}
      />
    </div>
  );
};
