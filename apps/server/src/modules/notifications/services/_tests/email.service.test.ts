import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { AppConfigService } from '../../../../config';

import { placeholderEmail } from '../../../../lib/auth';

const { sendMail, createTransport } = vi.hoisted(() => {
  const send = vi.fn();

  return { sendMail: send, createTransport: vi.fn(() => ({ sendMail: send })) };
});

vi.mock('nodemailer', async (importOriginal) => ({ ...(await importOriginal<typeof import('nodemailer')>()), createTransport }));

vi.resetModules();

const { EmailService } = await import('../email.service');

const RENDERED = { title: 'Weekly digest', body: 'You played 10 battles', url: 'https://example.com/me' };

const createService = (value: string) => {
  const config = mock<AppConfigService>();

  config.get.mockReturnValue(value);
  sendMail.mockReset();
  sendMail.mockResolvedValue({});

  return new EmailService(config);
};

describe('EmailService', () => {
  it('is disabled without an SMTP host and sends nothing', async () => {
    const service = createService('');

    await service.sendNotification({ to: 'player@example.com', locale: 'ru', rendered: RENDERED });

    expect(service.isEnabled).toBe(false);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('cannot reach a missing or placeholder address', () => {
    const service = createService('configured');

    expect(service.canReach('player@example.com')).toBe(true);
    expect(service.canReach(null)).toBe(false);
    expect(service.canReach('')).toBe(false);
    expect(service.canReach(placeholderEmail({ provider: 'lesta', id: '42' }))).toBe(false);
  });

  it('cannot reach anyone while disabled', () => {
    expect(createService('').canReach('player@example.com')).toBe(false);
  });

  it('sends the rendered notification as HTML and plain text', async () => {
    const service = createService('configured');

    await service.sendDigest({
      to: 'player@example.com',
      locale: 'en',
      rendered: RENDERED,
      digest: { battles: 10, wins: 5, damageDealt: 1, sessions: 1, marksGained: 0 }
    });

    const mail = sendMail.mock.calls[0]?.[0];

    expect(mail).toMatchObject({ to: 'player@example.com', subject: RENDERED.title });
    expect(mail?.html).toContain(RENDERED.body);
    expect(mail?.text).toContain(RENDERED.body);
    expect(mail?.text).not.toContain('<');
  });
});
