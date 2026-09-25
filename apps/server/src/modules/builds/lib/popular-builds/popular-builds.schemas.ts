import { z } from 'zod';

const ids = z.array(z.number().int().positive()).default([]);

export const battleLoadoutSchema = z.object({
  optionalDevices: ids,
  consumables: ids,
  directives: ids
});
