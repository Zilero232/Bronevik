export const ENGINE_PROBE = {
  handlers: ['oninput', 'onfocusin', 'onfocusout', 'onmouseover', 'onmouseout', 'onwheel'],
  hosts: ['MessageChannel', 'setImmediate', 'queueMicrotask']
} as const;
