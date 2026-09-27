'use client';

import { Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import s from './SettingsImportMod.module.scss';

export const SettingsImportMod = () => {
  const t = useTranslations('streamer.settings.mod');

  return (
    <section className={s.root}>
      <h3 className={s.title}>
        <Gamepad2 size={16} />
        {t('title')}
      </h3>
      <p className={s.text}>{t('description')}</p>
      <ol className={s.steps}>
        <li>{t('steps.bind')}</li>
        <li>{t('steps.share')}</li>
        <li>{t('steps.target')}</li>
      </ol>
      <p className={s.hint}>{t('hint')}</p>
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.mod}>
        {t('bind')}
      </Link>
    </section>
  );
};
