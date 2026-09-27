import type { usePlayerWrapped, useWrappedShare } from '../../../model/hooks';

type WrappedShare = ReturnType<typeof useWrappedShare>;

export type WrappedOutroProps = Pick<WrappedShare, 'copied' | 'onCopy' | 'onShare'> & Pick<ReturnType<typeof usePlayerWrapped>, 'nickname' | 'years'>;
