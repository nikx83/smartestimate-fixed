/**
 * Путь: /modules/norms/2025/section4-inspection/tables/table-1604-0305-01.ts
 * Назначение: Таблица цен на обследование многоэтажных промышленных зданий II категории
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 18
 */

import type { InspectionPrice } from './table-1604-0301-01';

/**
 * Таблица 1604-0305-01
 * Инженерное обследование многоэтажных промышленных зданий II категории сложности
 */
export const TABLE_1604_0305_01: InspectionPrice[] = [
  // I категория сложности работ
  {
    code: '1604-0305-01-01',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'до 4.5м',
    pricePerUnit: 5113,
    unit: '100 м³'
  },
  {
    code: '1604-0305-01-02',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 4348,
    unit: '100 м³'
  },
  {
    code: '1604-0305-01-03',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'I',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 3407,
    unit: '100 м³'
  },

  // II категория сложности работ
  {
    code: '1604-0305-01-04',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'до 4.5м',
    pricePerUnit: 25648,
    unit: '100 м³'
  },
  {
    code: '1604-0305-01-05',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 21748,
    unit: '100 м³'
  },
  {
    code: '1604-0305-01-06',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'II',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 17088,
    unit: '100 м³'
  },

  // III категория сложности работ
  {
    code: '1604-0305-01-07',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'до 4.5м',
    pricePerUnit: 30796,
    unit: '100 м³'
  },
  {
    code: '1604-0305-01-08',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 26101,
    unit: '100 м³'
  },
  {
    code: '1604-0305-01-09',
    buildingCategory: 'II',
    floors: 'multi',
    workComplexity: 'III',
    heightCategory: 'свыше 7.2м',
    pricePerUnit: 20516,
    unit: '100 м³'
  }
];

export const metadata = {
  tableCode: '1604-0305-01',
  tableName: 'Инженерное обследование многоэтажных промышленных зданий II категории сложности',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  subsection: 'Подраздел 2. Инженерные обследования',
  page: '18',
  effectiveDate: new Date('2025-01-01'),
  unit: '100 м³ строительного объема здания'
};

export default TABLE_1604_0305_01;
