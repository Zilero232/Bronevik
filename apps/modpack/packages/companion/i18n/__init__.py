# -*- coding: utf-8 -*-
from ...core.i18n import DEFAULT_LANGUAGE, Catalog
from ...core.i18n import Translator as CatalogTranslator
from ...core.i18n import resolve_language as resolve_catalog_language
from .strings import STRINGS  # noqa: F401


# Features add their strings here when they attach (see core.registry).
CATALOG = Catalog(STRINGS)


def resolve_language(preferred, client_language=None, catalog=CATALOG):
    return resolve_catalog_language(catalog, preferred, client_language)


class Translator(CatalogTranslator):
    """A translator over the companion catalog (features' strings included once they attach)."""

    def __init__(self, language=DEFAULT_LANGUAGE, catalog=CATALOG):
        CatalogTranslator.__init__(self, catalog, language)
