/**
 * Путь: /modules/calculations/inspection/industrial.ts
 * Назначение: Расчёт стоимости обследования промышленных зданий (100% по СЦИ РК)
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4
 * Версия: 2.0 (полностью переработан)
 */

import {
  TABLE_1604_0301_01,
  TABLE_1604_0302_01,
  TABLE_1604_0303_01,
  TABLE_1604_0304_01,
  TABLE_1604_0305_01,
  TABLE_1604_0306_01,
  type InspectionPrice
} from '@/modules/norms/2025/section4-inspection/tables';

import {
  COEFFICIENTS,
  getSmallVolumeCoefficient,
  applyCoefficients
} from '@/modules/norms/2025/section4-inspection/coefficients';

import { calculateTotalCost, roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры расчёта обследования промышленного здания
 */
export interface IndustrialInspectionParams {
  // Основные характеристики здания
  buildingCategory: 'I' | 'II' | 'III';
  floors: number;
  heightCategory: string;
  volume: number; // м³

  // Параметры работ
  workComplexity: 'I' | 'II' | 'III';

  // Коэффициенты сложных условий (Таблица 2)
  hasDifficultSoils?: boolean;
  hasHazardousEquipment?: boolean;
  isWinterConditions?: boolean;
  afterEarthquake?: boolean;
  seismicity?: 7 | 8 | 9 | 10;
  hasHotWorkshops?: boolean;
  isHeritageMonument?: boolean;
  requiresReinforcement?: boolean;
  hasUndergroundPart?: boolean;

  // Шаг несущих конструкций (Таблица 1)
  structureSpacing?: 'до 6м' | '6-12м без подстропильных' | '6-12м с подстропильными' | 'свыше 12м';
}

/**
 * Результат расчёта
 */
export interface CalculationResult {
  totalCost: number;
  basePrice: number;
  coefficients: Record<string, number>;
  items: EstimateItem[];
  metadata: {
    section: string;
    module: string;
    submodule?: string;
    calculatedAt: Date;
    normVersion: string;
  };
}

export interface EstimateItem {
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
}

/**
 * ОСНОВНАЯ ФУНКЦИЯ РАСЧЁТА
 * Строго по СЦИ РК 8.03-04-2025, Раздел 4
 */
export async function calculateIndustrialInspection(
  params: IndustrialInspectionParams
): Promise<CalculationResult> {
  // ШАГ 1: Определить тип здания (одноэтажное/многоэтажное)
  const isMultiStorey = params.floors > 1;

  // ШАГ 2: Выбрать таблицу цен
  const priceTable = selectPriceTable(params.buildingCategory, isMultiStorey);

  // ШАГ 3: Найти базовую цену в таблице
  const priceEntry = findPriceInTable(
    priceTable,
    params.heightCategory,
    params.workComplexity
  );

  if (!priceEntry) {
    throw new Error(
      `Не найдена цена для параметров: категория=${params.buildingCategory}, ` +
      `высота=${params.heightCategory}, сложность=${params.workComplexity}`
    );
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 4: Собрать все применимые коэффициенты
  const coefficientsApplied = collectCoefficients(params);

  // ШАГ 5: Рассчитать общий коэффициент (перемножение)
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 6: Рассчитать стоимость с учётом коэффициентов
  const priceWithCoefficients = basePrice * totalCoefficient;

  // ШАГ 7: Рассчитать количество единиц (цена за 100 м³)
  const quantity = params.volume / 100;

  // ШАГ 8: Итоговая стоимость
  const totalCost = roundPrice(priceWithCoefficients * quantity);

  // ШАГ 9: Сформировать позицию сметы
  const items: EstimateItem[] = [
    {
      code: priceEntry.code,
      workType: generateWorkDescription(params, isMultiStorey),
      unit: '100 м³',
      quantity: roundPrice(quantity),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 4',
      tableReference: getTableReference(params.buildingCategory, isMultiStorey),
      notes: generateNotes(params)
    }
  ];

  // ШАГ 10: Вернуть результат
  return {
    totalCost,
    basePrice,
    coefficients: coefficientsApplied,
    items,
    metadata: {
      section: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
      module: 'inspection',
      submodule: 'industrial',
      calculatedAt: new Date(),
      normVersion: '2025'
    }
  };
}

/**
 * Выбор таблицы цен по категории здания и этажности
 */
function selectPriceTable(
  category: 'I' | 'II' | 'III',
  isMultiStorey: boolean
): InspectionPrice[] {
  if (isMultiStorey) {
    switch (category) {
      case 'I':
        return TABLE_1604_0304_01;
      case 'II':
        return TABLE_1604_0305_01;
      case 'III':
        return TABLE_1604_0306_01;
    }
  } else {
    switch (category) {
      case 'I':
        return TABLE_1604_0301_01;
      case 'II':
        return TABLE_1604_0302_01;
      case 'III':
        return TABLE_1604_0303_01;
    }
  }
}

/**
 * Поиск цены в таблице по высоте и сложности работ
 */
function findPriceInTable(
  table: InspectionPrice[],
  heightCategory: string,
  workComplexity: 'I' | 'II' | 'III'
): InspectionPrice | undefined {
  return table.find(
    (entry) =>
      entry.heightCategory === heightCategory &&
      entry.workComplexity === workComplexity
  );
}

/**
 * Сбор всех применимых коэффициентов
 */
function collectCoefficients(
  params: IndustrialInspectionParams
): Record<string, number> {
  const coefficients: Record<string, number> = {};

  // КОЭФФИЦИЕНТ 1: Малый объём (Таблица 3)
  // Применяется ВСЕГДА, если объём до 4000 м³
  if (params.volume <= 4000) {
    coefficients.smallVolume = getSmallVolumeCoefficient(params.volume);
  }

  // КОЭФФИЦИЕНТ 2: Шаг несущих конструкций (Таблица 1)
  // Применяется, если указан
  if (params.structureSpacing) {
    coefficients.structureSpacing =
      COEFFICIENTS.STRUCTURE_SPACING[params.structureSpacing];
  }

  // КОЭФФИЦИЕНТЫ 3-11: Сложные условия (Таблица 2)
  const complexConditions = COEFFICIENTS.COMPLEX_CONDITIONS;

  if (params.hasDifficultSoils) {
    coefficients.difficultSoils = complexConditions.DIFFICULT_SOILS;
  }

  if (params.hasHazardousEquipment) {
    coefficients.hazardousEquipment = complexConditions.HAZARDOUS_EQUIPMENT;
  }

  if (params.isWinterConditions) {
    coefficients.winterConditions = complexConditions.WINTER_CONDITIONS;
  }

  if (params.afterEarthquake) {
    coefficients.afterEarthquake = complexConditions.AFTER_EARTHQUAKE;
  }

  if (params.seismicity) {
    coefficients.seismicity = complexConditions.SEISMICITY[params.seismicity];
  }

  if (params.hasHotWorkshops) {
    coefficients.hotWorkshops = complexConditions.HOT_WORKSHOPS;
  }

  if (params.isHeritageMonument) {
    coefficients.heritageMonument = complexConditions.HERITAGE_MONUMENT;
  }

  if (params.requiresReinforcement) {
    coefficients.reinforcement = complexConditions.REINFORCEMENT_REQUIRED;
  }

  if (params.hasUndergroundPart) {
    coefficients.undergroundPart = complexConditions.UNDERGROUND_PART;
  }

  return coefficients;
}

/**
 * Генерация описания работ
 */
function generateWorkDescription(
  params: IndustrialInspectionParams,
  isMultiStorey: boolean
): string {
  const buildingType = isMultiStorey ? 'многоэтажных' : 'одноэтажных';
  const categoryNames = {
    I: 'I категории',
    II: 'II категории',
    III: 'III категории'
  };
  const complexityNames = {
    I: 'I категория',
    II: 'II категория',
    III: 'III категория'
  };

  return (
    `Инженерное обследование строительных конструкций ${buildingType} ` +
    `промышленных зданий ${categoryNames[params.buildingCategory]} сложности, ` +
    `${complexityNames[params.workComplexity]} сложности работ`
  );
}

/**
 * Получение ссылки на таблицу
 */
function getTableReference(
  category: 'I' | 'II' | 'III',
  isMultiStorey: boolean
): string {
  const tableNumbers = {
    single: { I: '1604-0301-01', II: '1604-0302-01', III: '1604-0303-01' },
    multi: { I: '1604-0304-01', II: '1604-0305-01', III: '1604-0306-01' }
  };

  return isMultiStorey
    ? tableNumbers.multi[category]
    : tableNumbers.single[category];
}

/**
 * Генерация примечаний
 */
function generateNotes(params: IndustrialInspectionParams): string {
  const notes: string[] = [];

  if (params.volume <= 4000) {
    notes.push(`Применён коэффициент малого объёма (${params.volume} м³)`);
  }

  if (params.structureSpacing) {
    notes.push(`Шаг конструкций: ${params.structureSpacing}`);
  }

  const conditions: string[] = [];
  if (params.hasDifficultSoils) conditions.push('сложные грунты');
  if (params.hasHazardousEquipment) conditions.push('опасное оборудование');
  if (params.isWinterConditions) conditions.push('зимние условия');
  if (params.seismicity) conditions.push(`сейсмичность ${params.seismicity} баллов`);
  if (params.hasHotWorkshops) conditions.push('горячие цеха');
  if (params.isHeritageMonument) conditions.push('памятник архитектуры');

  if (conditions.length > 0) {
    notes.push(`Особые условия: ${conditions.join(', ')}`);
  }

  return notes.join('; ');
}

export default calculateIndustrialInspection;
