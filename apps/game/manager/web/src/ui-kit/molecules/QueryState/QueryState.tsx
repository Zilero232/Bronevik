import type { QueryStateProps } from './QueryState.types';

import { Spinner } from '../../atoms';
import { ErrorState } from '../ErrorState';

import s from './QueryState.module.scss';

export const QueryState = <Data,>({ query, loadingLabel, errorTitle, errorMessage, retryLabel, children }: QueryStateProps<Data>) => {
  if (query.isPending) {
    return (
      <div className={s.loading}>
        <Spinner label={loadingLabel} />
      </div>
    );
  }

  if (query.error) {
    return <ErrorState message={errorMessage?.(query.error)} retryLabel={retryLabel} title={errorTitle} onRetry={() => void query.refetch()} />;
  }

  if (query.data === undefined) {
    return null;
  }

  return children(query.data);
};
