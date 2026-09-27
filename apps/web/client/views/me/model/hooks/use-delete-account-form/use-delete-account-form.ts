'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuthSession, useDeleteAccount, useLoginHref, useSignOut } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import type { DeleteAccountFormValues } from '../../../lib/delete-account';

import { DELETE_ACCOUNT } from '../../../config';
import { deleteAccountFormSchema } from '../../../lib/delete-account';
import { useDataExport } from '../use-data-export';

export const useDeleteAccountForm = () => {
  const t = useTranslations('me.deleteAccount');
  const router = useRouter();
  const loginHref = useLoginHref();
  const { data: session } = useAuthSession();
  const remove = useDeleteAccount();
  const signOut = useSignOut();
  const { pendingKind, onExport } = useDataExport();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountFormSchema(session?.user.name ?? '')),
    defaultValues: DELETE_ACCOUNT.defaultValues,
    mode: 'onChange'
  });

  const onOpenChange = (open: boolean) => {
    setOpen(open);

    if (!open) {
      form.reset();
      remove.reset();
    }
  };

  const onConfirm = () => {
    void form.handleSubmit(() =>
      remove.mutate(undefined, {
        onSuccess: (outcome) => {
          if (outcome !== 'deleted') {
            return;
          }

          setOpen(false);
          toast.success(t('deleted'));
          router.replace(ROUTES.home);
        },
        onError: () => toast.error(t('failed'))
      })
    )();
  };

  return {
    form,
    nickname: session?.user.name ?? '',
    isOpen,
    isPending: remove.isPending,
    isConfirmDisabled: !form.formState.isValid,
    isReauthRequired: remove.data === 'reauthenticate',
    isReauthenticating: signOut.isPending,
    isExporting: pendingKind === DELETE_ACCOUNT.exportKind,
    onOpenChange,
    onConfirm,
    onExport: () => onExport(DELETE_ACCOUNT.exportKind),
    onReauthenticate: () => signOut.mutate(undefined, { onSuccess: () => router.push(loginHref) })
  };
};
