import { useTranslations } from 'use-intl';

import { Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import { useAutostartPrompt } from '../model/hooks';

export const AutostartPrompt = () => {
  const t = useTranslations('settings');
  const { isOpen, autostart, isPending, setAutostart, onConfirm } = useAutostartPrompt();

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('autostartPromptTitle')}</DialogTitle>
          <DialogDescription>{t('autostartPromptDescription')}</DialogDescription>
        </DialogHeader>
        <Checkbox checked={autostart} description={t('autostartHint')} label={t('autostart')} onCheckedChange={setAutostart} />
        <DialogFooter>
          <Button isPending={isPending} onClick={onConfirm}>
            {t('autostartPromptConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
