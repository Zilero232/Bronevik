import { BUTTON, HangarButton, openWindow } from '../../features/hangar-button';
import { mountOnce, onDomReady } from '../../shared/lib/dom';

onDomReady(() => mountOnce({ id: BUTTON.hostId, node: <HangarButton onOpen={openWindow} /> }));
