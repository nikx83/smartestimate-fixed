/**
 * Путь: /modules/norms/2025/section3-hydrographic/tables/table-1603-0301.ts
 * Назначение: Отбор проб воды для анализа
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 3
 */

export interface WaterSamplingPrice {
  code: string;
  workType: string;
  pricePerUnit: number;
  unit: string;
  description?: string;
}

/**
 * Таблица 1603-0301
 * Отбор проб воды для химического и бактериологического анализа
 */
export const TABLE_1603_0301: WaterSamplingPrice[] = [
  {
    code: '1603-0301-01',
    workType: 'Отбор проб воды с поверхности',
    pricePerUnit: 938,
    unit: 'проба',
    description: 'С берега или судна'
  },
  {
    code: '1603-0301-02',
    workType: 'Отбор проб воды с глубины (батометр)',
    pricePerUnit: 1563,
    unit: 'проба',
    description: 'Батометр, глубинные пробы'
  },
  {
    code: '1603-0301-03',
    workType: 'Отбор проб донных отложений',
    pricePerUnit: 2188,
    unit: 'проба',
    description: 'Дночерпатель'
  },
  {
    code: '1603-0301-04',
    workType: 'Отбор проб взвешенных наносов',
    pricePerUnit: 1875,
    unit: 'проба',
    description: 'Батометр-бутылка'
  }
];

export const metadata = {
  tableCode: '1603-0301',
  tableName: 'Отбор проб воды и донных отложений',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 3. Инженерно-гидрографические работы',
  chapter: 'Глава 3. Отбор проб',
  effectiveDate: new Date('2025-01-01'),
  unit: 'проба',
  notes: [
    'Цены за 1 пробу',
    'Включает консервацию и транспортировку',
    'Анализ проб оплачивается отдельно'
  ]
};

export default TABLE_1603_0301;
