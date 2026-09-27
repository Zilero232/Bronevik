'use client';

import { useTranslations } from 'next-intl';

import { EVENT_KINDS, REMIND_OPTIONS } from '../../../config';

export const useEventFormOptions = () => {
  const t = useTranslations('clanWorkspace');

  return {
    kinds: EVENT_KINDS.map((kind) => ({ value: kind, label: t(`kinds.${kind}`) })),
    reminders: REMIND_OPTIONS.map((minutes) => ({ value: minutes, label: t('form.remindOption', { minutes: Number(minutes) }) }))
  };
};
