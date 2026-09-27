import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import {
  CardsSection,
  ChartsSection,
  ColorsSection,
  ControlsSection,
  DataSection,
  IconsSection,
  OverlaysSection,
  PatternsSection,
  TableSection,
  TypographySection
} from './components';

import s from './DesignPage.module.scss';

export const DesignPage = () => {
  const t = useTranslations('design');

  return (
    <div className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <div className={s.sections}>
        <ColorsSection />
        <TypographySection />
        <IconsSection />
        <ControlsSection />
        <OverlaysSection />
        <PatternsSection />
        <CardsSection />
        <DataSection />
        <ChartsSection />
        <TableSection />
      </div>
    </div>
  );
};
