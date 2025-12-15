/**
 * Путь: /modules/calculations/geological/field-testing.ts
 * Назначение: Расчёт стоимости полевых испытаний грунтов
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Глава 4
 */

import {
  TABLE_1602_0401,
  TABLE_1602_0402,
  type GeologicalPrice
} from '@/modules/norms/2025/section2-geological/tables';

import { GEOLOGICAL_COEFFICIENTS } from '@/modules/norms/2025/section2-geological/coefficients';
import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры полевых испытаний
 */
export interface FieldTestingParams {
  testType: 'static_penetration' | 'dynamic_penetration';
  soilCategory: 'I' | 'II' | 'III' | 'IV';
  pointsCount: number;        // Количество точек зондирования
  depthPerPoint: number;      // Глубина зондирования в каждой точке, м

  // Условия
  season?: 'summer' | 'winter';
  developmentDensity?: 'open' | 'low_density' | 'medium_density' | 'high_density';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
}

export interface FieldTestingResult {
  totalCost: number;
  basePrice: number;
  coefficients: Record<string, number>;
  items: Array<{
    code: string;
    workType: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    coefficient: number;
    cost: number;
    section: string;
    tableReference: string;
    notes?: string;
  }>;
  metadata: {
    section: string;
    module: string;
    calculatedAt: Date;
    normVersion: string;
  };
}

/**
 * РАСЧЁТ ПОЛЕВЫХ ИСПЫТАНИЙ
 */
export async function calculateFieldTesting(
  params: FieldTestingParams
): Promise<FieldTestingResult> {
  // ШАГ 1: Выбрать таблицу
  const priceTable = params.testType === 'static_penetration' 
    ? TABLE_1602_0401 
    : TABLE_1602_0402;

  // ШАГ 2: Найти цену по категории грунта
  const priceEntry = priceTable.find(entry => entry.soilCategory === params.soilCategory);

  if (!priceEntry) {
    throw new Error(
      `Не найдена цена для испытания ${params.testType}, категория ${params.soilCategory}`
    );
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 3: Общая глубина зондирования
  const totalDepth = params.pointsCount * params.depthPerPoint;

  // ШАГ 4: Собрать коэффициенты
  const coefficientsApplied: Record<string, number> = {};

  if (params.season) {
    coefficientsApplied.season = GEOLOGICAL_COEFFICIENTS.SEASONAL[params.season];
  }

  if (params.developmentDensity) {
    coefficientsApplied.development = 
      GEOLOGICAL_COEFFICIENTS.DEVELOPMENT[params.developmentDensity];
  }

  if (params.urgency) {
    coefficientsApplied.urgency = GEOLOGICAL_COEFFICIENTS.URGENCY[params.urgency];
  }

  // ШАГ 5: Общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 6: Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * totalDepth);

  // ШАГ 7: Позиция сметы
  const testNames = {
    static_penetration: 'Статическое зондирование (CPT)',
    dynamic_penetration: 'Динамическое зондирование'
  };

  const items = [
    {
      code: priceEntry.code,
      workType: testNames[params.testType],
      unit: 'м',
      quantity: roundPrice(totalDepth),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 2',
      tableReference: params.testType === 'static_penetration' ? '1602-0401' : '1602-0402',
      notes: `${params.pointsCount} точек × ${params.depthPerPoint} м`
    }
  ];

  return {
    totalCost,
    basePrice,
    coefficients: coefficientsApplied,
    items,
    metadata: {
      section: 'Раздел 2. Инженерно-геологические изыскания',
      module: 'geological',
      calculatedAt: new Date(),
      normVersion: '2025'
    }
  };
}

export default calculateFieldTesting;
