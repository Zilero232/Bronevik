"""The texts of a submission: ru/en descriptions, the forum topic title, the changelog and the dependency lists
(our packages, then the third-party runtime mods the player installs separately).

Everything comes from catalog/catalog.json (through the setupkit manifest) and CHANGELOG.md, so the
manager, the site and МОСТ describe a component with the same words. A CHANGELOG.md entry carries one
`### ru` and one `### en` section; an entry without them counts as the same text in both languages.
"""
import io
import os
import re

from most.rules import LANGUAGES, REQUIRED_LANGUAGES, Findings

MODPACK_TITLE = {'ru': 'Три отметки', 'en': 'Three Marks'}
SITE = 'https://triotmetki.ru'
LABELS = {
    'ru': {
        'fair_play': 'Честная игра',
        'dependencies': 'Зависимости',
        'no_dependencies': 'Нет: ставится сам по себе.',
        'external': 'Сторонние моды: не входят в пакет, ставятся отдельно (менеджер модпака ставит их сам).',
        'external_item': '- %(title)s %(version)s (`%(file)s`, лицензия %(licence)s, автор %(author)s): %(url)s',
        'data': 'Какие данные отправляются',
        'data_text': (
            'Мод ничего не отправляет, пока вы не привяжете его кодом с сайта %s. После привязки уходят только '
            'ваши данные на api.triotmetki.ru по HTTPS; каждую отправку можно выключить в настройках.'
        ) % SITE,
        'install': 'Установка',
        'install_text': 'Через МОСТ. Вручную: скопируйте %s в папку mods/%s/ клиента.',
        'changes': 'Изменения',
        'no_changes': 'Нет записи в CHANGELOG.md.',
        'site': 'Сайт',
    },
    'en': {
        'fair_play': 'Fair play',
        'dependencies': 'Dependencies',
        'no_dependencies': 'None: installs on its own.',
        'external': (
            'Third-party mods: not in the package, installed separately (the modpack manager installs them itself).'
        ),
        'external_item': '- %(title)s %(version)s (`%(file)s`, %(licence)s licence, by %(author)s): %(url)s',
        'data': 'What data is sent',
        'data_text': (
            'The mod sends nothing until you bind it with a code from %s. Once bound, only your own data goes to '
            'api.triotmetki.ru over HTTPS; every kind of upload can be switched off in the settings.'
        ) % SITE,
        'install': 'Installation',
        'install_text': 'Through МОСТ. By hand: copy %s into the client\'s mods/%s/ folder.',
        'changes': 'Changes',
        'no_changes': 'No CHANGELOG.md entry.',
        'site': 'Site',
    },
}
# Components that send data to the site: their pages say what and when.
DATA_CATEGORY = 'data'
DATA_COMPONENTS = ('companion',)
HEADING = re.compile(r'^##\s+(?:(?P<id>[a-z][a-z0-9_]*)\s+)?v?(?P<version>\d+\.\d+\.\d+)\s*$')
LANGUAGE_HEADING = re.compile(r'^###\s+(?P<language>%s)\s*$' % '|'.join(LANGUAGES))


def forum_title(game_version, component, language='ru'):
    """«[1.45.0.0] Три отметки — Ядро»: the section's title format (client version first)."""
    return '[%s] %s — %s' % (game_version, MODPACK_TITLE[language], getattr(component.title, language))


def _entry_texts(lines):
    """{language: text} of one entry: its `### ru` / `### en` sections, else the whole text for every language."""
    sections = {}
    language = None
    for line in lines:
        match = LANGUAGE_HEADING.match(line)
        if match:
            language = match.group('language')
            sections.setdefault(language, [])
        else:
            sections.setdefault(language, []).append(line)
    untagged = '\n'.join(sections.pop(None, [])).strip()
    if not sections:
        return dict((language, untagged) for language in LANGUAGES) if untagged else {}
    texts = dict((language, '\n'.join(body).strip()) for language, body in sections.items())
    return dict((language, text) for language, text in texts.items() if text)


def parse_changelog(text):
    """{(component id or None, version): {language: text}} from `## <id> <version>` / `## <version>` headings."""
    entries = {}
    key = None
    lines = []
    for line in text.splitlines():
        match = HEADING.match(line)
        if match or line.startswith('## ') or line.startswith('# '):
            if key is not None:
                entries[key] = _entry_texts(lines)
            key = (match.group('id'), match.group('version')) if match else None
            lines = []
        elif key is not None:
            lines.append(line)
    if key is not None:
        entries[key] = _entry_texts(lines)
    return entries


def load_changelog(path):
    if not path or not os.path.isfile(path):
        return {}
    with io.open(path, encoding='utf-8') as handle:
        return parse_changelog(handle.read())


def changelog_entry(changelog, component):
    """{language: text} of the component's own entry, else of the modpack-wide one for its version, else None."""
    for key in ((component.id, component.version), (None, component.version)):
        texts = changelog.get(key)
        if texts:
            return texts
    return None


def changes_text(changes, language):
    """The entry's text in `language`, else in the other language; None without an entry."""
    if not changes:
        return None
    if changes.get(language):
        return changes[language]
    return next((changes[other] for other in LANGUAGES if changes.get(other)), None)


def changelog_markdown(component, changes):
    """The component's entry the way CHANGELOG.md holds it: `## <id> <version>`, then a section per language."""
    lines = ['## %s %s' % (component.id, component.version), '']
    for language in LANGUAGES:
        text = (changes or {}).get(language)
        if text:
            lines += ['### %s' % language, '', text, '']
    return '\n'.join(lines)


def dependency_list(component, manifest):
    """[{id, packageId, version, title: {ru, en}}] in the component's order."""
    items = []
    for key in component.dependencies:
        dependency = manifest.component(key)
        items.append({
            'id': key,
            'packageId': dependency.package_id,
            'version': dependency.version,
            'title': dict((language, getattr(dependency.title, language)) for language in LANGUAGES),
        })
    return items


def external_dependency_list(component, manifest):
    """[{id, packageId, version, file, title: {ru, en}, author, licence, url}]:
    the third-party mods the component needs."""
    return [{
        'id': dependency.id,
        'packageId': dependency.package_id,
        'version': dependency.version,
        'file': dependency.file,
        'title': dict((language, getattr(dependency.title, language)) for language in LANGUAGES),
        'author': dependency.author.name,
        'licence': dependency.licence.name,
        'url': dependency.author.url,
    } for dependency in manifest.dependencies_of(component.id)]


def sends_data(component):
    return component.category == DATA_CATEGORY or component.id in DATA_COMPONENTS


def _dependency_line(item, language):
    return '- %s (`%s` %s)' % (item['title'][language], item['packageId'], item['version'])


def description(component, manifest, language, game_version, changes):
    """The mod page text in one language (Markdown: the forum and МОСТ both take plain paragraphs)."""
    labels = LABELS[language]
    lines = ['# %s' % forum_title(game_version, component, language), '', getattr(component.description, language), '']
    lines += ['## %s' % labels['fair_play'], '', getattr(component.fair_play, language), '']
    if sends_data(component):
        lines += ['## %s' % labels['data'], '', labels['data_text'], '']
    lines += ['## %s' % labels['dependencies'], '']
    dependencies = dependency_list(component, manifest)
    external = external_dependency_list(component, manifest)
    if dependencies:
        lines += [_dependency_line(item, language) for item in dependencies]
    if external:
        lines += ['', labels['external']] if dependencies else [labels['external']]
        lines += [labels['external_item'] % dict(item, title=item['title'][language]) for item in external]
    if not dependencies and not external:
        lines.append(labels['no_dependencies'])
    lines += ['', '## %s' % labels['install'], '', labels['install_text'] % (component.file, game_version), '']
    lines += ['## %s' % labels['changes'], '', changes_text(changes, language) or labels['no_changes'], '']
    lines += ['%s: %s' % (labels['site'], SITE)]
    return '\n'.join(lines) + '\n'


def _check_catalog_texts(component, findings):
    for language in LANGUAGES:
        is_required = language in REQUIRED_LANGUAGES
        for field in ('title', 'description', 'fair_play'):
            if getattr(getattr(component, field), language).strip():
                continue
            message = 'no %s %s in catalog/catalog.json' % (language, field)
            if is_required:
                findings.error(component.id, message, 'most_topic')
            else:
                findings.warn(component.id, message, 'ours')


def _check_changes(component, changes, findings):
    version = component.version
    if not changes:
        message = 'no CHANGELOG.md entry for %s (## %s %s or ## %s)' % (version, component.id, version, version)
        findings.warn(component.id, message, 'most_criteria')
        return
    for language in REQUIRED_LANGUAGES:
        if not changes.get(language):
            message = 'the CHANGELOG.md entry for %s has no ### %s text' % (version, language)
            findings.warn(component.id, message, 'most_topic')


def check_texts(component, changes):
    findings = Findings()
    _check_catalog_texts(component, findings)
    if not component.catalogued:
        findings.error(component.id, 'no catalog entry: the page would carry the package description only', 'ours')
    _check_changes(component, changes, findings)
    return findings
