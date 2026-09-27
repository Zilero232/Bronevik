import { LockKeyhole } from 'lucide-react';

import type { TeaserPreviewProps } from './TeaserPreview.types';

import { PLUS_FEATURE_PREVIEW, PLUS_PREVIEW_SAMPLE } from '../../../../config';

import s from './TeaserPreview.module.scss';

export const TeaserPreview = ({ feature }: TeaserPreviewProps) => {
  const kind = PLUS_FEATURE_PREVIEW[feature];

  return (
    <div aria-hidden className={s.root} data-kind={kind}>
      <div className={s.sample}>
        {kind === 'chart' && (
          <svg className={s.chart} preserveAspectRatio='none' viewBox='0 0 120 80'>
            <polyline className={s.line} points={PLUS_PREVIEW_SAMPLE.chart} />
          </svg>
        )}
        {kind === 'table' &&
          PLUS_PREVIEW_SAMPLE.rows.map((width) => (
            <span key={width} className={s.row}>
              <span className={s.cell} />
              <span className={s.bar} style={{ width: `${width}%` }} />
            </span>
          ))}
        {kind === 'cards' && PLUS_PREVIEW_SAMPLE.cards.map((index) => <span key={index} className={s.card} />)}
      </div>
      <LockKeyhole className={s.lock} size={20} />
    </div>
  );
};
