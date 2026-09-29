import { useTranslations } from 'next-intl';

import { ActionStrip } from '@/ui-kit';

import { HOME_ACTIONS, HOME_ICON } from '../../../config';

export const HomeActions = () => {
  const t = useTranslations('home.actions');

  return (
    <ActionStrip
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
