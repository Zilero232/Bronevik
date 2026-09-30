import { render } from 'preact';

import type { MountOnceInput, Unmount } from './mount-once.types';

import { DOM } from '../../../config';

const mountedHosts = new WeakSet<HTMLElement>();

const createHost = (id: string): HTMLElement => {
  const host = document.createElement(DOM.hostTag);

  host.id = id;
  document.body.appendChild(host);

  return host;
};

export const mountOnce = ({ id, node }: MountOnceInput): Unmount => {
  const existing = document.getElementById(id);

  if (existing && mountedHosts.has(existing)) {
    return () => undefined;
  }

  const host = existing ?? createHost(id);

  mountedHosts.add(host);
  render(node, host);

  return () => {
    render(null, host);
    mountedHosts.delete(host);

    if (!existing) {
      host.parentNode?.removeChild(host);
    }
  };
};
