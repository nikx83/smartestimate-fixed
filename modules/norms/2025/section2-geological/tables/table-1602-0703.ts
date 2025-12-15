/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0703.ts
 * Назначение: Химический анализ грунтов и подземных вод
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2
 */

import type { LaboratoryPrice } from './table-1602-0701';

/**
 * Таблица 1602-0703
 * Химический анализ грунтов и подземных вод
 */
export const TABLE_1602_0703: LaboratoryPrice[] = [
  {
    code: '1602-0703-01',
    testType: 'pH водной вытяжки',
    pricePerUnit: 938,
    unit: 'проба',
    description: 'Кислотность грунта'
  },
  {
    code: '1602-0703-02',
    testType: 'Содержание водорастворимых солей',
    pricePerUnit: 1875,
    unit: 'проба',
    description: 'Общая минерализация'
  },
  {
    code: '1602-0703-03',
    testType: 'Содержание органических веществ',
    pricePerUnit: 2500,
    unit: 'проба',
    description: 'Гумус, органика'
  },
  {
    code: '1602-0703-04',
    testType: 'Агрессивность грунтовых вод к бетону',
    pricePerUnit: 5625,
    unit: 'проба',
    description: 'Полный химический анализ по СП 28.13330'
  },
  {
    code: '1602-0703-05',
    testType: 'Содержание сульфатов (SO₄²⁻)',
    pricePerUnit: 1563,
    unit: 'проба',
    description: 'В грунте или воде'
  },
  {
    code: '1602-0703-06',
    testType: 'Содержание хлоридов (Cl⁻)',
    pricePerUnit: 1563,
    unit: 'проба',
    description: 'В грунте или воде'
  },
  {
    code: '1602-0703-07',
    testType: 'Определение коррозионной активности грунта',
    pricePerUnit: 3750,
    unit: 'проба',
    description: 'К стали, бетону'
  }
];

export const metadata = {
  tableCode: '1602-0703',
  tableName: 'Химический анализ грунтов и подземных вод',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 7. Лабораторные испытания',
  effectiveDate: new Date('2025-01-01'),
  unit: 'проба'
};

export default TABLE_1602_0703;
