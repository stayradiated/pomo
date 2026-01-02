import { userId, type UserId } from './User';
import { streamId, type StreamId } from './Stream';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.point */
export type PointId = string & { __brand: 'public.point' };

/** Represents the table public.point */
export default interface PointTable {
  id: ColumnType<PointId, PointId, PointId>;

  userId: ColumnType<UserId, UserId, UserId>;

  streamId: ColumnType<StreamId, StreamId, StreamId>;

  value: ColumnType<string, string, string>;

  startedAt: ColumnType<number, number, number>;

  createdAt: ColumnType<number, number, number>;

  updatedAt: ColumnType<number, number, number>;
}

export type Point = Selectable<PointTable>;

export type NewPoint = Insertable<PointTable>;

export type PointUpdate = Updateable<PointTable>;

export const pointId = z.string() as unknown as z.Schema<PointId>;

export const point = z.object({
  id: pointId,
  userId: userId,
  streamId: streamId,
  value: z.string(),
  startedAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const pointInitializer = z.object({
  id: pointId,
  userId: userId,
  streamId: streamId,
  value: z.string(),
  startedAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const pointMutator = z.object({
  id: pointId.optional(),
  userId: userId.optional(),
  streamId: streamId.optional(),
  value: z.string().optional(),
  startedAt: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});