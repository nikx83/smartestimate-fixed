/**
 * Путь: /modules/norms/2025/section3-hydrographic/tables/index.ts
 * Назначение: Центральный экспорт всех таблиц гидрографических работ
 */

// Промеры глубин
export { TABLE_1603_0101, metadata as metadata_1603_0101 } from './table-1603-0101';
export { TABLE_1603_0102, metadata as metadata_1603_0102 } from './table-1603-0102';

// Гидрологические наблюдения
export { TABLE_1603_0201, metadata as metadata_1603_0201 } from './table-1603-0201';
export { TABLE_1603_0202, metadata as metadata_1603_0202 } from './table-1603-0202';

// Отбор проб
export { TABLE_1603_0301, metadata as metadata_1603_0301 } from './table-1603-0301';

// Метеорологические наблюдения
export { TABLE_1603_0401, metadata as metadata_1603_0401 } from './table-1603-0401';

// Типы
export type { HydrographicPrice } from './table-1603-0101';
export type { WaterSamplingPrice } from './table-1603-0301';
export type { MeteoPrice } from './table-1603-0401';

/**
 * Маппинг таблиц по типам работ
 */
export const HYDROGRAPHIC_TABLES = {
  depth_sounding: {
    echo_sounder: 'TABLE_1603_0101',
    manual: 'TABLE_1603_0102'
  },
  hydrological: {
    water_level: 'TABLE_1603_0201',
    current_velocity: 'TABLE_1603_0202'
  },
  sampling: {
    water: 'TABLE_1603_0301'
  },
  meteorological: {
    observations: 'TABLE_1603_0401'
  }
} as const;
