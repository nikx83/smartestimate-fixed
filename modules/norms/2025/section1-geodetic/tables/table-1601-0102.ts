/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0102.ts
 * Назначение: Топографическая съёмка масштаба 1:1000
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

import type { GeodeticPrice } from './table-1601-0101';

/**
 * Таблица 1601-0102
 * Топографическая съёмка масштаба 1:1000
 */
export const TABLE_1601_0102: GeodeticPrice[] = [
  {
    code: '1601-0102-01',
    workType: 'Топографическая съёмка М 1:1000',
    scale: '1:1000',
    category: 'I',
    pricePerUnit: 6875,
    unit: 'га',
    description: 'I категория сложности'
  },
  {
    code: '1601-0102-02',
    workType: 'Топографическая съёмка М 1:1000',
    scale: '1:1000',
    category: 'II',
    pricePerUnit: 8750,
    unit: 'га',
    description: 'II категория сложности'
  },
  {
    code: '1601-0102-03',
    workType: 'Топографическая съёмка М 1:1000',
    scale: '1:1000',
    category: 'III',
    pricePerUnit: 11250,
    unit: 'га',
    description: 'III категория сложности'
  },
  {
    code: '1601-0102-04',
    workType: 'Топографическая съёмка М 1:1000',
    scale: '1:1000',
    category: 'IV',
    pricePerUnit: 14375,
    unit: 'га',
    description: 'IV категория сложности'
  }
];

export const metadata = {
  tableCode: '1601-0102',
  tableName: 'Топографическая съёмка масштаба 1:1000',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  effectiveDate: new Date('2025-01-01'),
  unit: 'га'
};

export default TABLE_1601_0102;
