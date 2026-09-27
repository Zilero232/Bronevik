import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { ActionStrip, buttonVariants } from '@/ui-kit';

import { HOME_ACTIONS, HOME_CTA, HOME_ICON } from '../../../config';

export const HomeActions = () => {
  const t = useTranslations('home.actions');

  return (
    <ActionStrip
      end={
        <Link className={buttonVariants({ variant: 'primary' })} href={HOME_CTA.href}>
          <HOME_CTA.icon aria-hidden size={HOME_ICON.cta} />
          {t('cta')}
        </Link>
      }
      links={HOME_ACTIONS.map(({ key, href, icon: Icon, tone }) => ({
        id: key,
        href,
        tone,
        label: t(key),
        hint: t(`hints.${key}`),
        icon: <Icon aria-hidden size={HOME_ICON.action} />
      }))}
      aria-label={t('label')}
      as='nav'
      variant='tiles'
    />
  );
};
