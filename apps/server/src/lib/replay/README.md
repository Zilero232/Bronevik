# lib/replay

Reads «Мир танков» (Lesta) `.mtreplay` files and World of Tanks (WG) `.wotreplay` files. The two games use the same container.

The library has two layers:

1. **Header** (`parseReplay`, `parseReplaySummary`). Reads the plain JSON blocks and returns a normalised, zod-validated `ReplaySummary`. It never decrypts the packet stream, so it is cheap even on a 50 MB file. A prefix of the file that holds the JSON blocks is enough.
2. **Packets** (`parsePackets`). Best effort. Decrypts and inflates the packet stream, walks every packet and decodes the common ones. Packets it cannot decode come back raw.

Input is a `Uint8Array` (a Node/Bun `Buffer` works) or an `ArrayBuffer`. Errors in the container are thrown as `ReplayFormatError`.

## Usage

```ts
import { collectTracks, parsePackets, parseReplay } from '../lib/replay';

const bytes = await Bun.file('battle.mtreplay').bytes();

const { summary, warnings } = parseReplay(bytes);

summary.map.name; // 'Прохоровка'
summary.isComplete; // false when the replay has no battle-results block
summary.recorder; // { accountId, name, vehicleId, vehicleType, team }
summary.players; // both teams, each with result: PlayerResult | null

const { packets, support, battleStartTime } = parsePackets({ replay: bytes, kinds: ['position', 'chat', 'healthChanged'] });

const vehicleIds = new Set(summary.players.map((player) => player.vehicleId));
const tracks = collectTracks({ packets, vehicleIds }); // Map<vehicleId, TrackPoint[]>
```

### `ReplaySummary`

| Field                                           | Source                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `game`                                          | `'lesta'`, `'wg'` or `'unknown'`, from the title in `clientVersionFromXml` («Мир танков» / «World of Tanks»)                   |
| `clientVersion`                                 | `{ xml, exe, numbers: [a, b, c, d], label }`                                                                                   |
| `region`, `server`                              | `regionCode`, `serverName`                                                                                                     |
| `map`                                           | `{ id: mapName, name: mapDisplayName, arenaTypeId }`                                                                           |
| `mode`, `battleType`                            | `gameplayID` (`ctf`, `domination`, …) and the numeric arena bonus type                                                         |
| `dateTime`, `startedAt`                         | the raw `dd.mm.yyyy HH:MM:SS` in the client's local time, and the same value as `YYYY-MM-DDTHH:mm:ss` with no time zone        |
| `arenaCreatedAt`                                | ISO UTC, from the results block                                                                                                |
| `durationSeconds`, `winnerTeam`, `finishReason` | results `common` (`winnerTeam` 0 is a draw)                                                                                    |
| `outcome`                                       | `'win'`, `'loss'` or `'draw'` for the recorder                                                                                 |
| `arenaUniqueId`                                 | a string, because the id is wider than 2^53                                                                                    |
| `players[]`                                     | `vehicleId` (the arena entity id), `accountId`, `name`, `clanTag`, `team`, `vehicleType` (`nation:tag`), `tankId`, `maxHealth` |
| `players[].result`                              | damage, radio/track/stun assist, blocked, received, spotted, frags, XP, credits, shots, hits, penetrations, survived, killer   |

`tankId` is the vehicle's `typeCompDescr`, which is the same number as `tank_id` in the Lesta/WG API. Without a results block we only know `vehicleType`, so `tankId` and `accountId` are `null` for everyone but the recorder (`accountId` comes from `playerID`). For the recorder, `xp` and `credits` come from the personal block.

## Container format

All integers are little-endian.

```
u32  magic               0x11343212 (file bytes 12 32 34 11)
u32  blockCount          1 = incomplete replay, 2 = with battle results
repeat blockCount:
  u32  size
  byte json[size]        UTF-8 JSON
u32  decompressedSize    size of the inflated packet stream
u32  compressedSize      size of the zlib stream before encryption padding
byte encrypted[...]      Blowfish-ECB, zero-padded to a multiple of 8
```

- **Block 1**: the arena at battle start. It holds `clientVersionFromXml`, `clientVersionFromExe`, `mapName`, `mapDisplayName`, `gameplayID`, `battleType`, `dateTime`, `playerID`, `playerName`, `playerVehicle`, `serverName`, `regionCode`, and `vehicles`, keyed by arena vehicle id with `name`, `vehicleType`, `team`, `clanAbbrev` and `maxHealth`.
- **Block 2** (optional): a three-element array. The elements are the battle results (`arenaUniqueID`, `common`, `personal`, `players`, `vehicles`, `avatars`), the arena vehicles again with end-of-battle state, and frag counts per vehicle. Python writes `NaN`/`Infinity` into some versions. The parser turns them into `null` and keeps `arenaUniqueID` exact.
- Extra blocks that are not battle results are kept in `header.extraBlocks`.

### Packet stream

The stream is decrypted in 8-byte blocks with Blowfish ECB. The key is `DE72BEA0DE04BEB1DEFEBEEFDEADBEEF`. Each decrypted block is then XORed with the previous plaintext block (`p[i] ^= p[i - 8]`). The first `compressedSize` bytes are a zlib stream, and inflating it gives the packets:

```
u32  payloadSize
u32  type
f32  clock               seconds since the replay started
byte payload[payloadSize]
```

The stream ends with a packet of type `0xFFFFFFFF`.

| Type         | `kind`                                        | Decoded fields                                                                                                                         |
| ------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `0x00`       | `basePlayerCreate`                            | `entityId`, `entityTypeId`, raw `data`                                                                                                 |
| `0x05`       | `entityCreate`                                | `entityId`, `entityTypeId`, `vehicleId`, `spaceId`, `position`, `direction`, raw `data`                                                |
| `0x07`       | `entityProperty`                              | `entityId`, `propertyId`, raw `value`                                                                                                  |
| `0x08`       | `entityMethod`                                | `entityId`, `methodId`, raw `args`                                                                                                     |
| `0x08`       | `healthChanged` (Vehicle.onHealthChanged)     | `vehicleId`, `newHealth`, `oldHealth`, `attackerId`, `attackReason`, `damage`, `destroyed`                                             |
| `0x08`       | `shot` (Vehicle.showShooting)                 | `vehicleId`, `burstCount`, `gunIndex`                                                                                                  |
| `0x08`       | `damageFromShot` (Vehicle.showDamageFromShot) | `vehicleId`, `attackerId`, `hitPoints`, `effectsIndex`                                                                                 |
| `0x0A`       | `position`                                    | `entityId`, `vehicleId` (the vehicle the entity rides, 0 for vehicles themselves), `position`, `positionError`, `yaw`, `pitch`, `roll` |
| `0x16`       | `battlePeriod`                                | `period` (1 waiting, 2 prebattle, 3 battle, 4 after battle). The first `3` sets `battleStartTime`                                      |
| `0x18`       | `gameVersion`                                 | `version`                                                                                                                              |
| `0x23`       | `chat`                                        | `html` as sent, `text` with the tags removed                                                                                           |
| `0xFFFFFFFF` | `endOfStream`                                 | –                                                                                                                                      |
| other        | `unknown`                                     | raw `payload`; `error` is set if a known type failed to decode                                                                         |

Method ids inside `0x08` change from one client version to the next. A method is decoded only when the entity is a vehicle from block 1 and the method id is known. The ids come from the built-in WG table (`WG_VEHICLE_METHOD_IDS`) or from the `methodIds` option. Before 1.11.1, `onHealthChanged` carries no `oldHealth`, so `damage` is worked out from the last known health. It is `null` until that is known.

## Supported versions

`parsePackets` returns `support: { status, game, version, methodIds, methodIdSource, notes }`:

- **`verified`**: WG clients 0.9.14 to 1.26.1.1. The container, framing, positions, chat, period, and the three Vehicle methods (from the table) were checked against real replays. On the 1.26.0.2 fixture, the recorder's damage summed from `healthChanged` equals `damageDealt` in the battle results.
- **`best-effort`**: Lesta clients, and WG clients newer than 1.26.1.1. We assume the framing and the `0x05`/`0x0A`/`0x16`/`0x18`/`0x23` layouts are unchanged; Lesta forked from the same BigWorld code base. Vehicle methods stay raw unless you pass `methodIds`. You can get the ids from the `Vehicle.def` of the matching Lesta client.
- **`unsupported`**: clients older than 0.9.14 (the entity-create layout and the version packet differ). Every packet is returned as `unknown` with its raw payload. The header layer still works.

**Lesta versions verified against real `.mtreplay` files: none yet.** We found no permissively licensed Lesta replay to use as a fixture. The Lesta paths are covered by synthetic replays built with the real container layout (`_tests/replay-builder.ts`). The header layout (block order, key names) is the same as WG's. Add a real `.mtreplay` fixture before you rely on the packet layer for Lesta.

## Licences

See [NOTICE](./NOTICE). We ported the format knowledge and the WG method-id table from `rajesh-rahul/wot-battle-results-parser` (MIT); the two real replay fixtures also come from that repository. `evido/wotreplay-parser` (BSD-3) was consulted. `uwuny/mtreplay-analyzer` (AGPL-3.0) was read only, and nothing from it was copied.
