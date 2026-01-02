import { pointId, type PointId } from './Point';
import { labelId, type LabelId } from './Label';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';
import { z } from 'zod';

/** Represents the table public.point_label */
export default interface PointLabelTable {
  pointId: ColumnType<PointId, PointId, PointId>;

  labelId: ColumnType<LabelId, LabelId, LabelId>;

  userId: ColumnType<string, string, string>;

  sortOrder: ColumnType<number, number, number>;

  createdAt: ColumnType<number, number, number>;

  updatedAt: ColumnType<number, number, number>;
}

export type PointLabel = Selectable<PointLabelTable>;

export type NewPointLabel = Insertable<PointLabelTable>;

export type PointLabelUpdate = Updateable<PointLabelTable>;

export const pointLabel = z.object({
  pointId: pointId,
  labelId: labelId,
  userId: z.string(),
  sortOrder: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const pointLabelInitializer = z.object({
  pointId: pointId,
  labelId: labelId,
  userId: z.string(),
  sortOrder: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const pointLabelMutator = z.object({
  pointId: pointId.optional(),
  labelId: labelId.optional(),
  userId: z.string().optional(),
  sortOrder: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});