import type { ComponentChildren } from 'preact';

import type { HudTone } from '../tone';

export type HudPlateProps = { rail?: HudTone | null; plain?: boolean; flash?: boolean; className?: string; children: ComponentChildren };
