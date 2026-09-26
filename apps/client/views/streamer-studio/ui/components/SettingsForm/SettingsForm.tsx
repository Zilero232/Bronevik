'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { SettingsFormProps } from './SettingsForm.types';

import { SETTINGS_DATE } from '../../../config';
import { useStreamerSettingsForm } from '../../../model/hooks';
import { SettingsGroupFields } from '../SettingsGroupFields';
import { SettingsImportMod } from '../SettingsImportMod';
import { SettingsImportXml } from '../SettingsImportXml';

import s from './SettingsForm.module.scss';

export const SettingsForm = ({ view }: SettingsFormProps) => {
  const t = useTranslations('streamer.settings');
  const format = useFormatter();
  const { form, isPending, isDirty, isImported, onSubmit, onImport } = useStreamerSettingsForm(view);

  return (
    <FormProvider {...form}>
      <form noValidate className={s.root} onSubmit={onSubmit}>
        <div className={s.head}>
          <p className={s.note}>{t('description')}</p>
          <span className={s.updated}>
            {view.updatedAt ? t('updated', { date: format.dateTime(new Date(view.updatedAt), SETTINGS_DATE) }) : t('neverUpdated')}
          </span>
        </div>
        <p className={s.apply}>
          <ShieldCheck size={15} />
          {t('applyNote')}
        </p>
        <div className={s.imports}>
          <SettingsImportMod />
          <SettingsImportXml onImport={onImport} />
        </div>
        {isImported && (
          <p className={s.imported} role='status'>
            {t('importedNote')}
          </p>
        )}
        <div className={s.groups}>
          {STREAMER_SETTINGS.groups.map((group) => (
            <SettingsGroupFields key={group} group={group} provenance={view.settings[group] ?? null} />
          ))}
        </div>
        <footer className={s.footer}>
          <Button disabled={isPending || !isDirty} type='submit'>
            {t('save')}
          </Button>
          {view.updatedAt && (
            <Link className={buttonVariants({ variant: 'ghost' })} href={ROUTES.streamers.settings.profile(view.slug)}>
              <ExternalLink size={14} />
              {t('publicLink')}
            </Link>
          )}
        </footer>
      </form>
    </FormProvider>
  );
};
