import type { BindCode, BindCodeInput as BindCodeBody, ModDevice as ModDeviceView } from '@otmetki/schemas';

import type { ModDevice } from '../../../generated';
import type { BattleResultEvent, IngestBatch, IngestEvent } from './lib';

export type LedgerKeyInput = {
  accountId: bigint;
  eventId: string;
};

export type AuthenticatedDevice = ModDevice & {
  accountId: bigint;
};

export type IngestInput = {
  device: AuthenticatedDevice;
  batch: IngestBatch;
};

export type IdentifyDeviceInput = {
  deviceId: string | undefined;
  signature: string | undefined;
};

export type SignedModRequest = {
  method: string;
  originalUrl: string;
  header: (name: string) => string | undefined;
};

export type AuthenticateInput = {
  request: SignedModRequest;
  rawBody: Buffer | undefined;
};

export type BindCodeInput = BindCodeBody & {
  userId: string;
};

export type { BindCode, ModDeviceView };

export type RevokeDeviceInput = {
  userId: string;
  deviceId: string;
};

export type SessionSummary = {
  session_id: string;
  wn8: number | null;
  battles: number;
};

export type BattleEventInput = {
  device: AuthenticatedDevice;
  event: BattleResultEvent;
};

export type LedgeredEventInput = {
  device: AuthenticatedDevice;
  event: Exclude<IngestEvent, BattleResultEvent>;
};

export type SessionRef = {
  id: string;
  modId: string;
};

export type MarkGainedInput = {
  accountId: bigint;
  tankId: number;
  marks: number;
  previous: number | null;
  percent: number;
};
