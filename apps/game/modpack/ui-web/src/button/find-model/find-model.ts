import { BUTTON } from '../button.constants';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export const findButtonModel = (scope: unknown): Record<string, unknown> | null => {
  if (!isRecord(scope)) {
    return null;
  }

  const subViews: unknown = scope.subViews;
  const candidates: unknown[] = [scope.model, ...(isRecord(subViews) ? Object.values(subViews) : [])];

  for (const candidate of candidates) {
    const model = isRecord(candidate) && isRecord(candidate.model) ? candidate.model : candidate;

    if (isRecord(model) && model[BUTTON.marker] === BUTTON.markerValue && typeof model[BUTTON.openCommand] === 'function') {
      return model;
    }
  }

  return null;
};
