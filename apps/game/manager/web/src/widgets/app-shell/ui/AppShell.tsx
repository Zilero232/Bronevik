import { OtmetkiLogoIcon } from '@otmetki/icons';
import { useTranslations } from 'use-intl';

import type { AppShellProps } from './AppShell.types';

import { useAppShell } from '../model/hooks';

import s from './AppShell.module.scss';

export const AppShell = ({ children }: AppShellProps) => {
  const t = useTranslations();
  const { items, clientVersion, statusKind } = useAppShell();

  return (
    <div className={s.root}>
      <aside className={s.sidebar}>
        <div className={s.brand}>
          <OtmetkiLogoIcon aria-hidden className={s.logo} size={30} />
          <div className={s.brandText}>
            <span className={s.name}>{t('common.appName')}</span>
            <span className={s.subtitle}>{t('common.appSubtitle')}</span>
          </div>
        </div>
        <nav aria-label={t('nav.label')} className={s.nav}>
          {items.map(({ id, label, icon: Icon, isActive, onSelect }) => (
            <button key={id} aria-current={isActive ? 'page' : undefined} className={s.navItem} type='button' onClick={onSelect}>
              <Icon aria-hidden />
              {label}
            </button>
          ))}
        </nav>
        {clientVersion && (
          <div className={s.status} data-kind={statusKind ?? undefined}>
            <span className={s.statusDot} />
            {t('client.version', { version: clientVersion })}
          </div>
        )}
      </aside>
      <main className={s.main}>
        <div className={s.content}>{children}</div>
      </main>
    </div>
  );
};
