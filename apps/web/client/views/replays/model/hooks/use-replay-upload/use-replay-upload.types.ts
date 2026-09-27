import type { REPLAY_VISIBILITIES } from '../../../config';

export type UploadVisibility = (typeof REPLAY_VISIBILITIES)[number];

export type UploadPhase = 'failed' | 'idle' | 'parsed' | 'processing' | 'rejected' | 'selected' | 'uploading';
