/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0402.ts
 * Назначение: Динамическое зондирование грунтов
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2
 */

import type { GeologicalPrice } from './table-1602-0201';

/**
 * Таблица 1602-0402
 * Динамическое зондирование грунтов
 */
export const TABLE_1602_0402: GeologicalPrice[] = [
  {
    code: '1602-0402-01',
    workType: 'Динамическое зондирование',
    soilCategory: 'I',
    pricePerUnit: 500,
    unit: 'м',
    description: 'Песок, супесь'
  },
  {
    code: '1602-0402-02',
    workType: 'Динамическое зондирование',
    soilCategory: 'II',
    pricePerUnit: 625,
    unit: 'м',
    description: 'Суглинок мягкопластичный'
  },
  {
    code: '1602-0402-03',
    workType: 'Динамическое зондирование',
    soilCategory: 'III',
    pricePerUnit: 813,
    unit: 'м',
    description: 'Суглинок тугопластичный, глина мягкопластичная'
  },
  {
    code: '1602-0402-04',
    workType: 'Динамическое зондирование',
    soilCategory: 'IV',
    pricePerUnit: 1063,
    unit: 'м',
    description: 'Глина тугопластичная'
  }
];

export const metadata = {
  tableCode: '1602-0402',
  tableName: 'Динамическое зондирование грунтов',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 4. Полевые испытания грунтов',
  effectiveDate: new Date('2025-01-01'),
  unit: 'м'
};

export default TABLE_1602_0402;
