'use client';

import { Info, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Burst,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Popover,
  RatingBadge,
  Tooltip
} from '@/ui-kit';

import { DesignBlock, DesignRow } from '../DesignBlock';

export const OverlaysSection = () => {
  const t = useTranslations('design.overlays');
  const [burst, setBurst] = useState(0);

  return (
    <DesignBlock eyebrow='05' id='overlays' title={t('title')}>
      <DesignRow label={t('tooltip')}>
        <Tooltip content={t('tooltipBody')}>
          <IconButton aria-label={t('tooltip')} variant='outline'>
            <Info size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip content={t('wn8Hint')} side='right'>
          <RatingBadge label='WN8' tone='unicum' value='3 412' />
        </Tooltip>
      </DesignRow>
      <DesignRow label={t('popover')}>
        <Popover description={t('popoverBody')} title={t('popoverTitle')} trigger={<Button variant='secondary'>{t('openPopover')}</Button>} />
      </DesignRow>
      <DesignRow label={t('dialog')}>
        <Dialog>
          <DialogTrigger render={<Button variant='secondary'>{t('openDialog')}</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('dialogTitle')}</DialogTitle>
              <DialogDescription>{t('dialogBody')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant='ghost'>{t('cancel')}</Button>} />
              <DialogClose render={<Button>{t('confirm')}</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DesignRow>
      <DesignRow label={t('toasts')}>
        <Button size='sm' variant='secondary' onClick={() => toast.success(t('toastSuccess'), { description: t('toastSuccessBody') })}>
          {t('toastKinds.success')}
        </Button>
        <Button size='sm' variant='secondary' onClick={() => toast.error(t('toastError'), { description: t('toastErrorBody') })}>
          {t('toastKinds.error')}
        </Button>
        <Button size='sm' variant='secondary' onClick={() => toast.warning(t('toastWarning'))}>
          {t('toastKinds.warning')}
        </Button>
        <Button size='sm' variant='secondary' onClick={() => toast(t('toastInfo'))}>
          {t('toastKinds.info')}
        </Button>
      </DesignRow>
      <DesignRow label={t('burst')}>
        <Burst trigger={burst}>
          <Button onClick={() => setBurst((current) => current + 1)}>
            <Sparkles size={16} />
            {t('celebrate')}
          </Button>
        </Burst>
      </DesignRow>
    </DesignBlock>
  );
};
