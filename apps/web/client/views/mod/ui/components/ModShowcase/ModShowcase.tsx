import { useTranslations } from 'next-intl';

import { ROUTE_ANCHORS } from '@/shared/constants';
import { SectionHeader, Tabs } from '@/ui-kit';

import { MOD_PAGE, MOD_SHOWCASE } from '../../../config';
import { showcaseCount } from '../../../lib/showcase';
import { ShowcaseGroup } from './components';

import s from './ModShowcase.module.scss';

export const ModShowcase = () => {
  const t = useTranslations('mod.showcase');

  return (
    <section className={s.root} id={ROUTE_ANCHORS.modFeatures}>
      <SectionHeader description={t('lead', { count: showcaseCount() })} title={t('title')} variant='display' />
      <Tabs
        isKeptMounted
        items={MOD_SHOWCASE.map((group) => ({
          value: group.id,
          label: t(`groups.${group.id}.title`),
          icon: <group.icon aria-hidden size={MOD_PAGE.iconSize} />,
          count: group.items.length,
          content: <ShowcaseGroup group={group} />
        }))}
        aria-label={t('tabsLabel')}
      />
      <p className={s.legend}>{t('legend')}</p>
    </section>
  );
};
