export type ClientSize = {
  width: number;
  height: number;
};

export type GamefaceBridge = {
  clientSize: () => ClientSize | null;
  resizeView: (size: ClientSize) => boolean;
  fitView: () => boolean;
  state: () => string | null;
  feed: () => string | null;
  send: (message: string) => boolean;
  onDataChanged: (callback: () => void) => void;
  openWindow: () => boolean;
  setInputArea: (area: InputArea) => boolean;
};

export type InputArea = { left: number; top: number; width: number; height: number };

export type InvokeInput = {
  target: Record<string, unknown> | null;
  method: string;
  args: unknown[];
};
