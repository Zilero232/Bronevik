'use client';

import { useTranslations } from 'next-intl';

import { useIconControls } from '../../../model/hooks';
import { DesignBlock } from '../DesignBlock';
import { AnimatedRow, ClassVariantRows, ExtraIconRows, IconControls, IconGroupRows, RendersRow, SurfacesRow } from './components';

export const IconsSection = () => {
  const t = useTranslations('design.icons');
  const { size, stroke, iconProps, setSize, setStroke } = useIconControls();

  return (
    <DesignBlock
      action={<IconControls size={size} stroke={stroke} onSizeChange={setSize} onStrokeChange={setStroke} />}
      id='icons'
      title={t('title')}
    >
      <IconGroupRows iconProps={iconProps} />
      <ClassVariantRows size={iconProps.size} />
      <ExtraIconRows iconProps={iconProps} />
      <RendersRow />
      <SurfacesRow />
      <AnimatedRow />
    </DesignBlock>
  );
};
