import type { Response } from 'express';

export type ReplyInput = {
  exception: unknown;
  response: Response;
};
