import { userId, type UserId } from './User';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';
import { z } from 'zod';

/** Identifier type for public.stream */
export type StreamId = string & { __brand: 'public.stream' };

/** Represents the table public.stream */
export default interface StreamTable {
  id: ColumnType<StreamId, StreamId, StreamId>;

  userId: ColumnType<UserId, UserId, UserId>;

  name: ColumnType<string, string, string>;

  index: ColumnType<number, number, number>;

  parentId: ColumnType<StreamId | null, StreamId | null, StreamId | null>;

  createdAt: ColumnType<number, number, number>;

  updatedAt: ColumnType<number, number, number>;
}

export type Stream = Selectable<StreamTable>;

export type NewStream = Insertable<StreamTable>;

export type StreamUpdate = Updateable<StreamTable>;

export const streamId = z.string() as unknown as z.Schema<StreamId>;

export const stream = z.object({
  id: streamId,
  userId: userId,
  name: z.string(),
  index: z.number(),
  parentId: streamId.nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const streamInitializer = z.object({
  id: streamId,
  userId: userId,
  name: z.string(),
  index: z.number(),
  parentId: streamId.optional().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const streamMutator = z.object({
  id: streamId.optional(),
  userId: userId.optional(),
  name: z.string().optional(),
  index: z.number().optional(),
  parentId: streamId.optional().nullable(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});