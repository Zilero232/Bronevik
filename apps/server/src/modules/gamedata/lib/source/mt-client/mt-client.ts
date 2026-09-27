import type { AssertMtClientInput, CompareEncyclopediaVersionInput, EncyclopediaVersionCheck } from './mt-client.types';

import { MT_CLIENT } from './mt-client.constants';
import { ForeignClientError } from './mt-client.errors';

const releaseLine = (version: string): string =>
  version
    .trim()
    .split('.')
    .slice(0, MT_CLIENT.comparedVersionParts)
    .map((part) => String(Number.parseInt(part, 10)))
    .join('.');

export const assertMtClient = ({ label, version, guid, readme }: AssertMtClientInput): string => {
  if (!version) {
    throw new ForeignClientError(`${label} has no .version_name, so it cannot be proven to be a «${MT_CLIENT.product}» client build`);
  }

  if (!MT_CLIENT.version.test(version)) {
    throw new ForeignClientError(
      `${label} is at ${version}, which is not a «${MT_CLIENT.product}» (${MT_CLIENT.publisher}) 1.x build; World of Tanks (Wargaming) is on 2.x`
    );
  }

  const foreign = readme?.match(MT_CLIENT.foreignGuid)?.[1];

  if (foreign) {
    throw new ForeignClientError(`${label} is built from ${foreign} (Wargaming), not ${guid}`);
  }

  if (readme !== undefined && !readme.includes(guid)) {
    throw new ForeignClientError(`${label} does not name ${guid} in its ${MT_CLIENT.readme}`);
  }

  return version;
};

export const compareEncyclopediaVersion = ({ clientVersion, encyclopediaVersion }: CompareEncyclopediaVersionInput): EncyclopediaVersionCheck => {
  const client = releaseLine(clientVersion);
  const encyclopedia = releaseLine(encyclopediaVersion);

  return { matches: client === encyclopedia, client, encyclopedia };
};
