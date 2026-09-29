import type { FunctionComponent } from 'preact';

import type { DefineHudWidgetInput, HudWidgetEntry, HudWidgetProps } from './hud-widget.types';

export const defineHudWidget = <Data>({ kind, schema, Component }: DefineHudWidgetInput<Data>): HudWidgetEntry => ({
  kind,
  parse: (data) => {
    const parsed = schema.safeParse(data);

    return parsed.success ? parsed.data : undefined;
  },
  Component: Component as unknown as FunctionComponent<HudWidgetProps<unknown>>
});
