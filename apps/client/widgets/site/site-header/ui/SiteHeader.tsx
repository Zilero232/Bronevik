'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { InboxBell } from '@/features/notifications/inbox-bell';
import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { IconButton } from '@/ui-kit';

import { useIsScrolled } from '../model/hooks';
import { DisplaySettings, MobileNav, SiteBrand, SiteNav } from './components';

import s from './SiteHeader.module.scss';

export const SiteHeader = () => {
  const t = useTranslations('nav');
  const isScrolled = useIsScrolled();

  const [isMenuOpen, toggleMenu] = useBoolean(false);

  return (
    <header className={s.root} data-scrolled={isScrolled}>
      <div className={s.inner}>
        <SiteBrand />
        <Suspense fallback={<span className={s.nav} />}>
          <SiteNav className={s.nav} />
        </Suspense>
        <div className={s.actions}>
          <CommandPaletteTrigger className={s.searchBar} />
          <CommandPaletteTrigger className={s.searchIcon} variant='icon' />
          <Suspense>
            <LocaleSwitcher className={s.wideOnly} />
          </Suspense>
          <InboxBell />
          <ThemeToggle />
          <DisplaySettings className={s.wideOnly} />
          <IconButton aria-label={t('menu')} className={s.burger} onClick={() => toggleMenu(true)}>
            <Menu size={20} />
          </IconButton>
        </div>
      </div>
      <span aria-hidden className={s.tracer} />
      <Suspense>
        <MobileNav open={isMenuOpen} onOpenChange={toggleMenu} />
      </Suspense>
    </header>
  );
};
