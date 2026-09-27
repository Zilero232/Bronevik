import { describe, expect, it } from 'vitest';

import { toMessage } from '../reply-message';

describe('toMessage', () => {
  it('turns a shared bot reply into content, a public image embed and link buttons', () => {
    const message = toMessage({
      reply: { text: 'card', link: { label: 'Open', url: 'https://triotmetki.ru/p/a' }, imageUrl: 'https://triotmetki.ru/api/og/player/1' },
      connect: { label: 'Link', url: 'https://triotmetki.ru/me' }
    });

    expect(message.content).toBe('card');
    expect(message.embeds).toHaveLength(1);
    expect(message.components?.[0]).toMatchObject({ components: [{ url: 'https://triotmetki.ru/p/a' }, { url: 'https://triotmetki.ru/me' }] });
  });

  it('drops local images and empty button rows', () => {
    const message = toMessage({ reply: { text: 'x', link: null, imageUrl: 'http://localhost:3000/og' }, connect: null });

    expect(message.embeds).toEqual([]);
    expect(message.components).toEqual([]);
  });
});
