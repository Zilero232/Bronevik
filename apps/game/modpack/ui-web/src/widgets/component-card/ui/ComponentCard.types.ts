import type { UiComponent, UiField } from '../../../shared/api/protocol';
import type { useComponentCard } from '../model/hooks';

export type ComponentCardModel = ReturnType<typeof useComponentCard>;

export type ComponentCardProps = {
  component: UiComponent;
  fields?: UiField[];
  forceOpen?: boolean;
};
