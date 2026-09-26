'use client';

import dynamic from 'next/dynamic';

import { useBoardSurface } from '../../../model/hooks';
import { TextDraft } from '../TextDraft';

import s from './BoardSurface.module.scss';

const BoardCanvas = dynamic(async () => (await import('../BoardCanvas')).BoardCanvas, { ssr: false });

export const BoardSurface = () => {
  const { ref, width, tool, isEditable, textPosition } = useBoardSurface();

  return (
    <div ref={ref} className={s.root} data-editable={isEditable} data-tool={tool}>
      {width > 0 && <BoardCanvas width={width} />}
      {textPosition && <TextDraft left={textPosition.left} top={textPosition.top} />}
    </div>
  );
};
