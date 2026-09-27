"""The texts of a submission: ru/en descriptions, the forum topic title, the changelog and the dependency list.

Everything comes from installer/catalog/catalog.json (through the setupkit manifest) and CHANGELOG.md, so
the installer, the site and МОСТ describe a component with the same words.
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
        'data': 'Какие данные отправляются',
        'data_text': ('Мод ничего не отправляет, пока вы не привяжете его кодом с сайта %s. После привязки уходят только ваши '
                      'данные на api.triotmetki.ru по HTTPS; каждую отправку можно выключить в настройках.') % SITE,
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
        'data': 'What data is sent',
        'data_text': ('The mod sends nothing until you bind it with a code from %s. Once bound, only your own data goes to '
                      'api.triotmetki.ru over HTTPS; every kind of upload can be switched off in the settings.') % SITE,
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


def forum_title(game_version, component, language='ru'):
    """«[1.45.0.0] Три отметки — Ядро»: the section's title format (client version first)."""
    return '[%s] %s — %s' % (game_version, MODPACK_TITLE[language], getattr(component.title, language))


def parse_changelog(text):
    """{(component id or None, version): text} from `## <id> <version>` / `## <version>` headings."""
    entries = {}
    key = None
    lines = []
    for line in text.splitlines():
        match = HEADING.match(line)
        if match or line.startswith('## ') or line.startswith('# '):
            if key is not None:
                entries[key] = '\n'.join(lines).strip()
            key = (match.group('id'), match.group('version')) if match else None
            lines = []
        elif key is not None:
            lines.append(line)
    if key is not None:
        entries[key] = '\n'.join(lines).strip()
    return entries


def load_changelog(path):
    if not path or not os.path.isfile(path):
        return {}
    with io.open(path, encoding='utf-8') as handle:
        return parse_changelog(handle.read())


def changelog_entry(changelog, component):
    """The component's own entry, else the modpack-wide one for its version, else None."""
    for key in ((component.id, component.version), (None, component.version)):
        text = changelog.get(key)
        if text:
            return text
    return None


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


def sends_data(component):
    return component.category == DATA_CATEGORY or component.id in DATA_COMPONENTS


def description(component, manifest, language, game_version, changes):
    """The mod page text in one language (Markdown: the forum and МОСТ both take plain paragraphs)."""
    labels = LABELS[language]
    lines = ['# %s' % forum_title(game_version, component, language), '', getattr(component.description, language), '']
    lines += ['## %s' % labels['fair_play'], '', getattr(component.fair_play, language), '']
    if sends_data(component):
        lines += ['## %s' % labels['data'], '', labels['data_text'], '']
    lines += ['## %s' % labels['dependencies'], '']
    dependencies = dependency_list(component, manifest)
    if dependencies:
        lines += ['- %s (`%s` %s)' % (item['title'][language], item['packageId'], item['version']) for item in dependencies]
    else:
        lines.append(labels['no_dependencies'])
    lines += ['', '## %s' % labels['install'], '', labels['install_text'] % (component.file, game_version), '']
    lines += ['## %s' % labels['changes'], '', changes or labels['no_changes'], '']
    lines += ['%s: %s' % (labels['site'], SITE)]
    return '\n'.join(lines) + '\n'


def check_texts(component, changes):
    findings = Findings()
    for language in LANGUAGES:
        required = language in REQUIRED_LANGUAGES
        for field in ('title', 'description', 'fair_play'):
            if not getattr(getattr(component, field), language).strip():
                message = 'no %s %s in installer/catalog/catalog.json' % (language, field)
                if required:
                    findings.error(component.id, message, 'most_topic')
                else:
                    findings.warn(component.id, message, 'ours')
    if not component.catalogued:
        findings.error(component.id, 'no catalog entry: the page would carry the package description only', 'ours')
    if not changes:
        findings.warn(component.id, 'no CHANGELOG.md entry for %s (## %s %s or ## %s)' % (
            component.version, component.id, component.version, component.version), 'most_criteria')
    return findings
