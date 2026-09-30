import { Check } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/ui-kit';

import type { MarkSeenButtonProps } from './MarkSeenButton.types';

import { useMarkSeen } from '../model/hooks';

export const MarkSeenButton = ({ version }: MarkSeenButtonProps) => {
  const t = useTranslations('whatsNew');
  const { isPending, onMark } = useMarkSeen(version);

  return (
    <Button isPending={isPending} variant='ghost' onClick={onMark}>
      {!isPending && <Check aria-hidden />}
      {t('dismiss')}
    </Button>
  );
};
