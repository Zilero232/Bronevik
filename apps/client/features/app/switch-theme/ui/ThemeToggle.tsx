'use client';

import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useHydrated } from '@/shared/lib';
import { IconButton } from '@/ui-kit';

import { THEME_ICON_MOTION } from './ThemeToggle.motion';

export const ThemeToggle = () => {
  const t = useTranslations('common');
  const { resolvedTheme, setTheme } = useTheme();
  const isHydrated = useHydrated();

  const isLight = isHydrated && resolvedTheme === 'light';

  return (
    <IconButton aria-label={isLight ? t('themeDark') : t('themeLight')} onClick={() => setTheme(isLight ? 'dark' : 'light')}>
      <AnimatePresence initial={false} mode='wait'>
        <motion.span key={isLight ? 'light' : 'dark'} {...THEME_ICON_MOTION} style={{ display: 'inline-flex' }}>
          {isLight ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
};
