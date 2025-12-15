/**
 * Путь: /modules/norms/2025/section4-inspection/tables/table-1604-0303-01.ts
 * Назначение: Таблица цен на обследование одноэтажных промышленных зданий III категории
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 17
 */

import type { InspectionPrice } from './table-1604-0301-01';

/**
 * Таблица 1604-0303-01
 * Инженерное обследование одноэтажных промышленных зданий III категории сложности
 */
export const TABLE_1604_0303_01: InspectionPrice[] = [
  // I категория сложности работ
  {
    code: '1604-0303-01-01',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'до 4.5м',
    pricePerUnit: 5303,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-02',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 4500,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-03',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 3556,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-04',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 3808,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-05',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'свыше 10м',
    pricePerUnit: 2667,
    unit: '100 м³'
  },

  // II категория сложности работ
  {
    code: '1604-0303-01-06',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'до 4.5м',
    pricePerUnit: 26505,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-07',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 22471,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-08',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 17646,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-09',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 14953,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-10',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'свыше 10м',
    pricePerUnit: 13274,
    unit: '100 м³'
  },

  // III категория сложности работ
  {
    code: '1604-0303-01-11',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'до 4.5м',
    pricePerUnit: 31823,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-12',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 23655,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-13',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 19381,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-14',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 17984,
    unit: '100 м³'
  },
  {
    code: '1604-0303-01-15',
    buildingCategory: 'III',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'свыше 10м',
    pricePerUnit: 16038,
    unit: '100 м³'
  }
];

export const metadata = {
  tableCode: '1604-0303-01',
  tableName: 'Инженерное обследование одноэтажных промышленных зданий III категории сложности',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  subsection: 'Подраздел 2. Инженерные обследования',
  page: '17',
  effectiveDate: new Date('2025-01-01'),
  unit: '100 м³ строительного объема здания'
};

export default TABLE_1604_0303_01;
