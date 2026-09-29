import type { UseFormRegisterReturn } from 'react-hook-form';

export type CoverFieldProps = {
  preview: string | null;
  hasUploadedCover: boolean;
  isUploading: boolean;
  isInvalid: boolean;
  urlField: UseFormRegisterReturn<'coverUrl'>;
  onFile: (file: File | undefined) => void;
  onRemove: () => void;
};
