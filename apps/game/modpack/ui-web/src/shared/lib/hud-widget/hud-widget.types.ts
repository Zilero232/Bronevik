import type { FunctionComponent } from 'preact';
import type * as z from 'zod/mini';

export type HudWidgetProps<Data> = { data: Data };

export type DefineHudWidgetInput<Data> = {
  kind: string;
  schema: z.ZodMiniType<Data>;
  Component: FunctionComponent<HudWidgetProps<Data>>;
};

export type HudWidgetEntry = {
  kind: string;
  parse: (data: unknown) => unknown;
  Component: FunctionComponent<HudWidgetProps<unknown>>;
};
