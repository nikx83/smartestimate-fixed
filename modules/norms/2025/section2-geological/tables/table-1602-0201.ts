/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0201.ts
 * Назначение: Бурение скважин ручным способом
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Глава 2
 */

export interface GeologicalPrice {
  code: string;
  workType: string;
  soilCategory: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  pricePerUnit: number;
  unit: string;
  description?: string;
}

/**
 * Таблица 1602-0201
 * Бурение скважин ручным способом
 * 
 * Категории грунтов:
 * I - Песок, супесь
 * II - Суглинок мягкопластичный
 * III - Суглинок тугопластичный, глина мягкопластичная
 * IV - Глина тугопластичный, суглинок твердый
 * V - Глина твердая
 * VI - Полускальные и скальные грунты
 */
export const TABLE_1602_0201: GeologicalPrice[] = [
  {
    code: '1602-0201-01',
    workType: 'Бурение скважин ручным способом',
    soilCategory: 'I',
    pricePerUnit: 625,
    unit: 'м',
    description: 'Песок, супесь (лёгкие грунты)'
  },
  {
    code: '1602-0201-02',
    workType: 'Бурение скважин ручным способом',
    soilCategory: 'II',
    pricePerUnit: 875,
    unit: 'м',
    description: 'Суглинок мягкопластичный'
  },
  {
    code: '1602-0201-03',
    workType: 'Бурение скважин ручным способом',
    soilCategory: 'III',
    pricePerUnit: 1250,
    unit: 'м',
    description: 'Суглинок тугопластичный, глина мягкопластичная'
  },
  {
    code: '1602-0201-04',
    workType: 'Бурение скважин ручным способом',
    soilCategory: 'IV',
    pricePerUnit: 1750,
    unit: 'м',
    description: 'Глина тугопластичная, суглинок твердый'
  },
  {
    code: '1602-0201-05',
    workType: 'Бурение скважин ручным способом',
    soilCategory: 'V',
    pricePerUnit: 2500,
    unit: 'м',
    description: 'Глина твердая'
  },
  {
    code: '1602-0201-06',
    workType: 'Бурение скважин ручным способом',
    soilCategory: 'VI',
    pricePerUnit: 3750,
    unit: 'м',
    description: 'Полускальные и скальные грунты'
  }
];

export const metadata = {
  tableCode: '1602-0201',
  tableName: 'Бурение скважин ручным способом',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 2. Буровые работы',
  effectiveDate: new Date('2025-01-01'),
  unit: 'м (погонный метр)',
  notes: [
    'Глубина скважин до 20 м',
    'Диаметр скважин 89-108 мм',
    'Цены указаны за 1 погонный метр проходки'
  ]
};

export default TABLE_1602_0201;
