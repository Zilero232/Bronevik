'use client';

import { buttonVariants, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import type { BoardSettingsDialogProps } from './BoardSettingsDialog.types';

import { BoardSettingsForm } from '../BoardSettingsForm';

export const BoardSettingsDialog = ({
  trigger,
  triggerVariant,
  title,
  description,
  isOpen,
  onOpenChange,
  defaultValues,
  submitLabel,
  onSubmit
}: BoardSettingsDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogTrigger className={buttonVariants({ size: 'sm', variant: triggerVariant })}>{trigger}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {isOpen && <BoardSettingsForm defaultValues={defaultValues} submitLabel={submitLabel} onSubmit={onSubmit} />}
    </DialogContent>
  </Dialog>
);
