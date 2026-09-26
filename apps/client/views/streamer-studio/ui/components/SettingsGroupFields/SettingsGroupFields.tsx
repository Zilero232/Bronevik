'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import type { SettingsGroupFieldsProps } from './SettingsGroupFields.types';

import { SETTINGS_DATE } from '../../../config';
import { fieldsOfGroup } from '../../../lib/settings-form';
import { SettingsChoiceField, SettingsMultiField, SettingsNumberField, SettingsTextField } from './components';

import s from './SettingsGroupFields.module.scss';

export const SettingsGroupFields = ({ group, provenance }: SettingsGroupFieldsProps) => {
  const t = useTranslations('streamerSettings');
  const format = useFormatter();

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t(`groups.${group}`)}</legend>
      {provenance && (
        <p className={s.meta}>
          {t(`sources.${provenance.source}`)} · {t('common.checkedAt', { date: format.dateTime(new Date(provenance.checkedAt), SETTINGS_DATE) })}
        </p>
      )}
      <div className={s.grid}>
        {fieldsOfGroup(group).map((field) =>
          match(field)
            .with({ kind: 'text' }, (text) => <SettingsTextField key={text.path} field={text} />)
            .with({ kind: 'number' }, (number) => <SettingsNumberField key={number.path} field={number} />)
            .with({ kind: 'multi' }, (multi) => <SettingsMultiField key={multi.path} field={multi} />)
            .with({ kind: 'enum' }, { kind: 'boolean' }, (choice) => <SettingsChoiceField key={choice.path} field={choice} />)
            .exhaustive()
        )}
      </div>
    </fieldset>
  );
};
