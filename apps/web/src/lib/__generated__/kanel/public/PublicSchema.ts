import type { default as LabelTable } from './Label';
import type { default as UserTable } from './User';
import type { default as StreamTable } from './Stream';
import type { default as PointTable } from './Point';

export default interface PublicSchema {
  label: LabelTable;

  user: UserTable;

  stream: StreamTable;

  point: PointTable;
}