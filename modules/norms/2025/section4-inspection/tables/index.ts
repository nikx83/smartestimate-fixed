/**
 * Путь: /modules/norms/2025/section4-inspection/tables/index.ts
 * Назначение: Центральный экспорт всех таблиц обследований
 * Описание: Упрощает импорт таблиц в расчётных модулях
 */

// Одноэтажные промышленные здания
export { TABLE_1604_0301_01, metadata as metadata_1604_0301 } from './table-1604-0301-01';
export { TABLE_1604_0302_01, metadata as metadata_1604_0302 } from './table-1604-0302-01';
export { TABLE_1604_0303_01, metadata as metadata_1604_0303 } from './table-1604-0303-01';

// Многоэтажные промышленные здания
export { TABLE_1604_0304_01, metadata as metadata_1604_0304 } from './table-1604-0304-01';
export { TABLE_1604_0305_01, metadata as metadata_1604_0305 } from './table-1604-0305-01';
export { TABLE_1604_0306_01, metadata as metadata_1604_0306 } from './table-1604-0306-01';

// Типы
export type { InspectionPrice } from './table-1604-0301-01';

/**
 * Маппинг таблиц по категориям и этажности
 */
export const INSPECTION_TABLES = {
  single: {
    I: 'TABLE_1604_0301_01',
    II: 'TABLE_1604_0302_01',
    III: 'TABLE_1604_0303_01'
  },
  multi: {
    I: 'TABLE_1604_0304_01',
    II: 'TABLE_1604_0305_01',
    III: 'TABLE_1604_0306_01'
  }
} as const;
