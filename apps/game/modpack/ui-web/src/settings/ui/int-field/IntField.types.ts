import type { UiField } from '../../model/protocol';
import type { FieldProps } from '../field';

export type IntFieldProps = FieldProps<Extract<UiField, { type: 'int' }>>;
