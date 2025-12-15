/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0104.ts
 * Назначение: Топографическая съёмка масштаба 1:5000
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

import type { GeodeticPrice } from './table-1601-0101';

/**
 * Таблица 1601-0104
 * Топографическая съёмка масштаба 1:5000
 */
export const TABLE_1601_0104: GeodeticPrice[] = [
  {
    code: '1601-0104-01',
    workType: 'Топографическая съёмка М 1:5000',
    scale: '1:5000',
    category: 'I',
    pricePerUnit: 1875,
    unit: 'га',
    description: 'I категория сложности'
  },
  {
    code: '1601-0104-02',
    workType: 'Топографическая съёмка М 1:5000',
    scale: '1:5000',
    category: 'II',
    pricePerUnit: 2500,
    unit: 'га',
    description: 'II категория сложности'
  },
  {
    code: '1601-0104-03',
    workType: 'Топографическая съёмка М 1:5000',
    scale: '1:5000',
    category: 'III',
    pricePerUnit: 3125,
    unit: 'га',
    description: 'III категория сложности'
  },
  {
    code: '1601-0104-04',
    workType: 'Топографическая съёмка М 1:5000',
    scale: '1:5000',
    category: 'IV',
    pricePerUnit: 3938,
    unit: 'га',
    description: 'IV категория сложности'
  }
];

export const metadata = {
  tableCode: '1601-0104',
  tableName: 'Топографическая съёмка масштаба 1:5000',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  effectiveDate: new Date('2025-01-01'),
  unit: 'га'
};

export default TABLE_1601_0104;
