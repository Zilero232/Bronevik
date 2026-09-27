'use client';

import { MonitorCog } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import type { ApplySettingsProps } from './ApplySettings.types';

import { useApplySettingsForm } from '../model/hooks';
import { ApplyRequestResult, ApplySettingsForm } from './components';

export const ApplySettings = ({ slug, settings, className }: ApplySettingsProps) => {
  const t = useTranslations('streamerSettings.apply');
  const { form, loginHref, isSignedIn, isSessionPending, isAvailable, isOpen, isPending, request, groupOptions, options, onOpenChange, onSubmit } =
    useApplySettingsForm({ slug, settings });

  if (!isAvailable) {
    return null;
  }

  if (!isSignedIn && !isSessionPending) {
    return (
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm', className })} href={loginHref} title={t('signIn')}>
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
          <ApplyRequestResult status={request.status} />
        ) : (
          <ApplySettingsForm form={form} groupOptions={groupOptions} isPending={isPending} options={options} onSubmit={onSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
};
