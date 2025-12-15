/**
 * Путь: /modules/calculations/geological/laboratory.ts
 * Назначение: Расчёт стоимости лабораторных испытаний грунтов
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Глава 7
 */

import {
  TABLE_1602_0701,
  TABLE_1602_0702,
  TABLE_1602_0703,
  type LaboratoryPrice
} from '@/modules/norms/2025/section2-geological/tables';

import {
  getLaboratoryVolumeCoefficient
} from '@/modules/norms/2025/section2-geological/coefficients';

import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Тип лабораторного испытания
 */
export type LaboratoryTestType =
  // Физические свойства
  | 'moisture'
  | 'density'
  | 'particle_density'
  | 'grain_size_sieve'
  | 'grain_size_hydrometer'
  | 'plasticity_index'
  | 'liquid_limit'
  | 'plastic_limit'
  | 'void_ratio'
  | 'saturation_degree'
  // Механические свойства
  | 'compression'
  | 'shear'
  | 'triaxial'
  | 'deformation_modulus'
  | 'compaction_ratio'
  | 'proctor'
  // Химический анализ
  | 'ph'
  | 'soluble_salts'
  | 'organic_content'
  | 'water_aggressiveness'
  | 'sulfates'
  | 'chlorides'
  | 'corrosion_activity';

/**
 * Параметры одного испытания
 */
export interface LaboratoryTest {
  testType: LaboratoryTestType;
  samplesCount: number;
}

/**
 * Параметры расчёта лабораторных работ
 */
export interface LaboratoryParams {
  tests: LaboratoryTest[];
  urgency?: 'normal' | 'urgent' | 'very_urgent';
}

/**
 * Результат расчёта лабораторных работ
 */
export interface LaboratoryResult {
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
 * Маппинг типов испытаний на таблицы
 */
const TEST_TYPE_TO_TABLE: Record<LaboratoryTestType, { table: LaboratoryPrice[], code: string }> = {
  // Физические свойства
  moisture: { table: TABLE_1602_0701, code: '1602-0701-01' },
  density: { table: TABLE_1602_0701, code: '1602-0701-02' },
  particle_density: { table: TABLE_1602_0701, code: '1602-0701-03' },
  grain_size_sieve: { table: TABLE_1602_0701, code: '1602-0701-04' },
  grain_size_hydrometer: { table: TABLE_1602_0701, code: '1602-0701-05' },
  plasticity_index: { table: TABLE_1602_0701, code: '1602-0701-06' },
  liquid_limit: { table: TABLE_1602_0701, code: '1602-0701-07' },
  plastic_limit: { table: TABLE_1602_0701, code: '1602-0701-08' },
  void_ratio: { table: TABLE_1602_0701, code: '1602-0701-09' },
  saturation_degree: { table: TABLE_1602_0701, code: '1602-0701-10' },
  
  // Механические свойства
  compression: { table: TABLE_1602_0702, code: '1602-0702-01' },
  shear: { table: TABLE_1602_0702, code: '1602-0702-02' },
  triaxial: { table: TABLE_1602_0702, code: '1602-0702-03' },
  deformation_modulus: { table: TABLE_1602_0702, code: '1602-0702-04' },
  compaction_ratio: { table: TABLE_1602_0702, code: '1602-0702-05' },
  proctor: { table: TABLE_1602_0702, code: '1602-0702-06' },
  
  // Химический анализ
  ph: { table: TABLE_1602_0703, code: '1602-0703-01' },
  soluble_salts: { table: TABLE_1602_0703, code: '1602-0703-02' },
  organic_content: { table: TABLE_1602_0703, code: '1602-0703-03' },
  water_aggressiveness: { table: TABLE_1602_0703, code: '1602-0703-04' },
  sulfates: { table: TABLE_1602_0703, code: '1602-0703-05' },
  chlorides: { table: TABLE_1602_0703, code: '1602-0703-06' },
  corrosion_activity: { table: TABLE_1602_0703, code: '1602-0703-07' }
};

/**
 * РАСЧЁТ ЛАБОРАТОРНЫХ РАБОТ
 */
export async function calculateLaboratory(
  params: LaboratoryParams
): Promise<LaboratoryResult> {
  if (!params.tests || params.tests.length === 0) {
    throw new Error('Не указаны виды испытаний');
  }

  const items = [];
  let totalCost = 0;

  // Подсчитать общее количество проб для коэффициента объёма
  const totalSamples = params.tests.reduce((sum, test) => sum + test.samplesCount, 0);
  const volumeCoefficient = getLaboratoryVolumeCoefficient(totalSamples);

  // Коэффициент срочности
  const urgencyCoefficients = {
    normal: 1.0,
    urgent: 1.3,
    very_urgent: 1.5
  };
  const urgencyCoefficient = params.urgency 
    ? urgencyCoefficients[params.urgency] 
    : 1.0;

  // Общий коэффициент
  const totalCoefficient = volumeCoefficient * urgencyCoefficient;

  const coefficientsApplied: Record<string, number> = {
    volume: volumeCoefficient
  };

  if (urgencyCoefficient > 1.0) {
    coefficientsApplied.urgency = urgencyCoefficient;
  }

  // Рассчитать стоимость каждого испытания
  for (const test of params.tests) {
    const { table, code } = TEST_TYPE_TO_TABLE[test.testType];
    const priceEntry = table.find(entry => entry.code === code);

    if (!priceEntry) {
      throw new Error(`Не найдена цена для испытания ${test.testType}`);
    }

    const basePrice = priceEntry.pricePerUnit;
    const cost = roundPrice(basePrice * test.samplesCount * totalCoefficient);
    totalCost += cost;

    items.push({
      code: priceEntry.code,
      workType: priceEntry.testType,
      unit: 'проба',
      quantity: test.samplesCount,
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost,
      section: 'Раздел 2',
      tableReference: getTableReferenceForTest(test.testType)
    });
  }

  return {
    totalCost: roundPrice(totalCost),
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

/**
 * Получение ссылки на таблицу по типу испытания
 */
function getTableReferenceForTest(testType: LaboratoryTestType): string {
  const code = TEST_TYPE_TO_TABLE[testType].code;
  return code.substring(0, 12); // '1602-0701', '1602-0702' или '1602-0703'
}

export default calculateLaboratory;
