import type { PendingKind } from '../../../../../model/hooks';
import type { DetailsActionProps } from '../../ReplayDetails.types';

export type ConfirmBoxProps = DetailsActionProps & { kind: PendingKind };
