export { OVERLAY_BOARD, OVERLAY_OPTIONS, OVERLAY_PREVIEW } from './config';
export { formatOverlayValue, readOverlayMetric } from './lib/overlay-metric';
export type { OverlayMetricReading, OverlayResult, OverlayValueKind } from './lib/overlay-metric';
export { decodePreviewConfig, encodePreviewConfig, mergePreviewConfig } from './lib/preview-config';
export type { OverlayConfigPatch } from './lib/preview-config';
export { OverlayBoard } from './ui/OverlayBoard';
export type { OverlayBoardProps } from './ui/OverlayBoard.types';
