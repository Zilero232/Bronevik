import * as z from 'zod/mini';

import { LANGUAGES } from '../../i18n';
import { PROTOCOL } from './protocol.constants';

const text = z.string();
const optionalText = z.optional(z.nullable(z.string()));

const fieldBase = { key: text, label: text, hint: z.nullable(z.string()) };

export const fieldSchema = z.discriminatedUnion('type', [
  z.object({ ...fieldBase, type: z.literal('bool'), value: z.boolean(), default: z.boolean() }),
  z.object({
    ...fieldBase,
    type: z.literal('int'),
    value: z.number(),
    default: z.number(),
    min: z.nullable(z.number()),
    max: z.nullable(z.number())
  }),
  z.object({
    ...fieldBase,
    type: z.literal('choice'),
    value: text,
    default: text,
    choices: z.array(z.object({ value: text, label: text }))
  }),
  z.object({ ...fieldBase, type: z.literal('text'), value: text, default: text, max_length: z.number() })
]);

export const actionSchema = z.object({
  id: text,
  label: text,
  confirm: optionalText,
  link: optionalText,
  input: optionalText
});

export const detailSchema = z.object({ label: text, value: text });

export const figureSchema = z.object({
  shapes: z.array(z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })),
  marks: z.array(z.object({ x: z.number(), y: z.number(), tone: z.enum(PROTOCOL.figureTones) }))
});

const reportBattleSchema = z.object({
  t: z.nullable(z.number()),
  damage: z.nullable(z.number()),
  percent: z.nullable(z.number()),
  delta: z.nullable(z.number()),
  result: z.optional(z.nullable(z.string()))
});

export const marksReportSchema = z.object({
  name: text,
  tier: z.nullable(z.number()),
  tier_icon: z.nullable(z.string()),
  flag: z.nullable(z.string()),
  cls: z.nullable(z.string()),
  percent: z.nullable(z.number()),
  marks: z.number(),
  mark: z.nullable(z.string()),
  avg: z.nullable(z.number()),
  last: z.nullable(reportBattleSchema),
  best: z.nullable(reportBattleSchema),
  record: z.nullable(z.number()),
  trends: z.array(z.object({ window: z.number(), battles: z.number(), delta: z.nullable(z.number()) })),
  battles: z.array(reportBattleSchema),
  chart: z.array(z.number())
});

export const rowSchema = z.object({
  id: text,
  title: text,
  subtitle: optionalText,
  meta: optionalText,
  badge: optionalText,
  link: optionalText,
  details: z.optional(z.array(detailSchema)),
  figure: z.optional(z.nullable(figureSchema)),
  report: z.optional(z.nullable(marksReportSchema)),
  actions: z.array(actionSchema)
});

export const pageSchema = z.object({ kind: z.literal('list'), empty: text, rows: z.array(rowSchema) });

export const componentSchema = z.object({
  id: text,
  group: text,
  title: text,
  hint: z.nullable(z.string()),
  switch: z.nullable(z.object({ key: text, value: z.boolean() })),
  fields: z.array(fieldSchema),
  panel: z.boolean(),
  actions: z.array(actionSchema),
  page: z.nullable(pageSchema)
});

export const panelSchema = z.object({
  id: text,
  title: text,
  enabled: z.boolean(),
  x: z.number(),
  y: z.number(),
  align_x: z.enum(PROTOCOL.alignX),
  align_y: z.enum(PROTOCOL.alignY),
  preview: z.nullable(z.string()),
  width: z.number(),
  height: z.number()
});

export const noticeSchema = z.object({
  kind: z.enum(PROTOCOL.noticeKinds),
  text: z.nullable(z.string()),
  code: z.nullable(z.string())
});

export const statusSchema = z.object({ bound: z.boolean(), auth_failed: z.boolean(), account_id: z.nullable(z.number()), text });

export const profileSchema = z.object({ id: text, name: text, updated: z.nullable(z.number()) });

export const profilesSchema = z.object({ active: z.nullable(z.string()), items: z.array(profileSchema) });

export const stateSchema = z.object({
  v: z.literal(PROTOCOL.version),
  revision: z.number(),
  language: z.enum(LANGUAGES),
  language_setting: text,
  languages: z.array(text),
  status: statusSchema,
  site: text,
  components: z.array(componentSchema),
  profiles: profilesSchema,
  hud: z.object({ editing: z.boolean(), panels: z.array(panelSchema) }),
  notice: z.nullable(noticeSchema)
});

const settingValue = z.union([z.boolean(), z.number(), z.string()]);

export const messageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ready') }),
  z.object({ type: z.literal('close') }),
  z.object({ type: z.literal('set'), component: text, key: text, value: settingValue }),
  z.object({ type: z.literal('action'), component: text, action: text, row: z.optional(text), value: z.optional(text) }),
  z.object({ type: z.literal('language'), language: z.enum([PROTOCOL.autoLanguage, ...LANGUAGES] as const) }),
  z.object({ type: z.literal('bind'), code: text }),
  z.object({ type: z.literal('open'), path: text }),
  z.object({ type: z.literal('profile_save'), name: text, id: z.optional(text) }),
  z.object({ type: z.literal('profile_load'), id: text }),
  z.object({ type: z.literal('profile_rename'), id: text, name: text }),
  z.object({ type: z.literal('profile_delete'), id: text }),
  z.object({ type: z.literal('profile_export'), id: text }),
  z.object({ type: z.literal('profile_import'), code: text, name: z.optional(text) }),
  z.object({ type: z.literal('hud_edit'), active: z.boolean() }),
  z.object({
    type: z.literal('hud_move'),
    panel: text,
    x: z.number(),
    y: z.number(),
    align_x: z.optional(z.enum(PROTOCOL.alignX)),
    align_y: z.optional(z.enum(PROTOCOL.alignY))
  }),
  z.object({ type: z.literal('hud_reset'), panel: text }),
  z.object({ type: z.literal('hud_reset_all') })
]);
