/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0101.ts
 * Назначение: Топографическая съёмка масштаба 1:500
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1, Глава 1
 */

export interface GeodeticPrice {
  code: string;
  workType: string;
  scale?: string;
  category: 'I' | 'II' | 'III' | 'IV';
  pricePerUnit: number;
  unit: string;
  description?: string;
}

/**
 * Таблица 1601-0101
 * Топографическая съёмка масштаба 1:500
 */
export const TABLE_1601_0101: GeodeticPrice[] = [
  {
    code: '1601-0101-01',
    workType: 'Топографическая съёмка М 1:500',
    scale: '1:500',
    category: 'I',
    pricePerUnit: 8750,
    unit: 'га',
    description: 'I категория сложности (застроенная территория с плотностью застройки до 10%)'
  },
  {
    code: '1601-0101-02',
    workType: 'Топографическая съёмка М 1:500',
    scale: '1:500',
    category: 'II',
    pricePerUnit: 11250,
    unit: 'га',
    description: 'II категория сложности (застроенная территория с плотностью 10-30%)'
  },
  {
    code: '1601-0101-03',
    workType: 'Топографическая съёмка М 1:500',
    scale: '1:500',
    category: 'III',
    pricePerUnit: 14375,
    unit: 'га',
    description: 'III категория сложности (застроенная территория с плотностью 30-50%)'
  },
  {
    code: '1601-0101-04',
    workType: 'Топографическая съёмка М 1:500',
    scale: '1:500',
    category: 'IV',
    pricePerUnit: 18125,
    unit: 'га',
    description: 'IV категория сложности (застроенная территория с плотностью более 50%)'
  }
];

export const metadata = {
  tableCode: '1601-0101',
  tableName: 'Топографическая съёмка масштаба 1:500',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  chapter: 'Глава 1. Топографо-геодезические работы',
  effectiveDate: new Date('2025-01-01'),
  unit: 'га (гектар)'
};

export default TABLE_1601_0101;
