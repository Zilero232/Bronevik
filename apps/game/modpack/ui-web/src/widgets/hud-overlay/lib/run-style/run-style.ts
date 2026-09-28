import type { RichImageRun, RichTextRun } from '../../../../shared/lib/rich-text';
import type { RunStyle } from './run-style.types';

import { HUD_OVERLAY } from '../../config';

const rem = (value: number | undefined): string | undefined => (value === undefined ? undefined : `${value}${HUD_OVERLAY.unit}`);

export const textStyle = ({ style }: RichTextRun): RunStyle => ({ color: style.color, fontSize: rem(style.size) });

export const imageStyle = ({ width, height }: RichImageRun): RunStyle => ({ width: rem(width), height: rem(height) });
