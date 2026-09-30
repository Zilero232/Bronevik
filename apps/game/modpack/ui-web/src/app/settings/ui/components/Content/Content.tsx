import type { ContentProps } from './Content.types';

import { SECTION } from '../../../../../entities/window-state';
import { AccountCard } from '../../../../../widgets/account';
import { ComponentCard } from '../../../../../widgets/component-card';
import { SearchPage, SectionCards, SectionPage } from '../../../../../widgets/component-list';
import { HudEditor } from '../../../../../widgets/hud-editor';
import { Profiles } from '../../../../../widgets/profiles';
import { ReplaysIntro } from '../ReplaysIntro';
import { ToolPage } from '../ToolPage';

export const Content = ({ state, section, searching, columns }: ContentProps) => {
  if (searching) {
    return <SearchPage card={ComponentCard} columns={columns} />;
  }

  if (section === SECTION.profiles) {
    return (
      <ToolPage key={section} section={section}>
        <Profiles profiles={state.profiles} />
      </ToolPage>
    );
  }

  if (section === SECTION.hud) {
    return (
      <ToolPage key={section} section={section}>
        <HudEditor panels={state.hud.panels} />
        <SectionCards card={ComponentCard} columns={columns} section={section} />
      </ToolPage>
    );
  }

  if (section === SECTION.replays) {
    return <SectionPage key={section} card={ComponentCard} columns={columns} intro={<ReplaysIntro />} section={section} />;
  }

  return <SectionPage key={section} card={ComponentCard} columns={columns} intro={section === SECTION.data && <AccountCard />} section={section} />;
};
