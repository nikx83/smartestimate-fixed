/**
 * Путь: /modules/norms/2025/section3-hydrographic/tables/table-1603-0102.ts
 * Назначение: Промеры глубин ручным способом (наметка, трос)
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3
 */

import type { HydrographicPrice } from './table-1603-0101';

/**
 * Таблица 1603-0102
 * Промеры глубин ручным способом (наметка, лот, трос)
 */
export const TABLE_1603_0102: HydrographicPrice[] = [
  {
    code: '1603-0102-01',
    workType: 'Промеры глубин ручным способом',
    category: 'I',
    pricePerUnit: 1875,
    unit: 'км',
    description: 'Спокойные водоёмы, глубина до 5 м'
  },
  {
    code: '1603-0102-02',
    workType: 'Промеры глубин ручным способом',
    category: 'II',
    pricePerUnit: 2500,
    unit: 'км',
    description: 'Медленные реки, глубина до 10 м'
  },
  {
    code: '1603-0102-03',
    workType: 'Промеры глубин ручным способом',
    category: 'III',
    pricePerUnit: 3438,
    unit: 'км',
    description: 'Средние реки, глубина до 20 м'
  },
  {
    code: '1603-0102-04',
    workType: 'Промеры глубин ручным способом',
    category: 'IV',
    pricePerUnit: 4688,
    unit: 'км',
    description: 'Быстрые реки, глубина более 20 м'
  }
];

export const metadata = {
  tableCode: '1603-0102',
  tableName: 'Промеры глубин ручным способом',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 3. Инженерно-гидрографические работы',
  chapter: 'Глава 1. Промеры глубин',
  effectiveDate: new Date('2025-01-01'),
  unit: 'км',
  notes: [
    'Применяется при отсутствии эхолота',
    'Для мелководных участков',
    'Включает разбивку створов'
  ]
};

export default TABLE_1603_0102;
