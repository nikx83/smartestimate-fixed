/**
 * Путь: /modules/calculations/geodetic/layout-works.ts
 * Назначение: Расчёт стоимости разбивочных работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1, Глава 2
 */

import {
  TABLE_1601_0201,
  TABLE_1601_0202,
  type GeodeticPrice
} from '@/modules/norms/2025/section1-geodetic/tables';

import { GEODETIC_COEFFICIENTS } from '@/modules/norms/2025/section1-geodetic/coefficients';
import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры разбивочных работ
 */
export interface LayoutWorksParams {
  workType: 'construction_grid' | 'building_axes';
  category: 'I' | 'II' | 'III' | 'IV';
  quantity: number; // количество пунктов или зданий

  // Дополнительные условия
  season?: 'summer' | 'winter';
  accuracyRequirement?: 'standard' | 'increased' | 'high' | 'ultra_high';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
  developmentDensity?: 'undeveloped' | 'low_density' | 'medium_density' | 'high_density' | 'very_high_density';
  seismicity?: 0 | 6 | 7 | 8 | 9 | 10;
}

export interface LayoutWorksResult {
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
 * РАСЧЁТ РАЗБИВОЧНЫХ РАБОТ
 */
export async function calculateLayoutWorks(
  params: LayoutWorksParams
): Promise<LayoutWorksResult> {
  // ШАГ 1: Выбрать таблицу
  const priceTable = params.workType === 'construction_grid' 
    ? TABLE_1601_0201 
    : TABLE_1601_0202;

  // ШАГ 2: Найти цену по категории
  const priceEntry = priceTable.find(entry => entry.category === params.category);

  if (!priceEntry) {
    throw new Error(`Не найдена цена для категории ${params.category}`);
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 3: Собрать коэффициенты
  const coefficientsApplied = collectLayoutCoefficients(params);

  // ШАГ 4: Общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 5: Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * params.quantity);

  // ШАГ 6: Позиция сметы
  const workTypeNames = {
    construction_grid: 'Разбивка геодезической строительной сетки',
    building_axes: 'Вынос главных осей здания в натуру'
  };

  const items = [
    {
      code: priceEntry.code,
      workType: workTypeNames[params.workType],
      unit: priceEntry.unit,
      quantity: roundPrice(params.quantity),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 1',
      tableReference: params.workType === 'construction_grid' ? '1601-0201' : '1601-0202',
      notes: generateLayoutNotes(params)
    }
  ];

  return {
    totalCost,
    basePrice,
    coefficients: coefficientsApplied,
    items,
    metadata: {
      section: 'Раздел 1. Инженерно-геодезические изыскания',
      module: 'geodetic',
      calculatedAt: new Date(),
      normVersion: '2025'
    }
  };
}

/**
 * Сбор коэффициентов для разбивочных работ
 */
function collectLayoutCoefficients(params: LayoutWorksParams): Record<string, number> {
  const coefficients: Record<string, number> = {};

  if (params.season) {
    coefficients.season = GEODETIC_COEFFICIENTS.SEASONAL[params.season];
  }

  if (params.accuracyRequirement) {
    coefficients.accuracy = GEODETIC_COEFFICIENTS.ACCURACY[params.accuracyRequirement];
  }

  if (params.urgency) {
    coefficients.urgency = GEODETIC_COEFFICIENTS.URGENCY[params.urgency];
  }

  if (params.developmentDensity) {
    coefficients.development = GEODETIC_COEFFICIENTS.DEVELOPMENT[params.developmentDensity];
  }

  if (params.seismicity && params.seismicity > 0) {
    coefficients.seismicity = GEODETIC_COEFFICIENTS.SEISMICITY[params.seismicity];
  }

  return coefficients;
}

/**
 * Генерация примечаний для разбивочных работ
 */
function generateLayoutNotes(params: LayoutWorksParams): string {
  const notes: string[] = [];

  if (params.season === 'winter') {
    notes.push('Зимний период');
  }

  if (params.accuracyRequirement && params.accuracyRequirement !== 'standard') {
    notes.push('Повышенная точность');
  }

  if (params.developmentDensity && params.developmentDensity !== 'undeveloped') {
    notes.push('Застроенная территория');
  }

  return notes.join('; ');
}

export default calculateLayoutWorks;
