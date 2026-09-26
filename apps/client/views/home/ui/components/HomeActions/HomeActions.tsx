import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import { HOME_ACTIONS, HOME_CTA, HOME_ICON } from '../../../config';

import s from './HomeActions.module.scss';

export const HomeActions = () => {
  const t = useTranslations('home.actions');

  return (
    <nav aria-label={t('label')} className={s.root}>
      <div className={s.inner}>
        <ul className={s.links}>
          {HOME_ACTIONS.map(({ key, href, icon: Icon }) => (
            <li key={key}>
              <Link className={s.link} href={href}>
                <span className={s.icon}>
                  <Icon aria-hidden size={HOME_ICON.action} />
                </span>
                <span className={s.text}>{t(key)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className={s.cta} href={HOME_CTA.href}>
          <HOME_CTA.icon aria-hidden size={HOME_ICON.cta} />
          {t('cta')}
        </Link>
      </div>
    </nav>
  );
};
