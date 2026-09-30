import '../../shared/lib/engine-shims/install';

import { mountOnce, onDomReady } from '../../shared/lib/dom';
import { HudOverlay } from '../../widgets/hud-overlay';
import { HUD_PAGE } from './config';

import './styles/global.scss';

onDomReady(() => mountOnce({ id: HUD_PAGE.rootId, node: <HudOverlay /> }));
