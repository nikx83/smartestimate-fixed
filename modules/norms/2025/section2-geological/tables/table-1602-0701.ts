/**
 * Путь: /modules/norms/2025/section2-geological/tables/table-1602-0701.ts
 * Назначение: Лабораторные испытания физических свойств грунтов
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Глава 7
 */

export interface LaboratoryPrice {
  code: string;
  testType: string;
  pricePerUnit: number;
  unit: string;
  description?: string;
}

/**
 * Таблица 1602-0701
 * Определение физических свойств грунтов
 */
export const TABLE_1602_0701: LaboratoryPrice[] = [
  {
    code: '1602-0701-01',
    testType: 'Природная влажность',
    pricePerUnit: 625,
    unit: 'проба',
    description: 'ГОСТ 5180-2015'
  },
  {
    code: '1602-0701-02',
    testType: 'Плотность грунта',
    pricePerUnit: 938,
    unit: 'проба',
    description: 'ГОСТ 5180-2015'
  },
  {
    code: '1602-0701-03',
    testType: 'Плотность частиц грунта',
    pricePerUnit: 1250,
    unit: 'проба',
    description: 'ГОСТ 5180-2015'
  },
  {
    code: '1602-0701-04',
    testType: 'Гранулометрический состав (ситовой метод)',
    pricePerUnit: 1875,
    unit: 'проба',
    description: 'ГОСТ 12536-2014'
  },
  {
    code: '1602-0701-05',
    testType: 'Гранулометрический состав (ареометрический метод)',
    pricePerUnit: 3125,
    unit: 'проба',
    description: 'ГОСТ 12536-2014'
  },
  {
    code: '1602-0701-06',
    testType: 'Число пластичности',
    pricePerUnit: 2500,
    unit: 'проба',
    description: 'ГОСТ 5180-2015'
  },
  {
    code: '1602-0701-07',
    testType: 'Влажность на границе текучести',
    pricePerUnit: 1563,
    unit: 'проба',
    description: 'ГОСТ 5180-2015'
  },
  {
    code: '1602-0701-08',
    testType: 'Влажность на границе раскатывания',
    pricePerUnit: 1563,
    unit: 'проба',
    description: 'ГОСТ 5180-2015'
  },
  {
    code: '1602-0701-09',
    testType: 'Коэффициент пористости',
    pricePerUnit: 938,
    unit: 'проба',
    description: 'Расчётный показатель'
  },
  {
    code: '1602-0701-10',
    testType: 'Степень влажности',
    pricePerUnit: 938,
    unit: 'проба',
    description: 'Расчётный показатель'
  }
];

export const metadata = {
  tableCode: '1602-0701',
  tableName: 'Определение физических свойств грунтов',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 2. Инженерно-геологические изыскания',
  chapter: 'Глава 7. Лабораторные испытания грунтов',
  effectiveDate: new Date('2025-01-01'),
  unit: 'проба',
  notes: [
    'Цены указаны за 1 пробу (образец)',
    'Испытания проводятся в аккредитованной лаборатории',
    'Соответствие ГОСТ'
  ]
};

export default TABLE_1602_0701;
