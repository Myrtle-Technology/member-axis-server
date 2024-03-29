import { FindConditions, ObjectLiteral } from 'typeorm';

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

export type Column<T, D extends number = 2> = [D] extends [never]
  ? never
  : T extends Record<string, any>
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends Date
          ? `${K}`
          : T[K] extends Array<infer U>
          ? `${K}` | Join<K, Column<U, Prev[D]>>
          : `${K}` | Join<K, Column<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';

export type RelationColumn<T> = Extract<
  Column<T>,
  {
    [K in Column<T>]: K extends `${infer R}.${string}` ? R : never;
  }[Column<T>]
>;

export type Order<T> = [Column<T>, 'ASC' | 'DESC'];
export type SortBy<T> = Order<T>[];

export type FindOptionsWhere<Entity> =
  | FindConditions<Entity>[]
  | FindConditions<Entity>
  | ObjectLiteral
  | string;
