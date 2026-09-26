import type { BuildUsage, ProvisionOption, ProvisionPick } from '@otmetki/schemas';

import { entries, firstBy, groupBy, sortBy, sumBy, take } from 'remeda';

import { EQUIP_TILE, equipCategory } from '@/entities/tank/build';

import type {
  CrewColumnsInput,
  CrewColumnView,
  EquipmentMatrixInput,
  FamilyScore,
  FamilyTileInput,
  FieldModPairView,
  FieldModRingInput,
  OptionShareInput,
  PickTileInput,
  ShellMixInput,
  ShellMixPart,
  ShowcaseEquipmentColumn,
  ShowcaseTile
} from './showcase.types';

const familyOf = (option: ProvisionOption) => option.group ?? option.tag;

const equipmentPicks = (usage: BuildUsage): ProvisionPick[] => usage.equipment.flatMap(({ picks }) => picks);

const optionShare = ({ usage, optionId }: OptionShareInput): number | null => {
  const share = sumBy(
    equipmentPicks(usage).filter(({ option }) => option.id === optionId),
    ({ share: value }) => value
  );

  return share > 0 ? Math.min(share, 1) : null;
};

const familyRanking = (usage: BuildUsage): string[] =>
  sortBy(
    entries(groupBy(equipmentPicks(usage), ({ option }) => familyOf(option))).map(([family, picks]): FamilyScore => ({
      family,
      score: sumBy(picks, ({ share }) => share)
    })),
    [({ score }) => score, 'desc']
  ).map(({ family }) => family);

const familyTile = ({ usage, devices, family, category }: FamilyTileInput): ShowcaseTile | null => {
  const option = devices.find((device) => familyOf(device) === family && equipCategory(device.variant) === category);

  return option ? { id: option.id, name: option.name, image: option.image, category, share: optionShare({ usage, optionId: option.id }) } : null;
};

const pickTile = ({ pick, category }: PickTileInput): ShowcaseTile | null =>
  pick ? { id: pick.option.id, name: pick.option.name, image: pick.option.image, category, share: pick.share } : null;

export const equipmentMatrix = ({ usage, devices, slots }: EquipmentMatrixInput): ShowcaseEquipmentColumn[] => {
  const families = familyRanking(usage);

  if (families.length === 0 || slots === 0) {
    return [];
  }

  const primary = take(families, slots);
  const next = families.at(slots);
  const alternative = next === undefined ? null : [...take(primary, slots - 1), next];
  const [directive, directiveAlternative] = sortBy(usage.directives, [({ share }) => share, 'desc']);

  return EQUIP_TILE.categories
    .map((category) => ({
      category,
      primary: primary.map((family) => familyTile({ usage, devices, family, category })),
      alternative: alternative?.map((family) => familyTile({ usage, devices, family, category })) ?? null,
      directive: pickTile({ pick: directive, category }),
      directiveAlternative: pickTile({ pick: directiveAlternative, category })
    }))
    .filter(({ primary: tiles }) => tiles.some((tile) => tile !== null));
};

export const fieldModRing = ({ steps, usage }: FieldModRingInput): FieldModPairView[] =>
  steps
    .filter(({ options }) => options.length > 1)
    .map((step) => {
      const picks = usage?.fieldModifications.find(({ level }) => level === step.level)?.picks ?? [];
      const top = firstBy(picks, [({ share }) => share, 'desc']);

      return {
        key: step.key,
        level: step.level,
        options: step.options.map((option) => ({
          id: option.id,
          name: option.name,
          image: option.image,
          share: picks.find((pick) => pick.option.id === option.id)?.share ?? null,
          isPicked: top?.option.id === option.id
        }))
      };
    });

export const crewColumns = ({ usage, limit }: CrewColumnsInput): CrewColumnView[] =>
  usage.crew
    .map(({ role, skills }) => ({
      role,
      skills: sortBy(take(sortBy(skills, [({ share }) => share, 'desc']), limit), ({ avgPosition }) => avgPosition).map(
        ({ skill, name, image, share }) => ({ skill, name, image, share })
      )
    }))
    .filter(({ skills }) => skills.length > 0);

export const shellMix = ({ shells }: ShellMixInput): ShellMixPart[] =>
  sortBy(
    shells.filter(({ ammoShare }) => ammoShare > 0),
    [({ ammoShare }) => ammoShare, 'desc']
  ).map(({ shellId, name, kind, isPremium, ammoShare }) => ({ shellId, label: name ?? kind ?? String(shellId), isPremium, ammoShare }));
