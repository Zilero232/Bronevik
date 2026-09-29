import type { DefineHudWidgetInput, HudWidgetEntry } from './hud-widget.types';

export const defineHudWidget = <Data,>({ kind, schema, Component }: DefineHudWidgetInput<Data>): HudWidgetEntry => ({
  kind,
  parse: (data) => {
    const parsed = schema.safeParse(data);

    return parsed.success ? { kind, data: parsed.data, node: <Component data={parsed.data} /> } : undefined;
  }
});
