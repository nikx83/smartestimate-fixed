/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0203.ts
 * Назначение: Бурение скважин тяжёлым механизированным способом
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2
 */

import type { GeologicalPrice } from './table-1602-0201';

/**
 * Таблица 1602-0203
 * Бурение скважин тяжёлым механизированным способом (ЗИФ-1200, УКБ-12/25 и др.)
 */
export const TABLE_1602_0203: GeologicalPrice[] = [
  {
    code: '1602-0203-01',
    workType: 'Бурение тяжёлым механизированным способом',
    soilCategory: 'I',
    pricePerUnit: 2500,
    unit: 'м',
    description: 'Песок, супесь'
  },
  {
    code: '1602-0203-02',
    workType: 'Бурение тяжёлым механизированным способом',
    soilCategory: 'II',
    pricePerUnit: 3125,
    unit: 'м',
    description: 'Суглинок мягкопластичный'
  },
  {
    code: '1602-0203-03',
    workType: 'Бурение тяжёлым механизированным способом',
    soilCategory: 'III',
    pricePerUnit: 3750,
    unit: 'м',
    description: 'Суглинок тугопластичный, глина мягкопластичная'
  },
  {
    code: '1602-0203-04',
    workType: 'Бурение тяжёлым механизированным способом',
    soilCategory: 'IV',
    pricePerUnit: 4688,
    unit: 'м',
    description: 'Глина тугопластичная, суглинок твердый'
  },
  {
    code: '1602-0203-05',
    workType: 'Бурение тяжёлым механизированным способом',
    soilCategory: 'V',
    pricePerUnit: 5625,
    unit: 'м',
    description: 'Глина твердая'
  },
  {
    code: '1602-0203-06',
    workType: 'Бурение тяжёлым механизированным способом',
    soilCategory: 'VI',
    pricePerUnit: 6875,
    unit: 'м',
    description: 'Полускальные и скальные грунты'
  }
];

export const metadata = {
  tableCode: '1602-0203',
  tableName: 'Бурение скважин тяжёлым механизированным способом',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 2. Буровые работы',
  effectiveDate: new Date('2025-01-01'),
  unit: 'м',
  notes: [
    'Глубина скважин до 50 м и более',
    'Установки типа ЗИФ-1200, УКБ-12/25',
    'Диаметр скважин 146-219 мм'
  ]
};

export default TABLE_1602_0203;
