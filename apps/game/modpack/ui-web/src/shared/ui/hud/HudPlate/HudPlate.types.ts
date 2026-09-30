import type { ReactNode } from 'react';

import type { HUD_RAILS } from '../../../config';

export type HudRail = (typeof HUD_RAILS)[number];

export type HudPlateProps = { rail?: HudRail | null; plain?: boolean; flash?: boolean; className?: string; children: ReactNode };
