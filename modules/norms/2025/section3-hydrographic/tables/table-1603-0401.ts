/**
 * Путь: /modules/norms/2025/section3-hydrographic/tables/table-1603-0401.ts
 * Назначение: Метеорологические наблюдения
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 4
 */

export interface MeteoPrice {
  code: string;
  workType: string;
  pricePerUnit: number;
  unit: string;
  description?: string;
}

/**
 * Таблица 1603-0401
 * Метеорологические наблюдения
 */
export const TABLE_1603_0401: MeteoPrice[] = [
  {
    code: '1603-0401-01',
    workType: 'Метеорологические наблюдения (автоматическая станция)',
    pricePerUnit: 62500,
    unit: 'месяц',
    description: 'Температура, давление, влажность, ветер, осадки'
  },
  {
    code: '1603-0401-02',
    workType: 'Измерение волнения (волномерная вешка)',
    pricePerUnit: 6250,
    unit: 'сутки',
    description: 'Высота и направление волн'
  },
  {
    code: '1603-0401-03',
    workType: 'Измерение ледовой обстановки',
    pricePerUnit: 12500,
    unit: 'сутки',
    description: 'Толщина льда, ледоход'
  },
  {
    code: '1603-0401-04',
    workType: 'Визуальные наблюдения за погодой',
    pricePerUnit: 3125,
    unit: 'сутки',
    description: 'Срочные наблюдения 4 раза в сутки'
  }
];

export const metadata = {
  tableCode: '1603-0401',
  tableName: 'Метеорологические наблюдения',
  normDocument: 'СЦИ РК 8.03-04-2025',
  section: 'Раздел 3. Инженерно-гидрографические работы',
  chapter: 'Глава 4. Метеорологические наблюдения',
  effectiveDate: new Date('2025-01-01'),
  unit: 'месяц/сутки',
  notes: [
    'Автоматическая станция — месячная аренда',
    'Другие наблюдения — посуточная оплата',
    'Включает камеральную обработку'
  ]
};

export default TABLE_1603_0401;
