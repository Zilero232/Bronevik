import clients from '@contract/clients.json';
import { describe, expect, it } from 'vitest';

import { clientsViewSchema } from '@/entities/client';

describe('clientsViewSchema', () => {
  it('parses the clients the Rust core reports', () => {
    const view = clientsViewSchema.parse(clients);

    expect(view.selected).toBe(view.clients[0]?.path);
    expect(view.clients.some((client) => client.problem === 'not_lesta')).toBe(true);
  });
});
