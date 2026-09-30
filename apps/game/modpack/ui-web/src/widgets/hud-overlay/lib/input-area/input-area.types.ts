import type { InputArea } from '../../../../shared/api/gameface';
import type { Rect, Size } from '../../../../shared/lib/hud-geometry';

export type InputAreaOfInput = { whole: boolean; screen: Size; rects: Rect[] };

export type { InputArea };
