/**
 * Путь: /modules/norms/2025/section4-inspection/tables/table-1604-0304-01.ts
 * Назначение: Таблица цен на обследование многоэтажных промышленных зданий I категории
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 17
 */

import type { InspectionPrice } from './table-1604-0301-01';

/**
 * Таблица 1604-0304-01
 * Инженерное обследование многоэтажных промышленных зданий I категории сложности
 */
export const TABLE_1604_0304_01: InspectionPrice[] = [
  // I категория сложности работ
  {
    code: '1604-0304-01-01',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'до 4.5м',
    pricePerUnit: 4287,
    unit: '100 м³'
  },
  {
    code: '1604-0304-01-02',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 3654,
    unit: '100 м³'
  },
  {
    code: '1604-0304-01-03',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 2850,
    unit: '100 м³'
  },

  // II категория сложности работ
  {
    code: '1604-0304-01-04',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'до 4.5м',
    pricePerUnit: 21526,
    unit: '100 м³'
  },
  {
    code: '1604-0304-01-05',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 18240,
    unit: '100 м³'
  },
  {
    code: '1604-0304-01-06',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 14318,
    unit: '100 м³'
  },

  // III категория сложности работ
  {
    code: '1604-0304-01-07',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'до 4.5м',
    pricePerUnit: 25813,
    unit: '100 м³'
  },
  {
    code: '1604-0304-01-08',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 21906,
    unit: '100 м³'
  },
  {
    code: '1604-0304-01-09',
    buildingCategory: 'I',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 17210,
    unit: '100 м³'
  }
];

export const metadata = {
  tableCode: '1604-0304-01',
  tableName: 'Инженерное обследование многоэтажных промышленных зданий I категории сложности',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  subsection: 'Подраздел 2. Инженерные обследования',
  page: '17',
  effectiveDate: new Date('2025-01-01'),
  unit: '100 м³ строительного объема здания',
  notes: [
    'Для многоэтажных зданий указывается высота этажа, а не общая высота здания'
  ]
};

export default TABLE_1604_0304_01;
