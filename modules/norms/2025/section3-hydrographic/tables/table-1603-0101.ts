/**
 * Путь: /modules/norms/2025/section3-hydrographic/tables/table-1603-0101.ts
 * Назначение: Промеры глубин эхолотом
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 1
 */

export interface HydrographicPrice {
  code: string;
  workType: string;
  category: 'I' | 'II' | 'III' | 'IV';
  pricePerUnit: number;
  unit: string;
  description?: string;
}

/**
 * Таблица 1603-0101
 * Промеры глубин эхолотом
 * 
 * Категории сложности:
 * I - Спокойные водоёмы (озёра, водохранилища)
 * II - Медленные реки, заливы
 * III - Средние реки, прибрежная зона морей
 * IV - Быстрые реки, открытые морские акватории
 */
export const TABLE_1603_0101: HydrographicPrice[] = [
  {
    code: '1603-0101-01',
    workType: 'Промеры глубин эхолотом',
    category: 'I',
    pricePerUnit: 3125,
    unit: 'км',
    description: 'Спокойные водоёмы (озёра, водохранилища)'
  },
  {
    code: '1603-0101-02',
    workType: 'Промеры глубин эхолотом',
    category: 'II',
    pricePerUnit: 4063,
    unit: 'км',
    description: 'Медленные реки, заливы'
  },
  {
    code: '1603-0101-03',
    workType: 'Промеры глубин эхолотом',
    category: 'III',
    pricePerUnit: 5313,
    unit: 'км',
    description: 'Средние реки, прибрежная зона морей'
  },
  {
    code: '1603-0101-04',
    workType: 'Промеры глубин эхолотом',
    category: 'IV',
    pricePerUnit: 6875,
    unit: 'км',
    description: 'Быстрые реки, открытые морские акватории'
  }
];

export const metadata = {
  tableCode: '1603-0101',
  tableName: 'Промеры глубин эхолотом',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 3. Инженерно-гидрографические работы',
  chapter: 'Глава 1. Промеры глубин',
  effectiveDate: new Date('2025-01-01'),
  unit: 'км (километр профиля)',
  notes: [
    'Цены за 1 км промерного профиля',
    'Включает разбивку профилей и камеральную обработку',
    'Точность промеров ±0.1-0.5 м в зависимости от глубины'
  ]
};

export default TABLE_1603_0101;
