'use client';

import { clsx } from 'clsx';
import { LogIn, Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAuthSession } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { StudioLinkProps } from './StudioLink.types';

export const StudioLink = ({ size = 'lg', className }: StudioLinkProps) => {
  const t = useTranslations('streamers.cta');
  const { data: session } = useAuthSession();

  return (
    <Link className={clsx(buttonVariants({ variant: 'primary', size }), className)} href={ROUTES.account.streamer}>
      {session ? <Radio size={17} /> : <LogIn size={17} />}
      {session ? t('studio') : t('signIn')}
    </Link>
  );
};
