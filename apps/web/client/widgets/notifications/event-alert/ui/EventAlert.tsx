'use client';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton, Switch } from '@/ui-kit';

import type { EventAlertProps } from './EventAlert.types';

import { useEventAlert } from '../model/hooks';

import s from './EventAlert.module.scss';

export const EventAlert = ({ event, messages, label, channels, skeleton, signedOut }: EventAlertProps) => {
  const { isSignedIn, isOn, isPending, onToggle } = useEventAlert({ event, messages });

  if (isPending) {
    return <Skeleton height={skeleton.height} shape='block' width={skeleton.width} />;
  }

  if (!isSignedIn && signedOut) {
    return signedOut;
  }

  return (
    <div className={s.root}>
      <Switch checked={isOn} label={label} onCheckedChange={onToggle} />
      <Link className={s.hint} href={ROUTES.account.notifications}>
        {channels}
      </Link>
    </div>
  );
};
