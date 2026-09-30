import type * as z from 'zod/mini';

import type {
  actionSchema,
  componentSchema,
  detailSchema,
  fieldSchema,
  figureSchema,
  marksReportSchema,
  messageSchema,
  noticeSchema,
  pageSchema,
  panelSchema,
  profileSchema,
  profilesSchema,
  rowSchema,
  stateSchema,
  statusSchema,
  windowSchema
} from './protocol.schemas';

export type UiState = z.infer<typeof stateSchema>;
export type UiStatus = z.infer<typeof statusSchema>;
export type UiComponent = z.infer<typeof componentSchema>;
export type UiField = z.infer<typeof fieldSchema>;
export type UiAction = z.infer<typeof actionSchema>;
export type UiPage = z.infer<typeof pageSchema>;
export type UiRow = z.infer<typeof rowSchema>;
export type UiDetail = z.infer<typeof detailSchema>;
export type UiFigure = z.infer<typeof figureSchema>;
export type UiMarksReport = z.infer<typeof marksReportSchema>;
export type UiPanel = z.infer<typeof panelSchema>;
export type UiNotice = z.infer<typeof noticeSchema>;
export type UiProfile = z.infer<typeof profileSchema>;
export type UiProfiles = z.infer<typeof profilesSchema>;
export type UiWindow = z.infer<typeof windowSchema>;
export type UiSection = UiComponent['section'];
export type UiContext = UiComponent['context'];
export type UiMessage = z.infer<typeof messageSchema>;
export type UiMessageOf<Type extends UiMessage['type']> = Extract<UiMessage, { type: Type }>;
export type SettingValue = UiMessageOf<'set'>['value'];
export type FieldOf<Type extends UiField['type']> = Extract<UiField, { type: Type }>;
