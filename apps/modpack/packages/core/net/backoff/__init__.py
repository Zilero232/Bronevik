"""Exponential retry backoff with jitter, shared by the ingest outbox and the replay upload queue."""


def backoff_delay(attempt, base_s, max_s, jitter, rng, retry_after=None):
    """Seconds to wait before retry number `attempt` (1-based): base * 2^(attempt-1) capped at `max_s`,
    spread by +-`jitter` with `rng()` in [0, 1); a longer Retry-After wins (still capped)."""
    delay = min(max_s, base_s * (2 ** (attempt - 1)))
    delay *= 1.0 + jitter * (2.0 * rng() - 1.0)
    if retry_after is not None and retry_after > delay:
        delay = min(max_s, float(retry_after))
    return delay
