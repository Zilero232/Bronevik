export type AuthResult<T> = {
  data: T | null;
  error: { status: number; message?: string } | null;
};
