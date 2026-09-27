import type { ResultsBlock } from '../header';
import type { ReplaySummary } from '../summary';

export type ReplayInput = ArrayBuffer | Uint8Array;

export type ReplayHeader = {
  arena: Record<string, unknown>;
  blockCount: number;
  extraBlocks: unknown[];
  results: ResultsBlock | null;
  resultsRaw: unknown;
  stream: {
    compressedSize: number;
    decompressedSize: number;
  } | null;
};

export type ParsedReplay = {
  header: ReplayHeader;
  summary: ReplaySummary;
  warnings: string[];
};
