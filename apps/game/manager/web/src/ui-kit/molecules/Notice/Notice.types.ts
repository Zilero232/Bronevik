import type { ReactNode } from 'react';

import type { NOTICE_ICONS } from './Notice.constants';

export type NoticeTone = keyof typeof NOTICE_ICONS;

export type NoticeProps = {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
};
