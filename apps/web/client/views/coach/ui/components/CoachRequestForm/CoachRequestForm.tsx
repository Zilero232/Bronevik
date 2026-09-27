'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { CommunityGate } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, Card, CardBody, CardHeader, FormField, Input, Select, Textarea } from '@/ui-kit';

import type { CoachRequestFormProps } from './CoachRequestForm.types';

import { COACH_REQUEST } from '../../../config';
import { useCoachRequestForm } from '../../../model/hooks';

import s from './CoachRequestForm.module.scss';

export const CoachRequestForm = ({ coach }: CoachRequestFormProps) => {
  const t = useTranslations('coaching.request');
  const id = useId();
  const { form, offerItems, isOwn, isAvailable, isPending, onSubmit } = useCoachRequestForm(coach);
  const { errors } = form.formState;

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <CardBody className={s.body}>
        {isOwn && <p className={s.note}>{t('own')}</p>}
        {!isOwn && !isAvailable && <p className={s.note}>{t('unavailable')}</p>}
        {!isOwn && isAvailable && (
          <CommunityGate requiresLesta={false}>
            <form noValidate className={s.form} onSubmit={onSubmit}>
              {offerItems.length > 1 && (
                <Controller
                  control={form.control}
                  name='offerId'
                  render={({ field }) => <Select items={offerItems} label={t('offer')} value={field.value} onValueChange={field.onChange} />}
                />
              )}
              <FormField error={errors.studentContact && t('contactError')} hint={t('contactHint')} htmlFor={`${id}-contact`} label={t('contact')}>
                <Input
                  id={`${id}-contact`}
                  isInvalid={Boolean(errors.studentContact)}
                  placeholder={t('contactPlaceholder')}
                  {...form.register('studentContact')}
                />
              </FormField>
              <FormField error={errors.notes && t('notesError')} htmlFor={`${id}-notes`} label={t('notes')}>
                <Textarea
                  id={`${id}-notes`}
                  isInvalid={Boolean(errors.notes)}
                  placeholder={t('notesPlaceholder')}
                  rows={COACH_REQUEST.notesRows}
                  {...form.register('notes')}
                />
              </FormField>
              <FormField error={errors.replayId && t('replayError')} hint={t('replayHint')} htmlFor={`${id}-replay`} label={t('replay')}>
                <Input id={`${id}-replay`} isInvalid={Boolean(errors.replayId)} size='sm' spellCheck={false} {...form.register('replayId')} />
              </FormField>
              <Button disabled={isPending} type='submit'>
                {t('submit')}
              </Button>
              <p className={s.note}>
                {t('free')} <Link href={`${ROUTES.coaching.list}#orders`}>{t('myRequests')}</Link>
              </p>
            </form>
          </CommunityGate>
        )}
      </CardBody>
    </Card>
  );
};
