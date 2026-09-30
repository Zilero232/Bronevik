export type TooltipText = {
  header?: string;
  body: string;
};

export type NativeTooltip = {
  available: () => boolean;
  show: (text: TooltipText) => boolean;
  hide: () => void;
};

export type ViewEventInput = {
  on: boolean;
  text?: TooltipText;
};

export type ResourceIdInput = { root: unknown; path: readonly string[] };

export type ValueProxyInput = { name: string; value: string };
