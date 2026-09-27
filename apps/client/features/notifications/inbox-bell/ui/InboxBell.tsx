'use client';

import { Popover } from '@base-ui/react/popover';
import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import type { InboxBellProps } from './InboxBell.types';

import { useInboxUnread } from '../model/hooks';
import { BellGlyph, InboxPanel, InboxPanelProvider } from './components';

import s from './InboxBell.module.scss';

export const InboxBell = ({ className }: InboxBellProps) => {
  const t = useTranslations('inbox');
  const { isSignedIn, unread } = useInboxUnread();
  const [isOpen, toggleOpen] = useBoolean(false);

  if (!isSignedIn) {
    return null;
  }

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
            <InboxPanelProvider value={{ close: () => toggleOpen(false) }}>
              <InboxPanel />
            </InboxPanelProvider>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
