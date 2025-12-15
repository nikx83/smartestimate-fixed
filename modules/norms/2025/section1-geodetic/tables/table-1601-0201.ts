/**
 * Путь: /modules/norms/2025/section1-geodetic/tables/table-1601-0201.ts
 * Назначение: Разбивка геодезической строительной сетки
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1, Глава 2
 */

import type { GeodeticPrice } from './table-1601-0101';

/**
 * Таблица 1601-0201
 * Разбивка геодезической строительной сетки
 */
export const TABLE_1601_0201: GeodeticPrice[] = [
  {
    code: '1601-0201-01',
    workType: 'Разбивка геодезической строительной сетки',
    category: 'I',
    pricePerUnit: 125000,
    unit: 'пункт',
    description: 'I категория сложности (открытая местность)'
  },
  {
    code: '1601-0201-02',
    workType: 'Разбивка геодезической строительной сетки',
    category: 'II',
    pricePerUnit: 156250,
    unit: 'пункт',
    description: 'II категория сложности (слабо застроенная территория)'
  },
  {
    code: '1601-0201-03',
    workType: 'Разбивка геодезической строительной сетки',
    category: 'III',
    pricePerUnit: 187500,
    unit: 'пункт',
    description: 'III категория сложности (застроенная территория)'
  },
  {
    code: '1601-0201-04',
    workType: 'Разбивка геодезической строительной сетки',
    category: 'IV',
    pricePerUnit: 218750,
    unit: 'пункт',
    description: 'IV категория сложности (плотно застроенная территория)'
  }
];

export const metadata = {
  tableCode: '1601-0201',
  tableName: 'Разбивка геодезической строительной сетки',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 1. Инженерно-геодезические изыскания',
  chapter: 'Глава 2. Разбивочные работы',
  effectiveDate: new Date('2025-01-01'),
  unit: 'пункт'
};

export default TABLE_1601_0201;
