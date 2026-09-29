'use client';

import { NumberField } from '@base-ui/react/number-field';
import { Popover } from '@base-ui/react/popover';
import { clsx } from 'clsx';
import { CalendarClock, Minus, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DayPicker } from 'react-day-picker';

import { TIME_ZONE } from '@/shared/i18n';
import { useDateTimeField, useFormControl } from '@/shared/lib';

import type { DateTimeFieldProps } from './DateTimeField.types';

import { Button } from '../../atoms';
import { DATE_TIME_FIELD_VIEW } from './DateTimeField.constants';

import s from './DateTimeField.module.scss';

export const DateTimeField = ({
  value,
  placeholder,
  stepMinutes = DATE_TIME_FIELD_VIEW.stepMinutes,
  isInvalid = false,
  className,
  'aria-label': ariaLabel,
  onChange
}: DateTimeFieldProps) => {
  const t = useTranslations('common.dateTime');
  const control = useFormControl();
  const {
    isOpen,
    selectedDay,
    hours,
    minutes,
    display,
    dayLocale,
    onOpenChange,
    onDaySelect,
    onHoursChange,
    onMinutesChange,
    onNow,
    onClear,
    onDone
  } = useDateTimeField({ value, stepMinutes, onChange });

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <div className={clsx(s.root, className)} data-invalid={isInvalid || control['aria-invalid'] || undefined}>
        <Popover.Trigger
          aria-describedby={control['aria-describedby']}
          aria-label={ariaLabel}
          className={s.trigger}
          data-empty={!display || undefined}
          id={control.id}
        >
          <CalendarClock aria-hidden className={s.icon} size={DATE_TIME_FIELD_VIEW.iconSize} />
          <span className={s.value}>{display ?? placeholder ?? t('placeholder')}</span>
          <span className={s.zone} title={t('zoneHint')}>
            {t('zone')}
          </span>
        </Popover.Trigger>
        {display && (
          <button aria-label={t('clear')} className={s.clear} type='button' onClick={onClear}>
            <X size={14} />
          </button>
        )}
      </div>
      <Popover.Portal>
        <Popover.Positioner align='start' className={s.positioner} sideOffset={6}>
          <Popover.Popup className={s.popup}>
            <DayPicker
              fixedWeeks
              showOutsideDays
              classNames={{
                root: s.calendar,
                months: s.months,
                month: s.month,
                month_caption: s.caption,
                caption_label: s.captionLabel,
                nav: s.nav,
                button_previous: s.navButton,
                button_next: s.navButton,
                chevron: s.chevron,
                month_grid: s.grid,
                weekdays: s.weekdays,
                weekday: s.weekday,
                week: s.week,
                day: s.day,
                day_button: s.dayButton,
                today: s.today,
                selected: s.selected,
                outside: s.outside,
                disabled: s.disabled
              }}
              defaultMonth={selectedDay}
              labels={{ labelNext: () => t('nextMonth'), labelPrevious: () => t('previousMonth') }}
              locale={dayLocale}
              mode='single'
              selected={selectedDay}
              timeZone={TIME_ZONE}
              weekStartsOn={1}
              onSelect={onDaySelect}
            />
            <div className={s.time}>
              <span className={s.timeLabel}>{t('time')}</span>
              <NumberField.Root
                className={s.spin}
                format={DATE_TIME_FIELD_VIEW.twoDigits}
                max={DATE_TIME_FIELD_VIEW.hours.max}
                min={DATE_TIME_FIELD_VIEW.hours.min}
                value={hours}
                onValueChange={onHoursChange}
              >
                <NumberField.Decrement aria-label={t('hoursDown')} className={s.step}>
                  <Minus size={12} />
                </NumberField.Decrement>
                <NumberField.Input aria-label={t('hours')} className={s.spinInput} placeholder='--' />
                <NumberField.Increment aria-label={t('hoursUp')} className={s.step}>
                  <Plus size={12} />
                </NumberField.Increment>
              </NumberField.Root>
              <span aria-hidden className={s.colon}>
                :
              </span>
              <NumberField.Root
                className={s.spin}
                format={DATE_TIME_FIELD_VIEW.twoDigits}
                max={DATE_TIME_FIELD_VIEW.minutes.max}
                min={DATE_TIME_FIELD_VIEW.minutes.min}
                step={stepMinutes}
                value={minutes}
                onValueChange={onMinutesChange}
              >
                <NumberField.Decrement aria-label={t('minutesDown')} className={s.step}>
                  <Minus size={12} />
                </NumberField.Decrement>
                <NumberField.Input aria-label={t('minutes')} className={s.spinInput} placeholder='--' />
                <NumberField.Increment aria-label={t('minutesUp')} className={s.step}>
                  <Plus size={12} />
                </NumberField.Increment>
              </NumberField.Root>
            </div>
            <p className={s.zoneNote}>{t('zoneHint')}</p>
            <div className={s.actions}>
              <Button size='sm' variant='ghost' onClick={onNow}>
                {t('now')}
              </Button>
              {display && (
                <Button size='sm' variant='ghost' onClick={onClear}>
                  {t('clear')}
                </Button>
              )}
              <Button className={s.done} size='sm' variant='secondary' onClick={onDone}>
                {t('done')}
              </Button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
