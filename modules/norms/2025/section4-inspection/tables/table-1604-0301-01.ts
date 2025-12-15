/**
 * Путь: /modules/norms/2025/section4-inspection/tables/table-1604-0301-01.ts
 * Назначение: Таблица цен на обследование одноэтажных промышленных зданий I категории
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 15-16
 */

export interface InspectionPrice {
  code: string;
  buildingCategory: 'I' | 'II' | 'III';
  floors: 'single' | 'multi';
  workComplexity: 'I' | 'II' | 'III';
  heightCategory: string;
  pricePerUnit: number;
  unit: string;
}

/**
 * Таблица 1604-0301-01
 * Инженерное обследование одноэтажных промышленных зданий I категории сложности
 */
export const TABLE_1604_0301_01: InspectionPrice[] = [
  // I категория сложности работ
  {
    code: '1604-0301-01-01',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'до 4.5м',
    pricePerUnit: 3893,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-02',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 3315,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-03',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 2599,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-04',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 2204,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-05',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'I',
    heightCategory: 'свыше 10м',
    pricePerUnit: 1918,
    unit: '100 м³'
  },

  // II категория сложности работ
  {
    code: '1604-0301-01-06',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'до 4.5м',
    pricePerUnit: 19551,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-07',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 16574,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-08',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 13005,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-09',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 11030,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-10',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'II',
    heightCategory: 'свыше 10м',
    pricePerUnit: 9591,
    unit: '100 м³'
  },

  // III категория сложности работ
  {
    code: '1604-0301-01-11',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'до 4.5м',
    pricePerUnit: 23458,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-12',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 4.5 до 6м',
    pricePerUnit: 19918,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-13',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 6 до 8м',
    pricePerUnit: 15658,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-14',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'от 8 до 10м',
    pricePerUnit: 13260,
    unit: '100 м³'
  },
  {
    code: '1604-0301-01-15',
    buildingCategory: 'I',
    floors: 'single',
    workComplexity: 'III',
    heightCategory: 'свыше 10м',
    pricePerUnit: 11821,
    unit: '100 м³'
  }
];

export const metadata = {
  tableCode: '1604-0301-01',
  tableName: 'Инженерное обследование одноэтажных промышленных зданий I категории сложности',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
  subsection: 'Подраздел 2. Инженерные обследования',
  page: '15-16',
  effectiveDate: new Date('2025-01-01'),
  unit: '100 м³ строительного объема здания',
  notes: [
    'Цены без учёта НДС',
    'Для зданий с шагом несущих конструкций 6-12 м',
    'При другом шаге применяются коэффициенты из Таблицы 1'
  ]
};

export default TABLE_1604_0301_01;
