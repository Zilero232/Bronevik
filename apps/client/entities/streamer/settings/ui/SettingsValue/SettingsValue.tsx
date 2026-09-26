'use client';

import { clsx } from 'clsx';

import type { SettingsValueProps } from './SettingsValue.types';

import { SETTINGS_FORMAT } from '../../config';
import { useSettingsFormatter } from '../../model/hooks';

import s from './SettingsValue.module.scss';

export const SettingsValue = ({ row, className }: SettingsValueProps) => {
  const { valueParts } = useSettingsFormatter();
  const { items, isList } = valueParts(row);

  if (!isList) {
    return <span className={clsx(s.text, className)}>{items.join(SETTINGS_FORMAT.listSeparator)}</span>;
  }

  return (
    <span className={clsx(s.chips, className)}>
      {items.map((item) => (
        <span key={item} className={s.chip}>
          {item}
        </span>
      ))}
    </span>
  );
};
