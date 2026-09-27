"""Helpers for hooking into the game client: client events and method overrides."""

RESTORE_ATTR = '_otmetki_restore'


def subscribe(owner, name, handler):
    """`owner.name += handler` for a client `Event`, spelt as a call so it can be undone with `unsubscribe`."""
    event = getattr(owner, name)
    event += handler
    setattr(owner, name, event)
    return handler


def unsubscribe(owner, name, handler):
    event = getattr(owner, name, None)
    if event is None:
        return False
    try:
        event -= handler
    except Exception:
        return False
    setattr(owner, name, event)
    return True


class Subscriptions(object):
    """Remembers every `subscribe` so `clear()` removes them all (a feature stopping, the mod unloading)."""

    def __init__(self):
        self.items = []

    def add(self, owner, name, handler):
        subscribe(owner, name, handler)
        self.items.append((owner, name, handler))
        return handler

    def clear(self):
        while self.items:
            owner, name, handler = self.items.pop()
            unsubscribe(owner, name, handler)


def _own_value(owner, name):
    """(defined on owner itself, the raw attribute: a staticmethod stays a staticmethod, found through the MRO)."""
    namespace = getattr(owner, '__dict__', {})
    if name in namespace:
        return True, namespace[name]
    for klass in getattr(owner, '__mro__', ())[1:]:
        if name in klass.__dict__:
            return False, klass.__dict__[name]
    return False, getattr(owner, name)


def override(owner, name):
    """Replace `owner.name` with a wrapper that calls `handler(original, *args, **kwargs)`.

    Works for module functions and for class methods (the wrapper receives `self` as the first argument
    after `original`). `restore(owner, name)` puts the original back.
    """
    def decorator(handler):
        had_own, raw = _own_value(owner, name)
        if isinstance(raw, property):
            raise TypeError('override() does not wrap properties: %s' % name)
        original = getattr(owner, name)

        def wrapper(*args, **kwargs):
            return handler(original, *args, **kwargs)

        wrapper.__name__ = getattr(handler, '__name__', name)
        setattr(wrapper, RESTORE_ATTR, (had_own, raw))
        if isinstance(raw, (staticmethod, classmethod)):
            setattr(owner, name, staticmethod(wrapper))
        else:
            setattr(owner, name, wrapper)
        return handler
    return decorator


def restore(owner, name):
    had_own, current = _own_value(owner, name)
    if isinstance(current, staticmethod):
        current = current.__get__(None, owner)
    saved = getattr(current, RESTORE_ATTR, None)
    if not had_own or saved is None:
        return False
    was_own, raw = saved
    if was_own:
        setattr(owner, name, raw)
    else:
        delattr(owner, name)
    return True
