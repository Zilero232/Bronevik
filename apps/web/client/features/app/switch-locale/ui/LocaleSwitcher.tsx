'use client';

import { useTranslations } from 'next-intl';

import { useLocale } from '@/entities/app/locale';
import { LOCALE_LABELS, LOCALES } from '@/shared/i18n';
import { SegmentedControl } from '@/ui-kit';

import type { LocaleSwitcherProps } from './LocaleSwitcher.types';

export const LocaleSwitcher = ({ className }: LocaleSwitcherProps) => {
  const t = useTranslations('common');
  const { locale, setLocale } = useLocale();

  return (
    <SegmentedControl
      aria-label={t('language')}
      className={className}
      options={LOCALES.map((option) => ({ value: option, label: option, 'aria-label': LOCALE_LABELS[option] }))}
      size='sm'
      value={locale}
      onChange={setLocale}
    />
  );
};
