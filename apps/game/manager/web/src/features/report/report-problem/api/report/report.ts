import { z } from 'zod';

import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { SaveReportInput, SendReportInput } from './report.types';

import { reportPreviewSchema, reportReceiptSchema } from './report.schemas';

export const prepareReport = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.prepareReport, schema: reportPreviewSchema, args: { clientPath } });

export const sendReport = ({ previewId, parts, message }: SendReportInput) =>
  invokeCommand({ command: COMMANDS.sendReport, schema: reportReceiptSchema, args: { previewId, parts, message } });

export const saveReport = ({ previewId, parts, message, path }: SaveReportInput) =>
  invokeCommand({ command: COMMANDS.saveReport, schema: z.string(), args: { previewId, parts, message, path } });
