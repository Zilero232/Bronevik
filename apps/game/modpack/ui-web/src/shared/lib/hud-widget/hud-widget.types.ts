import type { FunctionComponent, VNode } from 'preact';
import type * as z from 'zod/mini';

export type HudWidgetProps<Data> = { data: Data };

export type DefineHudWidgetInput<Data> = {
  kind: string;
  schema: z.ZodMiniType<Data>;
  Component: FunctionComponent<HudWidgetProps<Data>>;
  pointer?: boolean;
};

export type ParsedHudWidget = {
  kind: string;
  data: unknown;
  pointer: boolean;
  node: VNode;
};

export type HudWidgetEntry = {
  kind: string;
  parse: (data: unknown) => ParsedHudWidget | undefined;
};
