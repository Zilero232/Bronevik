export type InvokeInput = {
  target: Record<string, unknown> | null;
  method: string;
  args: unknown[];
};
