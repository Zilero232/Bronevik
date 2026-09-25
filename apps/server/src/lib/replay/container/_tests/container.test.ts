import { describe, expect, it } from 'vitest';

import { buildReplay } from '../../_tests/replay-builder';
import { ReplayFormatError } from '../../errors';
import { readContainer } from '../container';
import { REPLAY_CONTAINER } from '../container.constants';

describe('readContainer', () => {
  it('reads every JSON block and reports a missing packet stream as null', () => {
    const bytes = buildReplay({ blocks: [{ a: 1 }, [2, 3]] });
    const container = readContainer(bytes);

    expect(container.magic).toBe(REPLAY_CONTAINER.magic);
    expect(container.blocks.map((block) => new TextDecoder().decode(block))).toEqual(['{"a":1}', '[2,3]']);
    expect(container.stream).toBeNull();
  });

  it('exposes the stream sizes announced after the blocks', () => {
    const container = readContainer(buildReplay({ blocks: [{}], packets: [new Uint8Array(16)] }));

    expect(container.stream?.decompressedSize).toBe(16);
    expect(container.stream?.data.byteLength).toBeGreaterThanOrEqual(container.stream?.compressedSize ?? 0);
    expect((container.stream?.data.byteLength ?? 0) % 8).toBe(0);
  });

  it('rejects a file with the wrong magic', () => {
    const bytes = buildReplay({ blocks: [{}] });

    bytes[0] = 0;

    expect(() => readContainer(bytes)).toThrow(ReplayFormatError);
  });

  it('rejects a file too short to hold a header', () => {
    expect(() => readContainer(new Uint8Array(4))).toThrow(ReplayFormatError);
  });

  it('rejects a block that runs past the end of the file', () => {
    const bytes = buildReplay({ blocks: [{ key: 'value' }] });

    expect(() => readContainer(bytes.subarray(0, bytes.byteLength - 3))).toThrow(/does not fit/);
  });

  it('rejects an implausible block count', () => {
    const bytes = buildReplay({ blocks: [{}] });

    new DataView(bytes.buffer, bytes.byteOffset).setUint32(4, REPLAY_CONTAINER.maxBlocks + 1, true);

    expect(() => readContainer(bytes)).toThrow(/block count/);
  });
});
