'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { ThemeToggle } from '@/features/app/switch-theme';
import { InboxBell } from '@/features/notifications/inbox-bell';
import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { IconButton } from '@/ui-kit';

import { DisplaySettings, GameStatusSlot, MobileNav, SiteBrand, SiteNav } from './components';

import s from './SiteHeader.module.scss';

export const SiteHeader = () => {
  const t = useTranslations('nav');
  const [isMenuOpen, toggleMenu] = useBoolean(false);

  return (
    <header className={s.root}>
      <div className={s.inner}>
        <SiteBrand />
        <Suspense fallback={<span className={s.nav} />}>
          <SiteNav className={s.nav} />
        </Suspense>
        <div className={s.actions}>
          <CommandPaletteTrigger className={s.searchBar} />
          <CommandPaletteTrigger className={s.searchIcon} variant='icon' />
          <GameStatusSlot className={s.wideOnly} />
          <InboxBell />
          <ThemeToggle />
          <DisplaySettings className={s.wideOnly} />
          <IconButton aria-label={t('menu')} className={s.burger} onClick={() => toggleMenu(true)}>
            <Menu size={18} />
          </IconButton>
        </div>
      </div>
      <Suspense>
        <MobileNav open={isMenuOpen} onOpenChange={toggleMenu} />
      </Suspense>
    </header>
  );
};
