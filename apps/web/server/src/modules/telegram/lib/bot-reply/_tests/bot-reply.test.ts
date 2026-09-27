import { describe, expect, it } from 'vitest';

import { replyOptions } from '../bot-reply';

describe('replyOptions', () => {
  it('sends a plain reply without a link or image', () => {
    expect(replyOptions({ text: 'hi', link: null, imageUrl: null })).toEqual({});
  });

  it('previews the image in large size', () => {
    expect(replyOptions({ text: 'hi', link: null, imageUrl: 'https://cdn.example/card.png' })).toEqual({
      link_preview_options: { url: 'https://cdn.example/card.png', prefer_large_media: true }
    });
  });

  it('adds an open button for a public link', () => {
    const options = replyOptions({ text: 'hi', link: { label: 'Open', url: 'https://triotmetki.ru/p/Tanker' }, imageUrl: null });

    expect(options.reply_markup?.inline_keyboard).toEqual([[{ text: 'Open', url: 'https://triotmetki.ru/p/Tanker' }]]);
  });

  it('omits the button for a local link', () => {
    const options = replyOptions({ text: 'hi', link: { label: 'Open', url: 'http://localhost:3000' }, imageUrl: null });

    expect(options.reply_markup).toBeUndefined();
  });
});
