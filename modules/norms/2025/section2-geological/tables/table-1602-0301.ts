/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0301.ts
 * Назначение: Проходка шурфов (горные выработки)
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Глава 3
 */

import type { GeologicalPrice } from './table-1602-0201';

/**
 * Таблица 1602-0301
 * Проходка шурфов глубиной до 3 м
 */
export const TABLE_1602_0301: GeologicalPrice[] = [
  {
    code: '1602-0301-01',
    workType: 'Проходка шурфов глубиной до 3 м',
    soilCategory: 'I',
    pricePerUnit: 18750,
    unit: 'м³',
    description: 'Песок, супесь'
  },
  {
    code: '1602-0301-02',
    workType: 'Проходка шурфов глубиной до 3 м',
    soilCategory: 'II',
    pricePerUnit: 25000,
    unit: 'м³',
    description: 'Суглинок мягкопластичный'
  },
  {
    code: '1602-0301-03',
    workType: 'Проходка шурфов глубиной до 3 м',
    soilCategory: 'III',
    pricePerUnit: 31250,
    unit: 'м³',
    description: 'Суглинок тугопластичный, глина мягкопластичная'
  },
  {
    code: '1602-0301-04',
    workType: 'Проходка шурфов глубиной до 3 м',
    soilCategory: 'IV',
    pricePerUnit: 37500,
    unit: 'м³',
    description: 'Глина тугопластичная, суглинок твердый'
  },
  {
    code: '1602-0301-05',
    workType: 'Проходка шурфов глубиной до 3 м',
    soilCategory: 'V',
    pricePerUnit: 43750,
    unit: 'м³',
    description: 'Глина твердая'
  },
  {
    code: '1602-0301-06',
    workType: 'Проходка шурфов глубиной до 3 м',
    soilCategory: 'VI',
    pricePerUnit: 56250,
    unit: 'м³',
    description: 'Полускальные грунты'
  }
];

export const metadata = {
  tableCode: '1602-0301',
  tableName: 'Проходка шурфов глубиной до 3 м',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 3. Горные выработки',
  effectiveDate: new Date('2025-01-01'),
  unit: 'м³ (кубический метр)',
  notes: [
    'Размеры шурфа в плане 1×2 м',
    'Глубина до 3 м',
    'Включает крепление стенок и обратную засыпку'
  ]
};

export default TABLE_1602_0301;
