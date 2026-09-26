import type { Job } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { FirstWinRemindersService, MarksWatchService, SessionReportsService, ThresholdDropsService, WeeklyDigestService } from '../../services';

import { NOTIFICATIONS_JOB } from '../../contracts';
import { NotificationEventsProcessor } from '../notification-events.processor';

const createProcessor = () => {
  const services = {
    marks: mock<MarksWatchService>(),
    sessions: mock<SessionReportsService>(),
    thresholds: mock<ThresholdDropsService>(),
    digest: mock<WeeklyDigestService>(),
    firstWin: mock<FirstWinRemindersService>()
  };

  services.marks.run.mockResolvedValue(1);
  services.sessions.run.mockResolvedValue(2);
  services.thresholds.run.mockResolvedValue(3);
  services.digest.run.mockResolvedValue(4);
  services.firstWin.run.mockResolvedValue(5);

  const processor = new NotificationEventsProcessor(services.marks, services.sessions, services.thresholds, services.digest, services.firstWin);

  return { processor, services };
};

describe('NotificationEventsProcessor.process', () => {
  it.each([
    [NOTIFICATIONS_JOB.events.marksWatch, 1],
    [NOTIFICATIONS_JOB.events.sessionReports, 2],
    [NOTIFICATIONS_JOB.events.thresholdDrops, 3],
    [NOTIFICATIONS_JOB.events.weeklyDigest, 4],
    [NOTIFICATIONS_JOB.events.firstWinReminders, 5]
  ])('runs the %s watcher', async (name, expected) => {
    const { processor } = createProcessor();

    await expect(processor.process(mock<Job>({ name }))).resolves.toBe(expected);
  });

  it('ignores an unknown job without running any watcher', async () => {
    const { processor, services } = createProcessor();

    await expect(processor.process(mock<Job>({ name: 'unknown' }))).resolves.toBe(0);
    expect(Object.values(services).every((service) => service.run.mock.calls.length === 0)).toBe(true);
  });
});
