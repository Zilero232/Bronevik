import type { ReplayUploadErrorKind } from '../../../../../lib/upload-error';
import type { UploadPhase } from '../../../../../model/hooks';

export type UploadOutcomeProps = {
  phase: UploadPhase;
  uploadedId: string | null;
  uploadError: ReplayUploadErrorKind | null;
  parseError: boolean;
  onReset: () => void;
};
