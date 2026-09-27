import clsx from 'clsx';

import type { NoticeProps } from './Notice.types';

export const Notice = ({ notice }: NoticeProps) => (
  <div className={clsx('notice', `notice--${notice.kind}`)}>
    {notice.text && <span className='notice__text'>{notice.text}</span>}
    {notice.code && <textarea readOnly className='input notice__code' value={notice.code} />}
  </div>
);
