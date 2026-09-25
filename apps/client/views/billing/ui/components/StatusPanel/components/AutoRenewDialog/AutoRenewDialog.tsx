'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import type { AutoRenewDialogProps } from './AutoRenewDialog.types';

import { useAutoRenew } from '../../../../../model/hooks';

export const AutoRenewDialog = ({ isEnabled }: AutoRenewDialogProps) => {
  const t = useTranslations('billing.autoRenew');
  const autoRenew = useAutoRenew();
  const [isOpen, toggleOpen] = useBoolean(false);

  const mode = isEnabled ? 'cancel' : 'resume';

  const onConfirm = () => autoRenew.mutate(!isEnabled, { onSuccess: () => toggleOpen(false) });

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger render={<Button variant={isEnabled ? 'ghost' : 'secondary'}>{t(`${mode}.trigger`)}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`${mode}.title`)}</DialogTitle>
          <DialogDescription>{t(`${mode}.description`)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant='ghost'>{t('dismiss')}</Button>} />
          <Button disabled={autoRenew.isPending} variant={isEnabled ? 'danger' : 'primary'} onClick={onConfirm}>
            {t(`${mode}.confirm`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
