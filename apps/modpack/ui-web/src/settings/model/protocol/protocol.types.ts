import type * as z from 'zod/mini';

import type {
  actionSchema,
  componentSchema,
  fieldSchema,
  messageSchema,
  noticeSchema,
  pageSchema,
  panelSchema,
  stateSchema
} from './protocol.schemas';

export type UiState = z.infer<typeof stateSchema>;
export type UiComponent = z.infer<typeof componentSchema>;
export type UiField = z.infer<typeof fieldSchema>;
export type UiAction = z.infer<typeof actionSchema>;
export type UiPage = z.infer<typeof pageSchema>;
export type UiPanel = z.infer<typeof panelSchema>;
export type UiNotice = z.infer<typeof noticeSchema>;
export type UiMessage = z.infer<typeof messageSchema>;
export type SettingValue = Extract<UiMessage, { type: 'set' }>['value'];
