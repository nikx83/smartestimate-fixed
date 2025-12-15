/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0401.ts
 * Назначение: Статическое зондирование грунтов
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Глава 4
 */

import type { GeologicalPrice } from './table-1602-0201';

/**
 * Таблица 1602-0401
 * Статическое зондирование грунтов (CPT)
 */
export const TABLE_1602_0401: GeologicalPrice[] = [
  {
    code: '1602-0401-01',
    workType: 'Статическое зондирование (CPT)',
    soilCategory: 'I',
    pricePerUnit: 625,
    unit: 'м',
    description: 'Песок, супесь'
  },
  {
    code: '1602-0401-02',
    workType: 'Статическое зондирование (CPT)',
    soilCategory: 'II',
    pricePerUnit: 750,
    unit: 'м',
    description: 'Суглинок мягкопластичный'
  },
  {
    code: '1602-0401-03',
    workType: 'Статическое зондирование (CPT)',
    soilCategory: 'III',
    pricePerUnit: 938,
    unit: 'м',
    description: 'Суглинок тугопластичный, глина мягкопластичная'
  },
  {
    code: '1602-0401-04',
    workType: 'Статическое зондирование (CPT)',
    soilCategory: 'IV',
    pricePerUnit: 1250,
    unit: 'м',
    description: 'Глина тугопластичная'
  }
];

export const metadata = {
  tableCode: '1602-0401',
  tableName: 'Статическое зондирование грунтов',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 4. Полевые испытания грунтов',
  effectiveDate: new Date('2025-01-01'),
  unit: 'м',
  notes: [
    'Глубина зондирования до 20 м',
    'Установки типа СП-59, УСЗ-15',
    'Непрерывная запись показаний'
  ]
};

export default TABLE_1602_0401;
