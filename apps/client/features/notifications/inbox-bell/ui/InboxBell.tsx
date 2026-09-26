'use client';

import { Popover } from '@base-ui/react/popover';
import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import type { InboxBellProps } from './InboxBell.types';

import { useInboxPreview } from '../model/hooks';
import { BellGlyph, InboxPanel } from './components';

import s from './InboxBell.module.scss';

export const InboxBell = ({ className }: InboxBellProps) => {
  const t = useTranslations('inbox');
  const { isSignedIn, page, isPending, isError, isRetrying, retry } = useInboxPreview();
  const [isOpen, toggleOpen] = useBoolean(false);

  if (!isSignedIn) {
    return null;
  }

  const unread = page?.unread ?? 0;

  return (
    <Popover.Root open={isOpen} onOpenChange={(next) => toggleOpen(next)}>
      <Popover.Trigger
        render={<IconButton aria-label={unread > 0 ? t('openUnread', { count: unread }) : t('open')} className={className} isActive={isOpen} />}
      >
        <BellGlyph unread={unread} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align='end' className={s.positioner} sideOffset={10}>
          <Popover.Popup className={s.popup}>
            <InboxPanel
              isError={isError}
              isPending={isPending}
              isRetrying={isRetrying}
              page={page}
              onClose={() => toggleOpen(false)}
              onRetry={() => void retry()}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
