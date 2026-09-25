'use client';

import { API_PLAN_LIMITS } from '@bronevik/schemas';
import { useFormatter, useTranslations } from 'next-intl';

import { TELEMETRY_DEMO } from '../../../../../config';
import { useTelemetryPlayback } from '../../../../../model/hooks';
import { ConsoleTokenView } from './ConsoleTokenView';
import { CONSOLE_COMMAND, CONSOLE_LINES } from './TelemetryConsole.helpers';

import s from './TelemetryConsole.module.scss';

const { requestsPerDay } = API_PLAN_LIMITS.free;

export const TelemetryConsole = () => {
  const t = useTranslations('developers.hero.console');
  const format = useFormatter();
  const { phase, typed, lines } = useTelemetryPlayback({ commandLength: CONSOLE_COMMAND.length, lineCount: CONSOLE_LINES.length + 1 });

  const isAnswered = lines > 0;

  return (
    <figure aria-label={t('label')} className={s.root}>
      <figcaption className={s.bar}>
        <span aria-hidden className={s.lamps}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.title}>{t('title')}</span>
        <span className={s.phase} data-phase={phase}>
          {t(`phase.${phase}`)}
        </span>
      </figcaption>
      <div aria-hidden className={s.screen}>
        <p className={s.prompt}>
          <span className={s.sigil}>$</span>
          <span>{CONSOLE_COMMAND.slice(0, typed)}</span>
          {phase === 'typing' && <span className={s.caret} />}
        </p>
        <p className={s.status} data-visible={isAnswered}>
          <span className={s.code}>200 OK</span>
          <span>{t('latency', { ms: TELEMETRY_DEMO.latencyMs })}</span>
        </p>
        <pre className={s.body}>
          {CONSOLE_LINES.map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key -- the console script is static, a line index is its identity
            <span key={index} className={s.line} data-visible={index + 1 < lines}>
              {line.map((token, position) => (
                // eslint-disable-next-line react/no-array-index-key -- tokens of a static line never reorder
                <ConsoleTokenView key={position} isVisible={index + 1 < lines} token={token} />
              ))}
            </span>
          ))}
        </pre>
      </div>
      <footer className={s.foot} data-visible={phase === 'done'}>
        <span>X-RateLimit-Daily-Remaining</span>
        <span className={s.remaining}>
          {format.number(requestsPerDay - 1)} / {format.number(requestsPerDay)}
        </span>
      </footer>
    </figure>
  );
};
