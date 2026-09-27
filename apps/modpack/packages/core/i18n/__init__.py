from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import to_text
from .constants import DEFAULT_LANGUAGE, RUSSIAN_READERS  # noqa: F401


class Catalog(object):
    """Strings by language. The companion and each feature add their own tables; later keys win."""

    def __init__(self, *tables):
        self.strings = {}
        for table in tables:
            self.add(table)

    def add(self, table):
        for language, entries in table.items():
            self.strings.setdefault(language, {}).update(entries)
        return self

    def __contains__(self, language):
        return language in self.strings

    def lookup(self, language, key):
        return self.strings.get(language, {}).get(key) or self.strings.get(DEFAULT_LANGUAGE, {}).get(key)


def resolve_language(catalog, preferred, client_language=None):
    if preferred in catalog:
        return preferred
    if client_language:
        code = to_text(client_language).lower()[:2]
        if code in RUSSIAN_READERS:
            return 'ru'
        if code in catalog:
            return code
    return DEFAULT_LANGUAGE


class Translator(object):

    def __init__(self, catalog, language=DEFAULT_LANGUAGE):
        self.catalog = catalog
        self.language = language if language in catalog else DEFAULT_LANGUAGE

    def __call__(self, key, **params):
        text = self.catalog.lookup(self.language, key) or to_text(key)
        if params:
            return text.format(**params)
        return text
