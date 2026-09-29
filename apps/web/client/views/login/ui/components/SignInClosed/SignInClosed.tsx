'use client';

import { ArrowRight, Hourglass } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import { LOGIN_CLOSED_ACTIONS, LOGIN_SECTIONS } from '../../../config';
import { useSignInAvailability } from '../../../model/hooks';

import s from './SignInClosed.module.scss';

export const SignInClosed = () => {
  const t = useTranslations('auth.closed');
  const tNav = useTranslations('nav');
  const { isClosed } = useSignInAvailability();

  if (!isClosed) {
    return null;
  }

  return (
    <section aria-labelledby={LOGIN_SECTIONS.closed} className={s.root}>
      <div className={s.head}>
        <span aria-hidden className={s.icon}>
          <Hourglass size={18} />
        </span>
        <h2 className={s.title} id={LOGIN_SECTIONS.closed}>
          {t('title')}
        </h2>
      </div>
      <p className={s.text}>{t('text')}</p>
      <p className={s.label}>{t('meanwhile')}</p>
      <ul className={s.actions}>
        {LOGIN_CLOSED_ACTIONS.map(({ key, href, icon: Icon }) => (
          <li key={key}>
            <Link className={s.action} href={href}>
              <Icon aria-hidden className={s.actionIcon} size={18} />
              <span className={s.actionBody}>
                <span className={s.actionTitle}>{tNav(`items.${key}`)}</span>
                <span className={s.actionHint}>{tNav(`hints.${key}`)}</span>
              </span>
              <ArrowRight aria-hidden className={s.actionArrow} size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
