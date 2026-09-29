import { clsx } from 'clsx';
import { createElement } from 'react';

import type { ComponentPreviewProps } from './ComponentPreview.types';

import { previewLook } from '../../lib';
import { useMediaSource } from '../../model/hooks';

import s from './ComponentPreview.module.scss';

export const ComponentPreview = ({ src, category, className }: ComponentPreviewProps) => {
  const { src: image, isLoaded, onLoad, onError } = useMediaSource(src);
  const { icon, tone } = previewLook(category);

  return (
    <div className={clsx(s.root, className)} data-loaded={isLoaded || undefined} data-tone={tone}>
      {createElement(icon, { 'aria-hidden': true, className: s.icon })}
      {image && <img alt='' className={s.image} decoding='async' loading='lazy' src={image} onError={onError} onLoad={onLoad} />}
    </div>
  );
};
