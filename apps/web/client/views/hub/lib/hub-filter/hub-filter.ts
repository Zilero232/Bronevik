import type { FilterHubSectionsInput, HubSectionEntry } from './hub-filter.types';

const normalize = (text: string): string => text.toLocaleLowerCase().replaceAll('ё', 'е').trim();

export const filterHubSections = ({ sections, query }: FilterHubSectionsInput): HubSectionEntry[] => {
  const needle = normalize(query);

  if (!needle) {
    return sections;
  }

  return sections
    .map((section) =>
      normalize(section.title).includes(needle)
        ? section
        : { ...section, items: section.items.filter(({ label, hint }) => normalize(`${label} ${hint}`).includes(needle)) }
    )
    .filter(({ items }) => items.length > 0);
};
