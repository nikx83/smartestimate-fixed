/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/index.ts
 * Назначение: Центральный экспорт всех таблиц геодезических работ
 * Описание: Упрощает импорт таблиц в расчётных модулях
 */

// Топографические съёмки
export { TABLE_1601_0101, metadata as metadata_1601_0101 } from './table-1601-0101';
export { TABLE_1601_0102, metadata as metadata_1601_0102 } from './table-1601-0102';
export { TABLE_1601_0103, metadata as metadata_1601_0103 } from './table-1601-0103';
export { TABLE_1601_0104, metadata as metadata_1601_0104 } from './table-1601-0104';

// Разбивочные работы
export { TABLE_1601_0201, metadata as metadata_1601_0201 } from './table-1601-0201';
export { TABLE_1601_0202, metadata as metadata_1601_0202 } from './table-1601-0202';

// Мониторинг деформаций
export { TABLE_1601_0301, metadata as metadata_1601_0301 } from './table-1601-0301';

// Типы
export type { GeodeticPrice } from './table-1601-0101';

/**
 * Маппинг таблиц по типам работ
 */
export const GEODETIC_TABLES = {
  topographic_survey: {
    '1:500': 'TABLE_1601_0101',
    '1:1000': 'TABLE_1601_0102',
    '1:2000': 'TABLE_1601_0103',
    '1:5000': 'TABLE_1601_0104'
  },
  layout_works: {
    construction_grid: 'TABLE_1601_0201',
    building_axes: 'TABLE_1601_0202'
  },
  monitoring: {
    deformation: 'TABLE_1601_0301'
  }
} as const;
