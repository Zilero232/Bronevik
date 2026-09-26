'use client';

import { KeySquare, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, SectionHeader } from '@/ui-kit';

import { MOD_INSTALL_STEPS, MOD_PAGE } from '../../../config';
import { useModPage } from '../../../model/hooks';

import s from './ModInstall.module.scss';

export const ModInstall = () => {
  const t = useTranslations('mod');
  const { isSignedIn, bindHref } = useModPage();

  return (
    <section className={s.root}>
      <SectionHeader title={t('install.title')} variant='display' />
      <ol className={s.steps}>
        {MOD_INSTALL_STEPS.map((step, index) => (
          <li key={step} className={s.step}>
            <span className={s.number}>{index + 1}</span>
            <span className={s.body}>
              <span className={s.title}>{t(`install.steps.${step}.title`)}</span>
              <span className={s.text}>{t(`install.steps.${step}.text`)}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className={s.bind}>
        <div className={s.bindCopy}>
          <h3 className={s.bindTitle}>{t('bind.title')}</h3>
          <p className={s.text}>{t('bind.text')}</p>
        </div>
        <Link className={buttonVariants({ variant: 'primary' })} href={bindHref}>
          {isSignedIn ? <KeySquare aria-hidden size={MOD_PAGE.iconSize} /> : <LogIn aria-hidden size={MOD_PAGE.iconSize} />}
          {isSignedIn ? t('bind.signedIn') : t('bind.signIn')}
        </Link>
      </div>
    </section>
  );
};
