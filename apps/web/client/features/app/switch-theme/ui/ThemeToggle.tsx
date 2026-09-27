'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import { useThemeToggle } from '../model/hooks';

export const ThemeToggle = () => {
  const t = useTranslations('common');
  const { isLight, toggle } = useThemeToggle();

  return (
    <IconButton aria-label={isLight ? t('themeDark') : t('themeLight')} onClick={toggle}>
      {isLight ? <Sun size={16} /> : <Moon size={16} />}
    </IconButton>
  );
};
