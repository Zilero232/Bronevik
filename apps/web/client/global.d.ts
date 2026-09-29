import type { RowData } from '@tanstack/react-table';

declare module 'next-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions -- next-intl reads its typed config through interface merging
  interface AppConfig {
    Formats: typeof import('@/shared/i18n').FORMATS;
    Locale: import('@/shared/i18n').Locale;
    Messages: import('@/shared/i18n').Messages;
  }
}

declare module '@tanstack/react-query' {
  // eslint-disable-next-line ts/consistent-type-definitions -- TanStack reads the mutation meta type through interface merging on Register
  interface Register {
    mutationMeta: import('@/shared/api/query-client').MutationFeedbackMeta;
  }
}

declare module 'react' {
  // eslint-disable-next-line ts/consistent-type-definitions -- CSS custom properties are added to React's CSSProperties by interface merging
  interface CSSProperties {
    [key: `--${string}`]: number | string | undefined;
  }
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line ts/consistent-type-definitions -- column meta is typed by interface merging and must keep the library's generics
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'center' | 'end' | 'start';
    bar?: ColumnBarMeta;
    hideBelow?: 'lg' | 'md' | 'sm' | 'xl';
    isMedia?: boolean;
    isNumeric?: boolean;
    isRank?: boolean;
    isSticky?: boolean;
    width?: number | string;
  }

  // eslint-disable-next-line ts/consistent-type-definitions -- table meta is typed by interface merging and must keep the library's generics
  interface TableMeta<TData extends RowData> {
    pinnedRowIds?: readonly string[];
  }

  type ColumnBarMeta = {
    max?: number;
    tone?: import('@/ui-kit/atoms/ProgressBar/ProgressBar.types').ProgressTone;
  };
}
