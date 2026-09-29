import type { NavMarker, NavMarkerInput } from './nav-marker.types';

import { NAV_MARKER } from '../../config';

const problemTones = new Set<string>(NAV_MARKER.problemTones);

export const navMarker = ({ section, view, canInstall }: NavMarkerInput): NavMarker | null => {
  if (section !== 'home') {
    return null;
  }

  if (canInstall) {
    return 'new';
  }

  if (view === null) {
    return null;
  }

  if (view.action !== null) {
    return 'update';
  }

  return problemTones.has(view.tone) ? 'problem' : null;
};
