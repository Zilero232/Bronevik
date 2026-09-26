'use client';

import { Menu } from '@base-ui/react/menu';
import { clsx } from 'clsx';
import { ChevronDown, LogIn, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { ACCOUNT_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar, buttonVariants, Skeleton } from '@/ui-kit';

import { useAccountMenu } from '../../../model/hooks';

import s from './AccountMenu.module.scss';

export const AccountMenu = () => {
  const loginHref = useLoginHref();
  const t = useTranslations('nav.account');
  const tMe = useTranslations('me');
  const { user, isPending, isSigningOut, onSignOut } = useAccountMenu();

  if (isPending) {
    return <Skeleton height={28} shape='block' width={44} />;
  }

  if (!user) {
    return (
      <Link className={clsx(buttonVariants({ variant: 'primary', size: 'md' }), s.signIn)} href={loginHref}>
        <LogIn size={15} />
        {t('signIn')}
      </Link>
    );
  }

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger aria-label={t('menu')} className={s.trigger}>
        <Avatar name={user.name} size='sm' src={user.image ?? undefined} />
        <ChevronDown aria-hidden className={s.chevron} size={14} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align='end' className={s.positioner} sideOffset={8}>
          <Menu.Popup className={s.popup}>
            <span className={s.user}>{user.name}</span>
            {ACCOUNT_NAV.map((group) => (
              <Menu.Group key={group.key} className={s.group}>
                <Menu.GroupLabel className={s.label}>{tMe(`tabs.groups.${group.key}`)}</Menu.GroupLabel>
                {group.items.map((item) => (
                  <Menu.LinkItem closeOnClick key={item.key} className={s.item} render={<Link href={item.href} />}>
                    <item.icon aria-hidden size={15} />
                    {tMe(`tabs.${item.key}`)}
                  </Menu.LinkItem>
                ))}
              </Menu.Group>
            ))}
            <Menu.Separator className={s.separator} />
            <Menu.Item className={s.item} disabled={isSigningOut} onClick={onSignOut}>
              <LogOut aria-hidden size={15} />
              {tMe('signOut')}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
