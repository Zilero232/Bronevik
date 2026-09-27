import { useTranslations } from 'next-intl';

import { TYPE_SAMPLES } from '../../../config';
import { DesignBlock } from '../DesignBlock';

import s from './TypographySection.module.scss';

export const TypographySection = () => {
  const t = useTranslations('design.type');

  return (
    <DesignBlock id='type' title={t('title')}>
      {TYPE_SAMPLES.map((sample) => (
        <div key={sample.key} className={s.row}>
          <span className={s.meta}>{t(`${sample.key}.meta`)}</span>
          <p className={s[sample.className]}>{t(`${sample.key}.sample`)}</p>
        </div>
      ))}
    </DesignBlock>
  );
};
