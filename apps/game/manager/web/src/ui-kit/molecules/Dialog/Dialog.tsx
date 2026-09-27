import type { ComponentProps } from 'react';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import s from './Dialog.module.scss';

export const Dialog = BaseDialog.Root;

export const DialogTrigger = BaseDialog.Trigger;

export const DialogClose = BaseDialog.Close;

export const DialogContent = ({ className, children, ...props }: ComponentProps<typeof BaseDialog.Popup>) => {
  const t = useTranslations('common');

  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={s.overlay} />
      <BaseDialog.Popup className={clsx(s.content, className)} {...props}>
        {children}
        <BaseDialog.Close aria-label={t('close')} className={s.close}>
          <X size={16} />
        </BaseDialog.Close>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
};

export const DialogHeader = ({ className, ...props }: ComponentProps<'div'>) => <div className={clsx(s.header, className)} {...props} />;

export const DialogTitle = ({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) => (
  <BaseDialog.Title className={clsx(s.title, className)} {...props} />
);

export const DialogDescription = ({ className, ...props }: ComponentProps<typeof BaseDialog.Description>) => (
  <BaseDialog.Description className={clsx(s.description, className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => <div className={clsx(s.footer, className)} {...props} />;
