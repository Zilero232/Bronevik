import type { ManagerErrorCode } from '../../api';

export type ErrorText = {
  code: ManagerErrorCode;
  title: string;
  hint: string;
};
