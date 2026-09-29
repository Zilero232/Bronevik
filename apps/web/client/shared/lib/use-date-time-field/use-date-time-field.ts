'use client';

import { useFormatter, useLocale } from 'next-intl';
import { useState } from 'react';

import { resolveLocale } from '@/shared/i18n';

import type { ZonedInputParts } from '../zoned-time';
import type { UseDateTimeFieldInput } from './use-date-time-field.types';

import { composeZonedInput, roundedZonedInput, zonedInputParts, zonedInputToIso } from '../zoned-time';
import { DATE_TIME_FIELD } from './use-date-time-field.constants';

export const useDateTimeField = ({ value, stepMinutes, onChange }: UseDateTimeFieldInput) => {
  const format = useFormatter();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const parts = zonedInputParts({ value });
  const iso = zonedInputToIso({ value });

  const draftParts = (): ZonedInputParts =>
    parts ?? zonedInputParts({ value: roundedZonedInput({ now: Date.now(), stepMinutes }) }) ?? { day: new Date(), hours: 0, minutes: 0 };

  const commit = (patch: Partial<ZonedInputParts>) => onChange(composeZonedInput({ ...draftParts(), ...patch }));

  return {
    isOpen,
    selectedDay: parts?.day,
    hours: parts?.hours ?? null,
    minutes: parts?.minutes ?? null,
    display: iso ? format.dateTime(new Date(iso), DATE_TIME_FIELD.display) : null,
    dayLocale: DATE_TIME_FIELD.locales[resolveLocale(locale)],
    onOpenChange: setIsOpen,
    onDaySelect: (day: Date | undefined) => {
      if (day) {
        commit({ day });
      }
    },
    onHoursChange: (hours: number | null) => commit({ hours: hours ?? 0 }),
    onMinutesChange: (minutes: number | null) => commit({ minutes: minutes ?? 0 }),
    onNow: () => onChange(roundedZonedInput({ now: Date.now(), stepMinutes })),
    onClear: () => {
      onChange('');
      setIsOpen(false);
    },
    onDone: () => setIsOpen(false)
  };
};
