import type { ClientSize } from '../gameface.types';

export type GamefaceMockInput = {
  state: string;
  clientSize: () => ClientSize;
  onSend: (message: string) => string | null;
};

export type GamefaceMock = {
  scope: Record<string, unknown>;
  sent: () => string[];
};
