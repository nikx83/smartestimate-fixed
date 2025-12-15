/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0202.ts
 * Назначение: Вынос главных осей здания в натуру
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

import type { GeodeticPrice } from './table-1601-0101';

/**
 * Таблица 1601-0202
 * Вынос главных осей здания в натуру
 */
export const TABLE_1601_0202: GeodeticPrice[] = [
  {
    code: '1601-0202-01',
    workType: 'Вынос главных осей здания в натуру',
    category: 'I',
    pricePerUnit: 31250,
    unit: 'здание',
    description: 'I категория сложности (простое здание)'
  },
  {
    code: '1601-0202-02',
    workType: 'Вынос главных осей здания в натуру',
    category: 'II',
    pricePerUnit: 43750,
    unit: 'здание',
    description: 'II категория сложности (здание средней сложности)'
  },
  {
    code: '1601-0202-03',
    workType: 'Вынос главных осей здания в натуру',
    category: 'III',
    pricePerUnit: 56250,
    unit: 'здание',
    description: 'III категория сложности (сложное здание)'
  },
  {
    code: '1601-0202-04',
    workType: 'Вынос главных осей здания в натуру',
    category: 'IV',
    pricePerUnit: 68750,
    unit: 'здание',
    description: 'IV категория сложности (особо сложное здание)'
  }
];

export const metadata = {
  tableCode: '1601-0202',
  tableName: 'Вынос главных осей здания в натуру',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  chapter: 'Глава 2. Разбивочные работы',
  effectiveDate: new Date('2025-01-01'),
  unit: 'здание'
};

export default TABLE_1601_0202;
