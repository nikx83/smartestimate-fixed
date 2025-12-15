/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0301.ts
 * Назначение: Мониторинг деформаций зданий и сооружений
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1, Глава 3
 */

import type { GeodeticPrice } from './table-1601-0101';

/**
 * Таблица 1601-0301
 * Мониторинг деформаций зданий и сооружений
 */
export const TABLE_1601_0301: GeodeticPrice[] = [
  {
    code: '1601-0301-01',
    workType: 'Наблюдения за осадками и деформациями (1 цикл)',
    category: 'I',
    pricePerUnit: 6250,
    unit: 'марка',
    description: 'I категория сложности (простое здание)'
  },
  {
    code: '1601-0301-02',
    workType: 'Наблюдения за осадками и деформациями (1 цикл)',
    category: 'II',
    pricePerUnit: 8125,
    unit: 'марка',
    description: 'II категория сложности'
  },
  {
    code: '1601-0301-03',
    workType: 'Наблюдения за осадками и деформациями (1 цикл)',
    category: 'III',
    pricePerUnit: 10000,
    unit: 'марка',
    description: 'III категория сложности'
  },
  {
    code: '1601-0301-04',
    workType: 'Наблюдения за осадками и деформациями (1 цикл)',
    category: 'IV',
    pricePerUnit: 12500,
    unit: 'марка',
    description: 'IV категория сложности (особо сложное)'
  }
];

export const metadata = {
  tableCode: '1601-0301',
  tableName: 'Мониторинг деформаций зданий и сооружений',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  chapter: 'Глава 3. Геодезический мониторинг',
  effectiveDate: new Date('2025-01-01'),
  unit: 'марка (деформационная марка)',
  notes: [
    'Цена указана за 1 цикл измерений',
    'Количество циклов определяется техническим заданием'
  ]
};

export default TABLE_1601_0301;
