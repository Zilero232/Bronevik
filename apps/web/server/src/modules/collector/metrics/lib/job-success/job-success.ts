import { z } from 'zod';

import type { JobSuccessKeyInput } from './job-success.types';

export const jobSuccessSchema = z.record(z.string(), z.iso.datetime());

export const jobSuccessKey = ({ queue, name }: JobSuccessKeyInput): string => `${queue}:${name}`;
