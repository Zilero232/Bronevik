import type { ArmorGeometry, ArmorPieceGeometry, Vec3 } from '../armor-model/armor-model.types';
import type { DequantizeInput, PackedHeader, PackedPieceHeader, QuantizeInput } from './geometry.types';

import { ARMOR_GEOMETRY_FORMAT as FORMAT } from './geometry.constants';

const isPackedHeader = (value: unknown): value is PackedHeader =>
  typeof value === 'object' &&
  value !== null &&
  'pieces' in value &&
  Array.isArray(value.pieces) &&
  'mounts' in value &&
  typeof value.mounts === 'object' &&
  value.mounts !== null;

const align = (offset: number): number => Math.ceil(offset / FORMAT.alignment) * FORMAT.alignment;

const bounds = (positions: Float32Array): { min: Vec3; max: Vec3 } => {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];

  for (let index = 0; index < positions.length; index += 1) {
    const axis = index % 3;

    min[axis] = Math.min(min[axis], positions[index]);
    max[axis] = Math.max(max[axis], positions[index]);
  }

  return positions.length === 0 ? { min: [0, 0, 0], max: [0, 0, 0] } : { min, max };
};

const quantize = ({ positions, min, max }: QuantizeInput): Int16Array => {
  const quantized = new Int16Array(positions.length);

  for (let index = 0; index < positions.length; index += 1) {
    const axis = index % 3;
    const span = max[axis] - min[axis];
    const unit = span > 0 ? (positions[index] - min[axis]) / span : 0;

    quantized[index] = Math.round(unit * FORMAT.quantizationSteps) - FORMAT.quantizationOffset;
  }

  return quantized;
};

const dequantize = ({ quantized, min, max }: DequantizeInput): Float32Array => {
  const positions = new Float32Array(quantized.length);

  for (let index = 0; index < quantized.length; index += 1) {
    const axis = index % 3;

    positions[index] = min[axis] + ((quantized[index] + FORMAT.quantizationOffset) / FORMAT.quantizationSteps) * (max[axis] - min[axis]);
  }

  return positions;
};

const isShortIndexed = (vertexCount: number): boolean => vertexCount <= FORMAT.maxShortIndex;

const pieceBytes = (piece: PackedPieceHeader): number =>
  align(piece.vertexCount * 3 * Int16Array.BYTES_PER_ELEMENT) +
  align(piece.indexCount * (isShortIndexed(piece.vertexCount) ? Uint16Array.BYTES_PER_ELEMENT : Uint32Array.BYTES_PER_ELEMENT));

export const encodeArmorGeometry = (geometry: ArmorGeometry): Uint8Array => {
  const pieces = geometry.pieces.map((piece): PackedPieceHeader & { source: ArmorPieceGeometry } => ({
    name: piece.name,
    kind: piece.kind,
    vertexCount: piece.positions.length / 3,
    indexCount: piece.indices.length,
    ...bounds(piece.positions),
    groups: piece.groups,
    source: piece
  }));

  const header: PackedHeader = { mounts: geometry.mounts, pieces: pieces.map(({ source: _source, ...piece }) => piece) };
  const headerBytes = new TextEncoder().encode(JSON.stringify(header));
  const bodyStart = align(FORMAT.prefixBytes + headerBytes.length);
  const buffer = new ArrayBuffer(bodyStart + pieces.reduce((sum, piece) => sum + pieceBytes(piece), 0));
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  bytes.set(FORMAT.magic, 0);
  view.setUint32(4, FORMAT.version, true);
  view.setUint32(8, headerBytes.length, true);
  bytes.set(headerBytes, FORMAT.prefixBytes);

  let offset = bodyStart;

  for (const piece of pieces) {
    new Int16Array(buffer, offset, piece.vertexCount * 3).set(quantize({ positions: piece.source.positions, min: piece.min, max: piece.max }));
    offset = align(offset + piece.vertexCount * 3 * Int16Array.BYTES_PER_ELEMENT);

    const IndexArray = isShortIndexed(piece.vertexCount) ? Uint16Array : Uint32Array;

    new IndexArray(buffer, offset, piece.indexCount).set(piece.source.indices);
    offset = align(offset + piece.indexCount * IndexArray.BYTES_PER_ELEMENT);
  }

  return bytes;
};

export const decodeArmorGeometry = (bytes: Uint8Array): ArmorGeometry => {
  if (bytes.length < FORMAT.prefixBytes || FORMAT.magic.some((value, index) => bytes[index] !== value)) {
    throw new Error('Not an armor geometry payload');
  }

  const { buffer } = Uint8Array.from(bytes);
  const view = new DataView(buffer);
  const version = view.getUint32(4, true);

  if (version !== FORMAT.version) {
    throw new Error(`Unsupported armor geometry version ${version}`);
  }

  const headerLength = view.getUint32(8, true);
  const header: unknown = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, FORMAT.prefixBytes, headerLength)));

  if (!isPackedHeader(header)) {
    throw new Error('Armor geometry header is malformed');
  }

  const expected = align(FORMAT.prefixBytes + headerLength) + header.pieces.reduce((sum, piece) => sum + pieceBytes(piece), 0);

  if (expected > buffer.byteLength) {
    throw new Error('Armor geometry payload is truncated');
  }

  let offset = align(FORMAT.prefixBytes + headerLength);

  const pieces = header.pieces.map(({ name, kind, vertexCount, indexCount, min, max, groups }): ArmorPieceGeometry => {
    const positions = dequantize({ quantized: new Int16Array(buffer, offset, vertexCount * 3), min, max });

    offset = align(offset + vertexCount * 3 * Int16Array.BYTES_PER_ELEMENT);

    const IndexArray = isShortIndexed(vertexCount) ? Uint16Array : Uint32Array;
    const indices = Uint32Array.from(new IndexArray(buffer, offset, indexCount));

    offset = align(offset + indexCount * IndexArray.BYTES_PER_ELEMENT);

    return { name, kind, positions, indices, groups };
  });

  return { pieces, mounts: header.mounts };
};

export const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

export const base64ToBytes = (base64: string): Uint8Array => Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
