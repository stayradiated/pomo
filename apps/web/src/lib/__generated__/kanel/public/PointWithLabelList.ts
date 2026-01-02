import { pointId, type PointId } from './Point';
import { streamId, type StreamId } from './Stream';
import type { ColumnType, Selectable } from 'kysely';
import { z } from 'zod';

/** Represents the view public.point_with_label_list */
export default interface PointWithLabelListTable {
  id: ColumnType<PointId, never, never>;

  streamId: ColumnType<StreamId, never, never>;

  value: ColumnType<string, never, never>;

  startedAt: ColumnType<number, never, never>;

  createdAt: ColumnType<number, never, never>;

  updatedAt: ColumnType<number, never, never>;

  labelIdList: ColumnType<string[], never, never>;
}

export type PointWithLabelList = Selectable<PointWithLabelListTable>;

export const pointWithLabelList = z.object({
  id: pointId,
  streamId: streamId,
  value: z.string(),
  startedAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  labelIdList: z.string(),
});