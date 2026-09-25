import type { z } from 'zod';

import type { bindCodeInputSchema, bindCodeSchema, modDeviceSchema, modDevicesSchema } from './mod.schemas';

export type BindCodeInput = z.infer<typeof bindCodeInputSchema>;
export type BindCode = z.infer<typeof bindCodeSchema>;
export type ModDevice = z.infer<typeof modDeviceSchema>;
export type ModDevices = z.infer<typeof modDevicesSchema>;
