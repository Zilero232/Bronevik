import { FileUp, FolderDown, Import } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, FormField, TextInput } from '@/ui-kit';

import { useImportSetForm } from '../model/hooks';

import s from './ImportSetForm.module.scss';

export const ImportSetForm = () => {
  const t = useTranslations('sets');
  const { register, errors, isPending, isFilePending, isExportPending, onSubmit, onImportFile, onExportAll } = useImportSetForm();

  return (
    <div className={s.root}>
      <form className={s.form} onSubmit={onSubmit}>
        <FormField error={errors.code} label={t('code')}>
          {(control) => <TextInput {...control} {...register('code')} autoComplete='off' placeholder={t('codePlaceholder')} spellCheck={false} />}
        </FormField>
        <FormField error={errors.name} label={t('importName')}>
          {(control) => <TextInput {...control} {...register('name')} autoComplete='off' />}
        </FormField>
        <Button isPending={isPending} type='submit' variant='secondary'>
          <Import aria-hidden />
          {t('import')}
        </Button>
      </form>
      <div className={s.files}>
        <Button isPending={isFilePending} variant='ghost' onClick={onImportFile}>
          <FileUp aria-hidden />
          {t('importFile')}
        </Button>
        <Button isPending={isExportPending} variant='ghost' onClick={onExportAll}>
          <FolderDown aria-hidden />
          {t('exportAll')}
        </Button>
      </div>
    </div>
  );
};
