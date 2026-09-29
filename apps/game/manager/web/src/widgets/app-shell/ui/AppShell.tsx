import { OtmetkiLogoIcon } from '@otmetki/icons';
import { useTranslations } from 'use-intl';

import { AutostartPrompt } from '@/features/settings/autostart-prompt';

import type { AppShellProps } from './AppShell.types';

import { useAppShell } from '../model/hooks';

import s from './AppShell.module.scss';

export const AppShell = ({ children }: AppShellProps) => {
  const t = useTranslations();
  const { groups, gameVersion, modpackVersion, tone } = useAppShell();

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
          {groups.map((group) => (
            <div key={group.id} aria-label={group.label} className={s.group} role='group'>
              <span aria-hidden className={s.groupLabel}>
                {group.label}
              </span>
              {group.items.map(({ id, label, icon: Icon, isActive, marker, onSelect }) => (
                <button key={id} aria-current={isActive ? 'page' : undefined} className={s.navItem} title={label} type='button' onClick={onSelect}>
                  <Icon aria-hidden />
                  <span className={s.navLabel}>{label}</span>
                  {marker && (
                    <span className={s.marker} data-marker={marker}>
                      <span className={s.srOnly}>{t(`nav.marker.${marker}`)}</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className={s.status} data-tone={tone}>
          <span aria-hidden className={s.statusDot} />
          <span className={s.statusText}>
            <span>{gameVersion ? t('nav.status.game', { version: gameVersion }) : t('nav.status.noGame')}</span>
            {gameVersion && <span>{modpackVersion ? t('nav.status.modpack', { version: modpackVersion }) : t('nav.status.notInstalled')}</span>}
          </span>
        </div>
      </aside>
      <main className={s.main}>
        <div className={s.content}>{children}</div>
      </main>
      <AutostartPrompt />
    </div>
  );
};
