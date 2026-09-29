import { mockIPC } from '@tauri-apps/api/mocks';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { COMMANDS } from '../../../../config';
import { ManagerError } from '../../manager-error';
import { invokeCommand } from '../invoke-command';

const schema = z.object({ version: z.string() });

describe('invokeCommand', () => {
  it('passes the arguments and returns the parsed response', async () => {
    const calls: unknown[] = [];

    mockIPC((command, args) => {
      calls.push({ command, args });

      return { version: '0.1.0' };
    });

    await expect(invokeCommand({ command: COMMANDS.appInfo, schema, args: { clientPath: null } })).resolves.toEqual({ version: '0.1.0' });
    expect(calls).toEqual([{ command: COMMANDS.appInfo, args: { clientPath: null } }]);
  });

  it('turns a rejected command into a ManagerError with its code', async () => {
    mockIPC(() => {
      throw Object.assign(new Error('the game is running'), { code: 'client_running' });
    });

    await expect(invokeCommand({ command: COMMANDS.checkNow, schema })).rejects.toMatchObject({ code: 'client_running' });
  });

  it('refuses a response that does not match the contract', async () => {
    mockIPC(() => ({ version: 1 }));

    await expect(invokeCommand({ command: COMMANDS.appInfo, schema })).rejects.toBeInstanceOf(ManagerError);
  });
});
