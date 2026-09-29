import type { FunctionComponent } from 'preact';

export type MountInput<Props> = { Component: FunctionComponent<Props>; props: Props };
