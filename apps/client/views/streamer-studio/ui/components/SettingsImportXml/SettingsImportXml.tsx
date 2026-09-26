'use client';

import { FileCode2, Lock, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { PREFERENCES_FILE } from '@/entities/streamer/preferences';
import { isKnownField } from '@/entities/streamer/settings';
import { Button, buttonVariants } from '@/ui-kit';

import type { SettingsImportXmlProps } from './SettingsImportXml.types';

import { fieldLabelKey } from '../../../lib/settings-form';
import { useSettingsImportXml } from '../../../model/hooks';

import s from './SettingsImportXml.module.scss';

export const SettingsImportXml = ({ onImport }: SettingsImportXmlProps) => {
  const t = useTranslations('streamer.settings.xml');
  const tf = useTranslations('streamerSettings');
  const id = useId();
  const { status, found, onFileChange, onApply } = useSettingsImportXml({ onImport });

  return (
    <section className={s.root}>
      <h3 className={s.title}>
        <FileCode2 size={16} />
        {t('title')}
      </h3>
      <p className={s.text}>{t('description')}</p>
      <code className={s.path}>{PREFERENCES_FILE.path}</code>
      <p className={s.privacy}>
        <Lock size={13} />
        {t('privacy')}
      </p>
      <div className={s.actions}>
        <label className={buttonVariants({ variant: 'secondary', size: 'sm' })} htmlFor={id}>
          <Upload size={14} />
          {t('pick')}
        </label>
        <input accept={PREFERENCES_FILE.accept} className={s.input} id={id} type='file' onChange={onFileChange} />
      </div>
      {status === 'invalid' && (
        <p className={s.error} role='alert'>
          {t('invalid')}
        </p>
      )}
      {status === 'empty' && <p className={s.text}>{t('empty')}</p>}
      {status === 'ready' && (
        <div className={s.result}>
          <p className={s.text}>{t('found', { count: found.length })}</p>
          <ul className={s.found}>
            {found.map((path) => (
              <li key={path} className={s.chip}>
                {isKnownField(path) ? tf(fieldLabelKey(path)) : path}
              </li>
            ))}
          </ul>
          <Button size='sm' type='button' onClick={onApply}>
            {t('apply')}
          </Button>
        </div>
      )}
    </section>
  );
};
