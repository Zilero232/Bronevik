import { useSettings } from '@/entities/settings';
import { MESSAGES, resolveLocale } from '@/shared/i18n';

export const useAppLocale = () => {
  const { data: settings } = useSettings();
  const locale = resolveLocale({ language: settings?.language ?? 'auto', systemLanguage: navigator.language });

  return { locale, messages: MESSAGES[locale] };
};
