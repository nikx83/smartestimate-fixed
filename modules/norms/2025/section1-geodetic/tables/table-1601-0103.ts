/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0103.ts
 * Назначение: Топографическая съёмка масштаба 1:2000
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

import type { GeodeticPrice } from './table-1601-0101';

/**
 * Таблица 1601-0103
 * Топографическая съёмка масштаба 1:2000
 */
export const TABLE_1601_0103: GeodeticPrice[] = [
  {
    code: '1601-0103-01',
    workType: 'Топографическая съёмка М 1:2000',
    scale: '1:2000',
    category: 'I',
    pricePerUnit: 4375,
    unit: 'га',
    description: 'I категория сложности'
  },
  {
    code: '1601-0103-02',
    workType: 'Топографическая съёмка М 1:2000',
    scale: '1:2000',
    category: 'II',
    pricePerUnit: 5625,
    unit: 'га',
    description: 'II категория сложности'
  },
  {
    code: '1601-0103-03',
    workType: 'Топографическая съёмка М 1:2000',
    scale: '1:2000',
    category: 'III',
    pricePerUnit: 7188,
    unit: 'га',
    description: 'III категория сложности'
  },
  {
    code: '1601-0103-04',
    workType: 'Топографическая съёмка М 1:2000',
    scale: '1:2000',
    category: 'IV',
    pricePerUnit: 9063,
    unit: 'га',
    description: 'IV категория сложности'
  }
];

export const metadata = {
  tableCode: '1601-0103',
  tableName: 'Топографическая съёмка масштаба 1:2000',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  effectiveDate: new Date('2025-01-01'),
  unit: 'га'
};

export default TABLE_1601_0103;
