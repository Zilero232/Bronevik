'use client';

import { MonitorCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import {
  Badge,
  Button,
  buttonVariants,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Switch,
  ToggleChips
} from '@/ui-kit';

import type { ApplySettingsProps } from './ApplySettings.types';

import { useApplySettingsForm } from '../model/hooks';

import s from './ApplySettings.module.scss';

export const ApplySettings = ({ slug, settings, className }: ApplySettingsProps) => {
  const t = useTranslations('streamerSettings.apply');
  const { form, isSignedIn, isSessionPending, isAvailable, isOpen, isPending, request, groupOptions, options, onOpenChange, onSubmit } =
    useApplySettingsForm({ slug, settings });

  if (!isAvailable) {
    return null;
  }

  if (!isSignedIn && !isSessionPending) {
    return (
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className })} href={ROUTES.auth.login} title={t('signIn')}>
        <MonitorCog size={15} />
        {t('trigger')}
      </Link>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: 'secondary', size: 'sm', className })} disabled={isSessionPending}>
        <MonitorCog size={15} />
        {t('trigger')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {request ? (
          <div className={s.result}>
            <Badge tone={request.status === 'pending' ? 'accent' : 'neutral'}>{t(`status.${request.status}`)}</Badge>
            <p className={s.hint}>{t('sent')}</p>
            <DialogFooter>
              <DialogClose className={buttonVariants({ size: 'sm' })}>{t('done')}</DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <form noValidate className={s.root} onSubmit={onSubmit}>
            <Controller
              render={({ field }) => (
                <div className={s.field}>
                  <span className={s.label}>{t('groups')}</span>
                  <ToggleChips aria-label={t('groups')} options={groupOptions} size='sm' value={field.value} onChange={field.onChange} />
                  {form.formState.errors.groups && <span className={s.error}>{t('groupsError')}</span>}
                </div>
              )}
              control={form.control}
              name='groups'
            />
            {options.hasResolution && (
              <Controller
                render={({ field }) => (
                  <Switch checked={field.value} description={t('resolutionHint')} label={t('includeResolution')} onCheckedChange={field.onChange} />
                )}
                control={form.control}
                name='includeResolution'
              />
            )}
            {options.hasSensitivity && (
              <Controller
                render={({ field }) => (
                  <Switch checked={field.value} description={t('sensitivityHint')} label={t('includeSensitivity')} onCheckedChange={field.onChange} />
                )}
                control={form.control}
                name='includeSensitivity'
              />
            )}
            <ul className={s.notes}>
              <li>{t('notes.hangar')}</li>
              <li>{t('notes.backup')}</li>
              <li>{t('notes.restore')}</li>
            </ul>
            <DialogFooter>
              <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
              <Button disabled={isPending} size='sm' type='submit'>
                {t('submit')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
