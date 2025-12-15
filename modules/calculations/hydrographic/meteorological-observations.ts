/**
 * Путь: /modules/calculations/hydrographic/meteorological-observations.ts
 * Назначение: Расчёт стоимости метеорологических наблюдений
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 4
 */

import {
  TABLE_1603_0401,
  type MeteoPrice
} from '@/modules/norms/2025/section3-hydrographic/tables';

import { HYDROGRAPHIC_COEFFICIENTS } from '@/modules/norms/2025/section3-hydrographic/coefficients';
import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Тип метеонаблюдений
 */
export type MeteoObservationType = 'auto_station' | 'wave_measurement' | 'ice_conditions' | 'visual';

/**
 * Параметры метеонаблюдений
 */
export interface MeteoObservationsParams {
  observationType: MeteoObservationType;
  duration: number; // месяцев для станции, дней для остальных
  
  // Условия
  remoteness?: 'nearby' | 'moderate' | 'remote' | 'very_remote' | 'extremely_remote';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
}

export interface MeteoObservationsResult {
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
  }>;
  metadata: {
    section: string;
    module: string;
    calculatedAt: Date;
    normVersion: string;
  };
}

/**
 * Маппинг типов наблюдений на таблицу
 */
const OBSERVATION_TYPE_TO_CODE: Record<MeteoObservationType, string> = {
  auto_station: '1603-0401-01',
  wave_measurement: '1603-0401-02',
  ice_conditions: '1603-0401-03',
  visual: '1603-0401-04'
};

/**
 * РАСЧЁТ МЕТЕОНАБЛЮДЕНИЙ
 */
export async function calculateMeteoObservations(
  params: MeteoObservationsParams
): Promise<MeteoObservationsResult> {
  const code = OBSERVATION_TYPE_TO_CODE[params.observationType];
  const priceEntry = TABLE_1603_0401.find(entry => entry.code === code);

  if (!priceEntry) {
    throw new Error(`Не найдена цена для наблюдений ${params.observationType}`);
  }

  const basePrice = priceEntry.pricePerUnit;

  // Собрать коэффициенты
  const coefficientsApplied: Record<string, number> = {};

  if (params.remoteness) {
    coefficientsApplied.remoteness = 
      HYDROGRAPHIC_COEFFICIENTS.REMOTENESS[params.remoteness];
  }

  if (params.urgency) {
    coefficientsApplied.urgency = 
      HYDROGRAPHIC_COEFFICIENTS.URGENCY[params.urgency];
  }

  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * params.duration);

  const items = [
    {
      code: priceEntry.code,
      workType: priceEntry.workType,
      unit: priceEntry.unit,
      quantity: params.duration,
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 3',
      tableReference: '1603-0401'
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

export default calculateMeteoObservations;
