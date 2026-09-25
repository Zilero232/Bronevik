import { z } from 'zod';

import { Prisma } from '../../../../generated';

const jsonSchema = z.json();

export const toJsonValue = (value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull => {
  const parsed = jsonSchema.safeParse(value);

  if (!parsed.success || parsed.data === null) {
    return Prisma.JsonNull;
  }

  return parsed.data;
};

export const readNumber = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null);

export const readRecord = (value: unknown): Record<string, unknown> => {
  const parsed = z.record(z.string(), z.unknown()).safeParse(value);

  return parsed.success ? parsed.data : {};
};
