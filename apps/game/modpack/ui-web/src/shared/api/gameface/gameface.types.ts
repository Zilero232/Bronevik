export type ClientSize = {
  width: number;
  height: number;
};

export type GamefaceBridge = {
  clientSize: () => ClientSize | null;
  state: () => string | null;
  send: (message: string) => boolean;
  onDataChanged: (callback: () => void) => void;
  openWindow: () => boolean;
};

export type InvokeInput = {
  target: Record<string, unknown> | null;
  method: string;
  args: unknown[];
};
