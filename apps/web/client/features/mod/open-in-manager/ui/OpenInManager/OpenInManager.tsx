'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import clsx from 'clsx';
import { MonitorDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { OpenInManagerProps } from './OpenInManager.types';

import { OPEN_IN_MANAGER } from '../../config';
import { managerLink } from '../../lib/manager-link';

import s from './OpenInManager.module.scss';

export const OpenInManager = ({ target, size = 'sm', variant = 'secondary', className }: OpenInManagerProps) => {
  const t = useTranslations('mod.manager');
  const [isHintShown, setHintShown] = useBoolean(false);

  return (
    <div className={clsx(s.root, className)}>
      <a className={buttonVariants({ variant, size })} href={managerLink(target)} onClick={() => setHintShown(true)}>
        <MonitorDown aria-hidden size={OPEN_IN_MANAGER.iconSize} />
        {t('open')}
      </a>
      {isHintShown && (
        <p className={s.hint} role='status'>
          {t.rich('hint', { link: (chunks) => <Link href={ROUTES.mod}>{chunks}</Link> })}
        </p>
      )}
    </div>
  );
};
