export const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

export const isMissingFileError = (error: unknown): boolean => error instanceof Error && 'code' in error && error.code === 'ENOENT';
