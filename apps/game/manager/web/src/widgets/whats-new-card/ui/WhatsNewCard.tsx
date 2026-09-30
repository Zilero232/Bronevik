import { Sparkles } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { MarkSeenButton } from '@/features/changelog/mark-seen';
import { Button, Card } from '@/ui-kit';

import { useWhatsNewCard } from '../model/hooks';

import s from './WhatsNewCard.module.scss';

export const WhatsNewCard = () => {
  const t = useTranslations('whatsNew');
  const { isVisible, version, notes, changed, onOpen } = useWhatsNewCard();

  if (!isVisible) {
    return null;
  }

  return (
    <Card
      actions={
        <>
          <MarkSeenButton version={version} />
          <Button onClick={onOpen}>
            <Sparkles aria-hidden />
            {t('open')}
          </Button>
        </>
      }
      description={t('cardDescription', { count: changed })}
      title={t('cardTitle', { version })}
      tone='premium'
    >
      {notes && <p className={s.notes}>{notes}</p>}
    </Card>
  );
};
