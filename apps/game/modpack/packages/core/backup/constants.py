from __future__ import absolute_import, division, print_function, unicode_literals

# Beside the client's preferences.xml (%APPDATA%\Lesta\MirTankov on Lesta): a modpack installer that wipes
# mods/configs leaves the client's own profile folder alone.
BACKUP_DIR_NAME = 'otmetki_backup'
BACKED_UP_SUFFIX = '.json'
# outbox_<account>.json holds battles waiting to be sent: a stale copy brought back after a wipe would send them again.
SKIPPED_PREFIXES = ('outbox_',)
TEMP_SUFFIX = '.tmp'
# NTFS keeps mtime in 100 ns steps and FAT in 2 s: a copy counts as changed only past this margin.
MTIME_TOLERANCE_S = 0.01
