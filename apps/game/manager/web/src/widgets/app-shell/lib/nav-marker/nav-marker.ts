import type { NavMarker, NavMarkerInput } from './nav-marker.types';

import { NAV_MARKER } from '../../config';

const problemTones = new Set<string>(NAV_MARKER.problemTones);

export const navMarker = ({ page, view, canInstall }: NavMarkerInput): NavMarker | null => {
  if (page === 'install') {
    return canInstall ? 'new' : null;
  }

  if (page !== 'home' || view === null) {
    return null;
  }

  if (view.action !== null) {
    return 'update';
  }

  return problemTones.has(view.tone) ? 'problem' : null;
};
