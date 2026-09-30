import clsx from 'clsx';

import type { GalleryArtProps } from './GalleryArt.types';

import { Icon } from '../../../../../../../shared/ui/icon';

import s from './GalleryArt.module.scss';

export const GalleryArt = ({ image, badge, isChosen }: GalleryArtProps) => (
  <span className={s.art}>
    <span className={s.fallback}>
      <Icon name='warehouse' size={28} tone={isChosen ? 'accent' : 'muted'} />
    </span>
    {image && <img alt='' className={s.image} draggable={false} src={image} />}
    <span className={s.scrim} />
    {badge && <span className={clsx(s.badge, isChosen && s.badgeOn)}>{badge}</span>}
    {isChosen && (
      <span className={s.check}>
        <Icon name='check' size={12} tone='contrast' />
      </span>
    )}
  </span>
);
