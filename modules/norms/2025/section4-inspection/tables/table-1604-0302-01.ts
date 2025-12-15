/**
 * Путь: /modules/norms/2025/section4-inspection/tables/table-1604-0302-01.ts
 * Назначение: Таблица цен на обследование одноэтажных промышленных зданий II категории
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 16
 */

import type { InspectionPrice } from './table-1604-0301-01';

/**
 * Таблица 1604-0302-01
 * Инженерное обследование одноэтажных промышленных зданий II категории сложности
 */
export const TABLE_1604_0302_01: InspectionPrice[] = [
  // I категория сложности работ
  {
    code: '1604-0302-01-01',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'до 4.5м',
    pricePerUnit: 4670,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-02',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 3992,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-03',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 3103,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-04',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 2638,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-05',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'свыше 10м',
    pricePerUnit: 2312,
    unit: '100 м³'
  },

  // II категория сложности работ
  {
    code: '1604-0302-01-06',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'до 4.5м',
    pricePerUnit: 23458,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-07',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 19889,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-08',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 15616,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-09',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 13217,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-10',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'свыше 10м',
    pricePerUnit: 11637,
    unit: '100 м³'
  },

  // III категория сложности работ
  {
    code: '1604-0302-01-11',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'до 4.5м',
    pricePerUnit: 27930,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-12',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 20749,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-13',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 16997,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-14',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 15770,
    unit: '100 м³'
  },
  {
    code: '1604-0302-01-15',
    buildingCategory: 'II',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'свыше 10м',
    pricePerUnit: 14064,
    unit: '100 м³'
  }
];

export const metadata = {
  tableCode: '1604-0302-01',
  tableName: 'Инженерное обследование одноэтажных промышленных зданий II категории сложности',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  subsection: 'Подраздел 2. Инженерные обследования',
  page: '16',
  effectiveDate: new Date('2025-01-01'),
  unit: '100 м³ строительного объема здания'
};

export default TABLE_1604_0302_01;
