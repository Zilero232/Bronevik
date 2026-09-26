import type { ShowcaseEnvironment } from '../showcase-mode';

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let webglSupport: boolean | undefined;

const detectWebgl = (): boolean => {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement('canvas');

      webglSupport = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
    } catch {
      webglSupport = false;
    }
  }

  return webglSupport;
};

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const readShowcaseEnvironment = (): ShowcaseEnvironment => {
  const hints: NavigatorHints = navigator;

  return {
    hasWebgl: detectWebgl(),
    prefersReducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    saveData: hints.connection?.saveData ?? false,
    isCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
    cores: hints.hardwareConcurrency,
    memoryGb: hints.deviceMemory
  };
};
