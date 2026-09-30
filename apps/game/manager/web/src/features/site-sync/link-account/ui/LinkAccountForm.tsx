import { Link2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { LINKS } from '@/shared/config';
import { Button, ExternalLink, FormField, TextInput } from '@/ui-kit';

import { useLinkAccountForm } from '../model/hooks';

import s from './LinkAccountForm.module.scss';

export const LinkAccountForm = () => {
  const t = useTranslations('sync');
  const { register, error, isPending, onSubmit } = useLinkAccountForm();

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <p className={s.hint}>
        {t('linkHint')} <ExternalLink href={LINKS.bindPage}>{t('linkSite')}</ExternalLink>
      </p>
      <div className={s.row}>
        <FormField error={error} label={t('code')}>
          {(control) => <TextInput {...control} {...register('code')} autoComplete='off' placeholder={t('codePlaceholder')} spellCheck={false} />}
        </FormField>
        <Button isPending={isPending} type='submit' variant='secondary'>
          <Link2 aria-hidden />
          {t('link')}
        </Button>
      </div>
    </form>
  );
};
