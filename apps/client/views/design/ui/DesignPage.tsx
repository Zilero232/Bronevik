import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import {
  ChartsSection,
  ColorsSection,
  ControlsSection,
  DataSection,
  IconsSection,
  OverlaysSection,
  TableSection,
  TypographySection
} from './components';

import s from './DesignPage.module.scss';

export const DesignPage = () => {
  const t = useTranslations('design');

  return (
    <div className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// SYS' title={t('title')} />
      <div className={s.sections}>
        <ColorsSection />
        <TypographySection />
        <IconsSection />
        <ControlsSection />
        <OverlaysSection />
        <DataSection />
        <ChartsSection />
        <TableSection />
      </div>
    </div>
  );
};
