import clsx from 'clsx';

import type { MarksReportProps } from './MarksReport.types';

import { useT } from '../../../../../../../entities/window-state';
import { ClientIcon } from '../../../../../../../shared/ui/hud';
import { MARKS_REPORT, marksReportView } from '../../../../../lib/marks-report';

import s from './MarksReport.module.scss';

export const MarksReport = ({ report }: MarksReportProps) => {
  const t = useT();
  const view = marksReportView(report);

  return (
    <div className={s.report}>
      <div className={s.header}>
        <ClientIcon icon={report.flag} size={17} width={25} />
        <ClientIcon icon={report.tier_icon} size={16} />
        <ClientIcon icon={report.cls} size={16} />
        <span className={s.name}>{report.name}</span>
        <ClientIcon icon={report.mark} size={24} />
        <span className={s.percent}>{view.percent}</span>
      </div>
      <div className={s.track}>
        <div className={s.fill} style={{ width: view.progress }} />
      </div>
      <div className={s.scale}>
        <span>0</span>
        <span>65</span>
        <span>85</span>
        <span>95</span>
        <span>100</span>
      </div>
      <div className={s.cards}>
        {view.cards.map((card) => (
          <div key={card.key} className={s.card}>
            <span className={s.cardLabel}>
              {card.window === null ? t(card.label === 'last' ? 'reportLast' : 'reportBest') : `${t('reportTrend')} ${card.window}`}
            </span>
            <span className={s.cardValue}>{card.value}</span>
            <span className={clsx(s.delta, s[card.tone])}>{card.delta}</span>
          </div>
        ))}
      </div>
      {view.chart && (
        <div className={s.chart}>
          <span className={s.chartBox} style={{ width: `${MARKS_REPORT.chart.width}rem`, height: `${MARKS_REPORT.chart.height}rem` }}>
            <svg
              height='100%'
              preserveAspectRatio='none'
              viewBox={`0 0 ${MARKS_REPORT.chart.width} ${MARKS_REPORT.chart.height}`}
              width='100%'
              xmlns='http://www.w3.org/2000/svg'
            >
              <polyline fill='none' points={view.chart.points} stroke='currentColor' stroke-linejoin='round' stroke-width={2} />
            </svg>
          </span>
          <div className={s.chartScale}>
            <span>{view.chart.max}</span>
            <span>{view.chart.min}</span>
          </div>
        </div>
      )}
      <div className={s.table}>
        <div className={clsx(s.tableRow, s.tableHead)}>
          <span className={s.cellDate}>{t('reportBattle')}</span>
          <span className={s.cell}>{t('reportDamage')}</span>
          <span className={s.cell}>%</span>
          <span className={s.cell}>{'±%'}</span>
        </div>
        {view.rows.map((row) => (
          <div key={row.key} className={s.tableRow}>
            <span className={s.cellDate}>{row.date}</span>
            <span className={s.cell}>{row.damage}</span>
            <span className={s.cell}>{row.percent}</span>
            <span className={clsx(s.cell, s[row.tone])}>{row.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
