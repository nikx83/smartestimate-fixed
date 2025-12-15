/**
 * Путь: /modules/calculations/hydrographic/water-sampling.ts
 * Назначение: Расчёт стоимости отбора проб воды
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 3
 */

import {
  TABLE_1603_0301,
  type WaterSamplingPrice
} from '@/modules/norms/2025/section3-hydrographic/tables';

import { HYDROGRAPHIC_COEFFICIENTS } from '@/modules/norms/2025/section3-hydrographic/coefficients';
import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Тип пробы
 */
export type SampleType = 'surface' | 'depth' | 'bottom_sediment' | 'suspended_sediment';

/**
 * Параметры одного вида отбора проб
 */
export interface WaterSample {
  sampleType: SampleType;
  samplesCount: number;
}

/**
 * Параметры расчёта отбора проб
 */
export interface WaterSamplingParams {
  samples: WaterSample[];
  
  // Условия
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  iceConditions?: 'open_water' | 'thin_ice' | 'thick_ice' | 'very_thick_ice';
  remoteness?: 'nearby' | 'moderate' | 'remote' | 'very_remote' | 'extremely_remote';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
}

export interface WaterSamplingResult {
  totalCost: number;
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
 * Маппинг типов проб на таблицу
 */
const SAMPLE_TYPE_TO_CODE: Record<SampleType, string> = {
  surface: '1603-0301-01',
  depth: '1603-0301-02',
  bottom_sediment: '1603-0301-03',
  suspended_sediment: '1603-0301-04'
};

/**
 * РАСЧЁТ ОТБОРА ПРОБ
 */
export async function calculateWaterSampling(
  params: WaterSamplingParams
): Promise<WaterSamplingResult> {
  if (!params.samples || params.samples.length === 0) {
    throw new Error('Не указаны виды проб');
  }

  // Собрать коэффициенты (общие для всех проб)
  const coefficientsApplied: Record<string, number> = {};

  if (params.season) {
    coefficientsApplied.season = HYDROGRAPHIC_COEFFICIENTS.SEASONAL[params.season];
  }

  if (params.iceConditions) {
    coefficientsApplied.ice = 
      HYDROGRAPHIC_COEFFICIENTS.ICE_CONDITIONS[params.iceConditions];
  }

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

  // Рассчитать стоимость каждого вида проб
  const items = [];
  let totalCost = 0;

  for (const sample of params.samples) {
    const code = SAMPLE_TYPE_TO_CODE[sample.sampleType];
    const priceEntry = TABLE_1603_0301.find(entry => entry.code === code);

    if (!priceEntry) {
      throw new Error(`Не найдена цена для типа пробы ${sample.sampleType}`);
    }

    const basePrice = priceEntry.pricePerUnit;
    const cost = roundPrice(basePrice * sample.samplesCount * totalCoefficient);
    totalCost += cost;

    items.push({
      code: priceEntry.code,
      workType: priceEntry.workType,
      unit: 'проба',
      quantity: sample.samplesCount,
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost,
      section: 'Раздел 3',
      tableReference: '1603-0301'
    });
  }

  return {
    totalCost: roundPrice(totalCost),
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

export default calculateWaterSampling;
