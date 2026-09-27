"""The components manifest model: the hand-written catalog (input) and components.json (output).

components.json is camelCase JSON for the installer build and the future manager app; the catalog uses
the same spelling. Plain frozen dataclasses: the tooling runs on a bare Python 3 (tools/run_tests.py).
"""
import dataclasses
import re
from dataclasses import dataclass
from typing import Optional, Tuple

SCHEMA_VERSION = 1
LANGUAGES = ('ru', 'en')
ID_PATTERN = re.compile(r'^[a-z][a-z0-9_]*$')


@dataclass(frozen=True)
class Localized:
    ru: str
    en: str


@dataclass(frozen=True)
class Category:
    id: str
    title: Localized
    description: Localized


@dataclass(frozen=True)
class Preset:
    id: str
    title: Localized
    description: Localized
    custom: bool = False


@dataclass(frozen=True)
class Preview:
    """In the catalog `image` is relative to installer/assets; in the manifest, to the manifest's folder."""
    image: Optional[str] = None
    video: Optional[str] = None


@dataclass(frozen=True)
class CatalogEntry:
    """UI metadata of one package key; `dependencies` adds to the package's own (core, companion)."""
    id: str
    category: str
    title: Localized
    description: Localized
    fair_play: Localized
    presets: Tuple[str, ...] = ()
    required: bool = False
    preview: Preview = Preview()
    dependencies: Tuple[str, ...] = ()


@dataclass(frozen=True)
class Catalog:
    categories: Tuple[Category, ...]
    presets: Tuple[Preset, ...]
    components: Tuple[CatalogEntry, ...]
    owned_patterns: Tuple[str, ...]
    fallback_category: str
    fallback_fair_play: Localized

    def entry(self, key):
        return next((entry for entry in self.components if entry.id == key), None)

    @property
    def default_preset(self):
        return self.presets[0].id


@dataclass(frozen=True)
class Component:
    id: str
    package_id: str
    version: str
    file: str
    category: str
    title: Localized
    description: Localized
    fair_play: Localized
    required: bool
    default: bool
    presets: Tuple[str, ...]
    preview: Preview
    dependencies: Tuple[str, ...]
    catalogued: bool
    sha256: Optional[str] = None
    size: Optional[int] = None


@dataclass(frozen=True)
class Manifest:
    modpack_version: str
    platform: str
    extension: str
    categories: Tuple[Category, ...]
    presets: Tuple[Preset, ...]
    components: Tuple[Component, ...]
    owned_patterns: Tuple[str, ...]
    schema_version: int = SCHEMA_VERSION

    def component(self, component_id):
        return next((component for component in self.components if component.id == component_id), None)

    def to_json(self):
        return _to_json(self)


def camel(name):
    head, *rest = name.split('_')
    return head + ''.join(part.title() for part in rest)


def _to_json(value):
    if dataclasses.is_dataclass(value):
        return dict((camel(field.name), _to_json(getattr(value, field.name))) for field in dataclasses.fields(value))
    if isinstance(value, (tuple, list)):
        return [_to_json(item) for item in value]
    return value
