/**
 * Путь: /modules/calculations/geological/drilling.ts
 * Назначение: Расчёт стоимости буровых работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2, Главы 2-3
 */

import {
  TABLE_1602_0201,
  TABLE_1602_0202,
  TABLE_1602_0203,
  TABLE_1602_0301,
  type GeologicalPrice
} from '@/modules/norms/2025/section2-geological/tables';

import {
  GEOLOGICAL_COEFFICIENTS,
  getDepthCoefficient,
  getDrillingVolumeCoefficient
} from '@/modules/norms/2025/section2-geological/coefficients';

import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры расчёта буровых работ
 */
export interface DrillingParams {
  // Основные параметры
  drillingMethod: 'manual' | 'light_mechanical' | 'heavy_mechanical' | 'pit';
  soilCategory: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  
  // Для скважин
  wellsCount?: number;        // Количество скважин
  depthPerWell?: number;      // Глубина одной скважины, м
  
  // Для шурфов
  pitsCount?: number;         // Количество шурфов
  volumePerPit?: number;      // Объём одного шурфа, м³

  // Коэффициенты условий
  season?: 'summer' | 'winter';
  waterSaturation?: 'dry' | 'moist' | 'saturated' | 'flooded';
  developmentDensity?: 'open' | 'low_density' | 'medium_density' | 'high_density';
  remoteness?: 'nearby' | 'moderate' | 'remote' | 'very_remote' | 'extremely_remote';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
  complexity?: 'simple' | 'medium' | 'complex' | 'very_complex';
  
  // Особые условия
  hasPermafrost?: boolean;
  hasKarst?: boolean;
  hasLandslide?: boolean;
  seismicity?: 0 | 6 | 7 | 8 | 9 | 10;
  isContaminated?: boolean;
  isAggressive?: boolean;
}

/**
 * Результат расчёта буровых работ
 */
export interface DrillingResult {
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
 * РАСЧЁТ БУРОВЫХ РАБОТ
 */
export async function calculateDrilling(
  params: DrillingParams
): Promise<DrillingResult> {
  // ШАГ 1: Выбрать таблицу цен
  const priceTable = selectDrillingTable(params.drillingMethod);

  // ШАГ 2: Найти базовую цену по категории грунта
  const priceEntry = priceTable.find(entry => entry.soilCategory === params.soilCategory);

  if (!priceEntry) {
    throw new Error(
      `Не найдена цена для метода ${params.drillingMethod}, категория грунта ${params.soilCategory}`
    );
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 3: Рассчитать общий объём работ
  let totalQuantity: number;
  let unit: string;

  if (params.drillingMethod === 'pit') {
    // Для шурфов - объём в м³
    totalQuantity = (params.pitsCount || 0) * (params.volumePerPit || 0);
    unit = 'м³';
  } else {
    // Для скважин - глубина в м
    totalQuantity = (params.wellsCount || 0) * (params.depthPerWell || 0);
    unit = 'м';
  }

  if (totalQuantity <= 0) {
    throw new Error('Количество работ должно быть больше нуля');
  }

  // ШАГ 4: Собрать коэффициенты
  const coefficientsApplied = collectDrillingCoefficients(params, totalQuantity);

  // ШАГ 5: Общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 6: Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * totalQuantity);

  // ШАГ 7: Сформировать позицию сметы
  const items = [
    {
      code: priceEntry.code,
      workType: generateDrillingWorkDescription(params),
      unit,
      quantity: roundPrice(totalQuantity),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 2',
      tableReference: getTableReference(params.drillingMethod),
      notes: generateDrillingNotes(params)
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

/**
 * Выбор таблицы цен по методу бурения
 */
function selectDrillingTable(method: string): GeologicalPrice[] {
  switch (method) {
    case 'manual':
      return TABLE_1602_0201;
    case 'light_mechanical':
      return TABLE_1602_0202;
    case 'heavy_mechanical':
      return TABLE_1602_0203;
    case 'pit':
      return TABLE_1602_0301;
    default:
      throw new Error(`Неизвестный метод бурения: ${method}`);
  }
}

/**
 * Сбор коэффициентов для буровых работ
 */
function collectDrillingCoefficients(
  params: DrillingParams,
  totalQuantity: number
): Record<string, number> {
  const coefficients: Record<string, number> = {};

  // Коэффициент объёма (скидка)
  if (params.drillingMethod !== 'pit') {
    coefficients.volume = getDrillingVolumeCoefficient(totalQuantity);
  }

  // Сезонный коэффициент
  if (params.season) {
    coefficients.season = GEOLOGICAL_COEFFICIENTS.SEASONAL[params.season];
  }

  // Глубина (только для скважин)
  if (params.depthPerWell && params.drillingMethod !== 'pit') {
    const depthCoef = getDepthCoefficient(params.depthPerWell);
    if (depthCoef > 1.0) {
      coefficients.depth = depthCoef;
    }
  }

  // Обводнённость
  if (params.waterSaturation) {
    coefficients.waterSaturation = 
      GEOLOGICAL_COEFFICIENTS.WATER_SATURATION[params.waterSaturation];
  }

  // Застройка
  if (params.developmentDensity) {
    coefficients.development = 
      GEOLOGICAL_COEFFICIENTS.DEVELOPMENT[params.developmentDensity];
  }

  // Удалённость
  if (params.remoteness) {
    coefficients.remoteness = 
      GEOLOGICAL_COEFFICIENTS.REMOTENESS[params.remoteness];
  }

  // Срочность
  if (params.urgency) {
    coefficients.urgency = GEOLOGICAL_COEFFICIENTS.URGENCY[params.urgency];
  }

  // Сложность условий
  if (params.complexity) {
    coefficients.complexity = 
      GEOLOGICAL_COEFFICIENTS.COMPLEXITY[params.complexity];
  }

  // Особые условия
  if (params.hasPermafrost) {
    coefficients.permafrost = 
      GEOLOGICAL_COEFFICIENTS.SPECIAL_CONDITIONS.permafrost;
  }

  if (params.hasKarst) {
    coefficients.karst = GEOLOGICAL_COEFFICIENTS.SPECIAL_CONDITIONS.karst;
  }

  if (params.hasLandslide) {
    coefficients.landslide = 
      GEOLOGICAL_COEFFICIENTS.SPECIAL_CONDITIONS.landslide;
  }

  if (params.seismicity && params.seismicity > 0) {
    coefficients.seismicity = 
      GEOLOGICAL_COEFFICIENTS.SPECIAL_CONDITIONS.seismic[params.seismicity];
  }

  if (params.isContaminated) {
    coefficients.contaminated = 
      GEOLOGICAL_COEFFICIENTS.SPECIAL_CONDITIONS.contaminated;
  }

  if (params.isAggressive) {
    coefficients.aggressive = 
      GEOLOGICAL_COEFFICIENTS.SPECIAL_CONDITIONS.aggressive;
  }

  return coefficients;
}

/**
 * Генерация описания работ
 */
function generateDrillingWorkDescription(params: DrillingParams): string {
  const methodNames = {
    manual: 'Бурение скважин ручным способом',
    light_mechanical: 'Бурение скважин лёгким механизированным способом',
    heavy_mechanical: 'Бурение скважин тяжёлым механизированным способом',
    pit: 'Проходка шурфов'
  };

  const categoryNames = {
    I: 'I категория (песок, супесь)',
    II: 'II категория (суглинок мягкопластичный)',
    III: 'III категория (суглинок тугопластичный, глина мягкопластичная)',
    IV: 'IV категория (глина тугопластичная)',
    V: 'V категория (глина твердая)',
    VI: 'VI категория (скальные грунты)'
  };

  return `${methodNames[params.drillingMethod]}, ${categoryNames[params.soilCategory]}`;
}

/**
 * Получение ссылки на таблицу
 */
function getTableReference(method: string): string {
  const tableMap = {
    manual: '1602-0201',
    light_mechanical: '1602-0202',
    heavy_mechanical: '1602-0203',
    pit: '1602-0301'
  };
  return tableMap[method as keyof typeof tableMap];
}

/**
 * Генерация примечаний
 */
function generateDrillingNotes(params: DrillingParams): string {
  const notes: string[] = [];

  if (params.drillingMethod === 'pit') {
    notes.push(`${params.pitsCount} шурфов × ${params.volumePerPit} м³`);
  } else {
    notes.push(`${params.wellsCount} скважин × ${params.depthPerWell} м`);
  }

  if (params.season === 'winter') {
    notes.push('зимние условия');
  }

  if (params.waterSaturation && params.waterSaturation !== 'dry') {
    const waterNames = {
      moist: 'влажные грунты',
      saturated: 'водонасыщенные грунты',
      flooded: 'затопленные условия'
    };
    notes.push(waterNames[params.waterSaturation]);
  }

  const specialConditions: string[] = [];
  if (params.hasPermafrost) specialConditions.push('вечная мерзлота');
  if (params.hasKarst) specialConditions.push('карст');
  if (params.hasLandslide) specialConditions.push('оползни');
  if (params.isContaminated) specialConditions.push('загрязнение');

  if (specialConditions.length > 0) {
    notes.push(`особые условия: ${specialConditions.join(', ')}`);
  }

  return notes.join('; ');
}

export default calculateDrilling;
