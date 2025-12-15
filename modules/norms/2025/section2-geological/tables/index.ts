/**
 * Путь: /modules/norms/2025/section2-geological/tables/index.ts
 * Назначение: Центральный экспорт всех таблиц геологических работ
 */

// Буровые работы
export { TABLE_1602_0201, metadata as metadata_1602_0201 } from './table-1602-0201';
export { TABLE_1602_0202, metadata as metadata_1602_0202 } from './table-1602-0202';
export { TABLE_1602_0203, metadata as metadata_1602_0203 } from './table-1602-0203';

// Горные выработки
export { TABLE_1602_0301, metadata as metadata_1602_0301 } from './table-1602-0301';

// Полевые испытания
export { TABLE_1602_0401, metadata as metadata_1602_0401 } from './table-1602-0401';
export { TABLE_1602_0402, metadata as metadata_1602_0402 } from './table-1602-0402';

// Лабораторные испытания
export { TABLE_1602_0701, metadata as metadata_1602_0701 } from './table-1602-0701';
export { TABLE_1602_0702, metadata as metadata_1602_0702 } from './table-1602-0702';
export { TABLE_1602_0703, metadata as metadata_1602_0703 } from './table-1602-0703';

// Типы
export type { GeologicalPrice } from './table-1602-0201';
export type { LaboratoryPrice } from './table-1602-0701';

/**
 * Маппинг таблиц по типам работ
 */
export const GEOLOGICAL_TABLES = {
  drilling: {
    manual: 'TABLE_1602_0201',
    light_mechanical: 'TABLE_1602_0202',
    heavy_mechanical: 'TABLE_1602_0203'
  },
  excavation: {
    pit: 'TABLE_1602_0301'
  },
  field_testing: {
    static_penetration: 'TABLE_1602_0401',
    dynamic_penetration: 'TABLE_1602_0402'
  },
  laboratory: {
    physical: 'TABLE_1602_0701',
    mechanical: 'TABLE_1602_0702',
    chemical: 'TABLE_1602_0703'
  }
} as const;
