import type { PreviewAudioProps } from './PreviewAudio.types';

import { useMediaSource } from '../../model/hooks';

export const PreviewAudio = ({ src, label, className }: PreviewAudioProps) => {
  const { src: audio, onError } = useMediaSource(src);

  if (!audio) {
    return null;
  }

  return (
    <audio controls aria-label={label} className={className} preload='none' src={audio} onError={onError}>
      <track kind='captions' />
    </audio>
  );
};
