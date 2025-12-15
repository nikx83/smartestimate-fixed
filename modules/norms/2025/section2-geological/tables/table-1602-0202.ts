/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0202.ts
 * Назначение: Бурение скважин лёгким механизированным способом
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2
 */

import type { GeologicalPrice } from './table-1602-0201';

/**
 * Таблица 1602-0202
 * Бурение скважин лёгким механизированным способом (УРБ-2А, ПБУ и др.)
 */
export const TABLE_1602_0202: GeologicalPrice[] = [
  {
    code: '1602-0202-01',
    workType: 'Бурение лёгким механизированным способом',
    soilCategory: 'I',
    pricePerUnit: 1250,
    unit: 'м',
    description: 'Песок, супесь'
  },
  {
    code: '1602-0202-02',
    workType: 'Бурение лёгким механизированным способом',
    soilCategory: 'II',
    pricePerUnit: 1625,
    unit: 'м',
    description: 'Суглинок мягкопластичный'
  },
  {
    code: '1602-0202-03',
    workType: 'Бурение лёгким механизированным способом',
    soilCategory: 'III',
    pricePerUnit: 2125,
    unit: 'м',
    description: 'Суглинок тугопластичный, глина мягкопластичная'
  },
  {
    code: '1602-0202-04',
    workType: 'Бурение лёгким механизированным способом',
    soilCategory: 'IV',
    pricePerUnit: 2875,
    unit: 'м',
    description: 'Глина тугопластичная, суглинок твердый'
  },
  {
    code: '1602-0202-05',
    workType: 'Бурение лёгким механизированным способом',
    soilCategory: 'V',
    pricePerUnit: 3750,
    unit: 'м',
    description: 'Глина твердая'
  },
  {
    code: '1602-0202-06',
    workType: 'Бурение лёгким механизированным способом',
    soilCategory: 'VI',
    pricePerUnit: 5000,
    unit: 'м',
    description: 'Полускальные и скальные грунты'
  }
];

export const metadata = {
  tableCode: '1602-0202',
  tableName: 'Бурение скважин лёгким механизированным способом',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 2. Буровые работы',
  effectiveDate: new Date('2025-01-01'),
  unit: 'м',
  notes: [
    'Глубина скважин до 30 м',
    'Установки типа УРБ-2А, ПБУ',
    'Диаметр скважин 108-146 мм'
  ]
};

export default TABLE_1602_0202;
