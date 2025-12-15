/**
 * Путь: /modules/norms/2025/section4-inspection/tables/table-1604-0306-01.ts
 * Назначение: Таблица цен на обследование многоэтажных промышленных зданий III категории
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 18
 */

import type { InspectionPrice } from './table-1604-0301-01';

/**
 * Таблица 1604-0306-01
 * Инженерное обследование многоэтажных промышленных зданий III категории сложности
 */
export const TABLE_1604_0306_01: InspectionPrice[] = [
  // I категория сложности работ
  {
    code: '1604-0306-01-01',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'до 4.5м',
    pricePerUnit: 5813,
    unit: '100 м³'
  },
  {
    code: '1604-0306-01-02',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 4943,
    unit: '100 м³'
  },
  {
    code: '1604-0306-01-03',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 3877,
    unit: '100 м³'
  },

  // II категория сложности работ
  {
    code: '1604-0306-01-04',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'до 4.5м',
    pricePerUnit: 29088,
    unit: '100 м³'
  },
  {
    code: '1604-0306-01-05',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 24692,
    unit: '100 м³'
  },
  {
    code: '1604-0306-01-06',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 19400,
    unit: '100 м³'
  },

  // III категория сложности работ
  {
    code: '1604-0306-01-07',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'до 4.5м',
    pricePerUnit: 34903,
    unit: '100 м³'
  },
  {
    code: '1604-0306-01-08',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 29636,
    unit: '100 м³'
  },
  {
    code: '1604-0306-01-09',
    buildingCategory: 'III',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 23279,
    unit: '100 м³'
  }
];

export const metadata = {
  tableCode: '1604-0306-01',
  tableName: 'Инженерное обследование многоэтажных промышленных зданий III категории сложности',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  subsection: 'Подраздел 2. Инженерные обследования',
  page: '18',
  effectiveDate: new Date('2025-01-01'),
  unit: '100 м³ строительного объема здания'
};

export default TABLE_1604_0306_01;
