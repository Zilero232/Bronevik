import type { FunctionComponent } from 'react';

export type MountInput<Props> = { Component: FunctionComponent<Props>; props: Props };
