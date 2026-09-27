"""What a МОСТ submission is checked against. Every rule names where it comes from.

Lesta publishes no author portal, API or package spec for МОСТ (checked 2026-09-27; mods.lesta.ru answers
403 to anonymous requests). A mod gets in by being proposed in the МОСТ forum topic, and the "source" the
curators read is normally a publication in the forum section «Модификации клиента». So the rules are the
МОСТ curators' criteria plus the section's publication rules plus the client's package format; where
nothing is published (image sizes) the value is ours and marked as such. docs/ops/most-publishing.md has
the full list with links.
"""
import re

SOURCES = {
    'most_criteria': 'https://forum.tanki.su/topic/2205036-all-%D0%BC%D0%BE%D1%81%D1%82/page/7/',
    'most_topic': 'https://forum.tanki.su/topic/2205036-all-%D0%BC%D0%BE%D1%81%D1%82/',
    'publication_rules': 'https://forum.tanki.su/topic/2200656-правила-публикации-модификаций/',
    'forbidden': 'https://forum.tanki.su/topic/2200660-категории-запрещенных-модификаций-игрового-кл/',
    'mtmod': 'https://forum.tanki.su/topic/2204726-mtmod/',
    'wotstat_packaging': 'https://docs.wotstat.info/guide/first-steps/environment/python/',
    'ours': 'apps/game/modpack (our own convention, no published МОСТ value)',
}

# Lesta clients from 1.35 load .mtmod from mods/<client version>/ (SOURCES['mtmod']).
PACKAGE_EXTENSION = '.mtmod'
# Forum topic titles start with the client version, "[1.33.0.0] Name" (SOURCES['publication_rules']).
GAME_VERSION = re.compile(r'^\d+\.\d+\.\d+\.\d+$')
# meta.xml fields the client and installers read; `<id>_<version>.mtmod` is the file naming the mod
# docs use (SOURCES['wotstat_packaging']) and tools/build/archive.file_name writes.
META_FIELDS = ('id', 'version', 'name', 'description')
PACKAGE_ID = re.compile(r'^[a-z0-9]+(\.[a-z0-9_]+)+$')
VERSION = re.compile(r'^\d+\.\d+\.\d+$')
# At most 3 screenshots in a publication (SOURCES['publication_rules']); a preview must exist (MOST shows
# an image and a video per mod, SOURCES['most_topic']).
MAX_SCREENSHOTS = 3
# 16:9 like the installer previews; МОСТ publishes no size (SOURCES['ours']).
PREVIEW_SIZES = ((1280, 720), (640, 360))
# The МОСТ interface is Russian and Belarusian (SOURCES['most_topic']); ru is required, en is for our site.
REQUIRED_LANGUAGES = ('ru',)
LANGUAGES = ('ru', 'en')
# Mods are updated within 7 days of a client update or archived (SOURCES['publication_rules']).
UPDATE_DAYS = 7
# The production client loads only .pyc; a release package with .py sources does not start.
SOURCE_SUFFIX = '.py'
BYTECODE_SUFFIX = '.pyc'


class Problem(object):
    """One finding. `error` blocks the submission; a warning is for the person submitting."""

    def __init__(self, where, message, rule, error=True):
        self.where = where
        self.message = message
        self.rule = rule
        self.error = error

    def to_json(self):
        return {'where': self.where, 'message': self.message, 'rule': SOURCES[self.rule], 'level': 'error' if self.error else 'warning'}

    def __str__(self):
        return '%s %s: %s' % ('ERROR' if self.error else 'WARNING', self.where, self.message)


class Findings(object):

    def __init__(self):
        self.items = []

    def error(self, where, message, rule):
        self.items.append(Problem(where, message, rule, True))

    def warn(self, where, message, rule):
        self.items.append(Problem(where, message, rule, False))

    def extend(self, other):
        self.items.extend(other.items)

    @property
    def errors(self):
        return [item for item in self.items if item.error]

    @property
    def warnings(self):
        return [item for item in self.items if not item.error]
