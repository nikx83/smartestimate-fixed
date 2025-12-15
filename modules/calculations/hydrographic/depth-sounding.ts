/**
 * Путь: /modules/calculations/hydrographic/depth-sounding.ts
 * Назначение: Расчёт стоимости промеров глубин
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3, Глава 1
 */

import {
  TABLE_1603_0101,
  TABLE_1603_0102,
  type HydrographicPrice
} from '@/modules/norms/2025/section3-hydrographic/tables';

import {
  HYDROGRAPHIC_COEFFICIENTS,
  getDepthSoundingVolumeCoefficient
} from '@/modules/norms/2025/section3-hydrographic/coefficients';

import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры расчёта промеров глубин
 */
export interface DepthSoundingParams {
  // Основные параметры
  method: 'echo_sounder' | 'manual';
  category: 'I' | 'II' | 'III' | 'IV';
  distance: number; // км профилей

  // Условия
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  iceConditions?: 'open_water' | 'thin_ice' | 'thick_ice' | 'very_thick_ice' | 'ice_drift';
  weatherConditions?: 'calm' | 'light' | 'moderate' | 'rough' | 'storm';
  waterDepth?: 'shallow' | 'medium' | 'deep' | 'very_deep';
  remoteness?: 'nearby' | 'moderate' | 'remote' | 'very_remote' | 'extremely_remote';
  navigationConditions?: 'good' | 'satisfactory' | 'difficult' | 'very_difficult';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
  accuracyRequirement?: 'standard' | 'increased' | 'high' | 'ultra_high';
}

/**
 * Результат расчёта
 */
export interface DepthSoundingResult {
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
 * РАСЧЁТ ПРОМЕРОВ ГЛУБИН
 */
export async function calculateDepthSounding(
  params: DepthSoundingParams
): Promise<DepthSoundingResult> {
  // ШАГ 1: Выбрать таблицу по методу
  const priceTable = params.method === 'echo_sounder' 
    ? TABLE_1603_0101 
    : TABLE_1603_0102;

  // ШАГ 2: Найти базовую цену по категории
  const priceEntry = priceTable.find(entry => entry.category === params.category);

  if (!priceEntry) {
    throw new Error(
      `Не найдена цена для метода ${params.method}, категория ${params.category}`
    );
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 3: Собрать коэффициенты
  const coefficientsApplied = collectDepthSoundingCoefficients(params);

  // ШАГ 4: Общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 5: Итоговая стоимость
  const totalCost = roundPrice(basePrice * totalCoefficient * params.distance);

  // ШАГ 6: Позиция сметы
  const methodNames = {
    echo_sounder: 'Промеры глубин эхолотом',
    manual: 'Промеры глубин ручным способом'
  };

  const items = [
    {
      code: priceEntry.code,
      workType: `${methodNames[params.method]}, ${params.category} категория`,
      unit: 'км',
      quantity: roundPrice(params.distance),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 3',
      tableReference: params.method === 'echo_sounder' ? '1603-0101' : '1603-0102',
      notes: generateDepthSoundingNotes(params)
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
 * Сбор коэффициентов для промеров глубин
 */
function collectDepthSoundingCoefficients(
  params: DepthSoundingParams
): Record<string, number> {
  const coefficients: Record<string, number> = {};

  // Коэффициент объёма (скидка)
  coefficients.volume = getDepthSoundingVolumeCoefficient(params.distance);

  // Сезонный коэффициент
  if (params.season) {
    coefficients.season = HYDROGRAPHIC_COEFFICIENTS.SEASONAL[params.season];
  }

  // Ледовые условия
  if (params.iceConditions) {
    coefficients.ice = HYDROGRAPHIC_COEFFICIENTS.ICE_CONDITIONS[params.iceConditions];
  }

  // Погодные условия
  if (params.weatherConditions) {
    coefficients.weather = HYDROGRAPHIC_COEFFICIENTS.WEATHER[params.weatherConditions];
  }

  // Глубина водоёма
  if (params.waterDepth) {
    coefficients.depth = HYDROGRAPHIC_COEFFICIENTS.DEPTH[params.waterDepth];
  }

  // Удалённость
  if (params.remoteness) {
    coefficients.remoteness = HYDROGRAPHIC_COEFFICIENTS.REMOTENESS[params.remoteness];
  }

  // Навигационные условия
  if (params.navigationConditions) {
    coefficients.navigation = 
      HYDROGRAPHIC_COEFFICIENTS.NAVIGATION[params.navigationConditions];
  }

  // Срочность
  if (params.urgency) {
    coefficients.urgency = HYDROGRAPHIC_COEFFICIENTS.URGENCY[params.urgency];
  }

  // Точность
  if (params.accuracyRequirement) {
    coefficients.accuracy = 
      HYDROGRAPHIC_COEFFICIENTS.ACCURACY[params.accuracyRequirement];
  }

  return coefficients;
}

/**
 * Генерация примечаний
 */
function generateDepthSoundingNotes(params: DepthSoundingParams): string {
  const notes: string[] = [];

  notes.push(`${params.distance} км профилей`);

  if (params.season && params.season !== 'summer') {
    const seasonNames = {
      spring: 'весна (паводок)',
      autumn: 'осень',
      winter: 'зима'
    };
    notes.push(seasonNames[params.season as keyof typeof seasonNames]);
  }

  if (params.iceConditions && params.iceConditions !== 'open_water') {
    const iceNames = {
      thin_ice: 'тонкий лёд',
      thick_ice: 'толстый лёд',
      very_thick_ice: 'очень толстый лёд',
      ice_drift: 'ледоход'
    };
    notes.push(iceNames[params.iceConditions as keyof typeof iceNames]);
  }

  if (params.weatherConditions && params.weatherConditions !== 'calm') {
    const weatherNames = {
      light: 'слабое волнение',
      moderate: 'умеренное волнение',
      rough: 'сильное волнение',
      storm: 'шторм'
    };
    notes.push(weatherNames[params.weatherConditions as keyof typeof weatherNames]);
  }

  return notes.join('; ');
}

export default calculateDepthSounding;
