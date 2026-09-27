"""Opt-in replay auto-upload: a persistent per-account queue of own battles (`queue`) and the uploader that
runs one upload at a time on a background runner (`upload`, see core.net.transport.BackgroundRunner).

A queued battle waits until the client has finished writing its replay, is located by
`files.find_replay`, and is posted to /replays/mod signed over the raw file bytes.
"""
from .constants import JobResult, Outcome  # noqa: F401
from .files import build_multipart, find_replay, matches, upload_name  # noqa: F401
from .queue import ReplayQueue, classify_upload, uploaded_replay_id  # noqa: F401
from .upload import ReplayUploader, upload_job  # noqa: F401
