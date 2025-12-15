/**
 * Путь: /modules/calculations/geodetic/deformation-monitoring.ts
 * Назначение: Расчёт стоимости мониторинга деформаций
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1, Глава 3
 */

import { TABLE_1601_0301, type GeodeticPrice } from '@/modules/norms/2025/section1-geodetic/tables';
import { GEODETIC_COEFFICIENTS } from '@/modules/norms/2025/section1-geodetic/coefficients';
import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры мониторинга деформаций
 */
export interface DeformationMonitoringParams {
  category: 'I' | 'II' | 'III' | 'IV';
  marksCount: number; // количество деформационных марок
  cyclesCount: number; // количество циклов наблюдений

  // Дополнительные условия
  season?: 'summer' | 'winter';
  accuracyRequirement?: 'standard' | 'increased' | 'high' | 'ultra_high';
  buildingHeight?: number; // высота здания в метрах
  accessDifficulty?: 'easy' | 'medium' | 'difficult' | 'very_difficult';
}

export interface DeformationMonitoringResult {
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
 * РАСЧЁТ МОНИТОРИНГА ДЕФОРМАЦИЙ
 */
export async function calculateDeformationMonitoring(
  params: DeformationMonitoringParams
): Promise<DeformationMonitoringResult> {
  // ШАГ 1: Найти цену по категории
  const priceEntry = TABLE_1601_0301.find(entry => entry.category === params.category);

  if (!priceEntry) {
    throw new Error(`Не найдена цена для категории ${params.category}`);
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 2: Собрать коэффициенты
  const coefficientsApplied = collectMonitoringCoefficients(params);

  // ШАГ 3: Общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 4: Общее количество измерений
  const totalMeasurements = params.marksCount * params.cyclesCount;

  // ШАГ 5: Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * totalMeasurements);

  // ШАГ 6: Позиция сметы
  const items = [
    {
      code: priceEntry.code,
      workType: `Наблюдения за осадками и деформациями (${params.cyclesCount} циклов)`,
      unit: 'марка',
      quantity: roundPrice(totalMeasurements),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 1',
      tableReference: '1601-0301',
      notes: generateMonitoringNotes(params)
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
 * Сбор коэффициентов для мониторинга
 */
function collectMonitoringCoefficients(
  params: DeformationMonitoringParams
): Record<string, number> {
  const coefficients: Record<string, number> = {};

  if (params.season) {
    coefficients.season = GEODETIC_COEFFICIENTS.SEASONAL[params.season];
  }

  if (params.accuracyRequirement) {
    coefficients.accuracy = GEODETIC_COEFFICIENTS.ACCURACY[params.accuracyRequirement];
  }

  // Коэффициент высоты здания
  if (params.buildingHeight) {
    if (params.buildingHeight > 100) {
      coefficients.height = 1.5; // Высотное здание
    } else if (params.buildingHeight > 50) {
      coefficients.height = 1.3; // Повышенная высота
    } else if (params.buildingHeight > 30) {
      coefficients.height = 1.15; // Многоэтажное
    }
  }

  // Коэффициент сложности доступа
  if (params.accessDifficulty) {
    const accessCoefficients = {
      easy: 1.0,
      medium: 1.2,
      difficult: 1.4,
      very_difficult: 1.6
    };
    coefficients.access = accessCoefficients[params.accessDifficulty];
  }

  return coefficients;
}

/**
 * Генерация примечаний для мониторинга
 */
function generateMonitoringNotes(params: DeformationMonitoringParams): string {
  const notes: string[] = [];

  notes.push(`${params.marksCount} марок × ${params.cyclesCount} циклов`);

  if (params.season === 'winter') {
    notes.push('зимний период');
  }

  if (params.buildingHeight && params.buildingHeight > 30) {
    notes.push(`высота ${params.buildingHeight} м`);
  }

  if (params.accuracyRequirement && params.accuracyRequirement !== 'standard') {
    notes.push('повышенная точность');
  }

  return notes.join(', ');
}

export default calculateDeformationMonitoring;
