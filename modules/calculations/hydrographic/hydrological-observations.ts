/**
 * Путь: /modules/calculations/hydrographic/hydrological-observations.ts
 * Назначение: Расчёт стоимости гидрологических наблюдений
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 2
 */

import {
  TABLE_1603_0201,
  TABLE_1603_0202,
  type HydrographicPrice
} from '@/modules/norms/2025/section3-hydrographic/tables';

import {
  HYDROGRAPHIC_COEFFICIENTS,
  getObservationsVolumeCoefficient
} from '@/modules/norms/2025/section3-hydrographic/coefficients';

import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры гидрологических наблюдений
 */
export interface HydrologicalObservationsParams {
  observationType: 'water_level' | 'current_velocity';
  category: 'I' | 'II' | 'III' | 'IV';
  
  // Для наблюдений за уровнем
  durationMonths?: number; // месяцев
  
  // Для измерения течений
  crossSectionsCount?: number; // количество створов

  // Условия
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  iceConditions?: 'open_water' | 'thin_ice' | 'thick_ice' | 'very_thick_ice' | 'ice_drift';
  remoteness?: 'nearby' | 'moderate' | 'remote' | 'very_remote' | 'extremely_remote';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
}

export interface HydrologicalObservationsResult {
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
 * РАСЧЁТ ГИДРОЛОГИЧЕСКИХ НАБЛЮДЕНИЙ
 */
export async function calculateHydrologicalObservations(
  params: HydrologicalObservationsParams
): Promise<HydrologicalObservationsResult> {
  // ШАГ 1: Выбрать таблицу
  const priceTable = params.observationType === 'water_level'
    ? TABLE_1603_0201
    : TABLE_1603_0202;

  // ШАГ 2: Найти базовую цену
  const priceEntry = priceTable.find(entry => entry.category === params.category);

  if (!priceEntry) {
    throw new Error(
      `Не найдена цена для наблюдений ${params.observationType}, категория ${params.category}`
    );
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 3: Определить количество
  let quantity: number;
  let unit: string;

  if (params.observationType === 'water_level') {
    quantity = params.durationMonths || 1;
    unit = 'месяц';
  } else {
    quantity = params.crossSectionsCount || 1;
    unit = 'створ';
  }

  // ШАГ 4: Собрать коэффициенты
  const coefficientsApplied = collectObservationsCoefficients(params);

  // ШАГ 5: Общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 6: Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * quantity);

  // ШАГ 7: Позиция сметы
  const typeNames = {
    water_level: 'Наблюдения за уровнем воды',
    current_velocity: 'Измерение скоростей течения'
  };

  const items = [
    {
      code: priceEntry.code,
      workType: `${typeNames[params.observationType]}, ${params.category} категория`,
      unit,
      quantity: roundPrice(quantity),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 3',
      tableReference: params.observationType === 'water_level' ? '1603-0201' : '1603-0202',
      notes: generateObservationsNotes(params)
    }
  ];

  return {
    totalCost,
    basePrice,
    coefficients: coefficientsApplied,
    items,
    metadata: {
      section: 'Раздел 3. Инженерно-гидрографические работы',
      module: 'hydrographic',
      calculatedAt: new Date(),
      normVersion: '2025'
    }
  };
}

/**
 * Сбор коэффициентов для наблюдений
 */
function collectObservationsCoefficients(
  params: HydrologicalObservationsParams
): Record<string, number> {
  const coefficients: Record<string, number> = {};

  // Коэффициент объёма (скидка для длительных наблюдений)
  if (params.observationType === 'water_level' && params.durationMonths) {
    coefficients.volume = getObservationsVolumeCoefficient(params.durationMonths);
  }

  // Сезонный коэффициент
  if (params.season) {
    coefficients.season = HYDROGRAPHIC_COEFFICIENTS.SEASONAL[params.season];
  }

  // Ледовые условия
  if (params.iceConditions) {
    coefficients.ice = HYDROGRAPHIC_COEFFICIENTS.ICE_CONDITIONS[params.iceConditions];
  }

  // Удалённость
  if (params.remoteness) {
    coefficients.remoteness = HYDROGRAPHIC_COEFFICIENTS.REMOTENESS[params.remoteness];
  }

  // Срочность
  if (params.urgency) {
    coefficients.urgency = HYDROGRAPHIC_COEFFICIENTS.URGENCY[params.urgency];
  }

  return coefficients;
}

/**
 * Генерация примечаний
 */
function generateObservationsNotes(params: HydrologicalObservationsParams): string {
  const notes: string[] = [];

  if (params.observationType === 'water_level') {
    notes.push(`${params.durationMonths} месяцев наблюдений`);
  } else {
    notes.push(`${params.crossSectionsCount} створов`);
  }

  if (params.season && params.season !== 'summer') {
    notes.push(`сезон: ${params.season}`);
  }

  if (params.iceConditions && params.iceConditions !== 'open_water') {
    notes.push('ледовые условия');
  }

  return notes.join('; ');
}

export default calculateHydrologicalObservations;
