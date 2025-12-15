/**
 * Путь: /modules/calculations/geodetic/topographic-survey.ts
 * Назначение: Расчёт стоимости топографической съёмки
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

import {
  TABLE_1601_0101,
  TABLE_1601_0102,
  TABLE_1601_0103,
  TABLE_1601_0104,
  type GeodeticPrice
} from '@/modules/norms/2025/section1-geodetic/tables';

import {
  GEODETIC_COEFFICIENTS,
  getVolumeCoefficient
} from '@/modules/norms/2025/section1-geodetic/coefficients';

import { roundPrice } from '@/modules/calculations/base/utils';

/**
 * Параметры расчёта топографической съёмки
 */
export interface TopographicSurveyParams {
  // Основные параметры
  scale: '1:500' | '1:1000' | '1:2000' | '1:5000';
  area: number; // га
  category: 'I' | 'II' | 'III' | 'IV';

  // Коэффициенты условий
  season?: 'summer' | 'winter';
  terrain?: 'flat' | 'hilly' | 'mountainous' | 'steep_mountainous';
  vegetation?: 'none' | 'grass' | 'bushes' | 'sparse_forest' | 'dense_forest';
  developmentDensity?: 'undeveloped' | 'low_density' | 'medium_density' | 'high_density' | 'very_high_density';
  utilitiesDensity?: 'none' | 'low' | 'medium' | 'high' | 'very_high';
  
  // Дополнительные условия
  accuracyRequirement?: 'standard' | 'increased' | 'high' | 'ultra_high';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
  remoteness?: 'nearby' | 'moderate' | 'remote' | 'very_remote' | 'extremely_remote';
  seismicity?: 0 | 6 | 7 | 8 | 9 | 10;
}

/**
 * Результат расчёта
 */
export interface TopographicSurveyResult {
  totalCost: number;
  basePrice: number;
  coefficients: Record<string, number>;
  items: EstimateItem[];
  metadata: {
    section: string;
    module: string;
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
 * ОСНОВНАЯ ФУНКЦИЯ РАСЧЁТА ТОПОГРАФИЧЕСКОЙ СЪЁМКИ
 */
export async function calculateTopographicSurvey(
  params: TopographicSurveyParams
): Promise<TopographicSurveyResult> {
  // ШАГ 1: Выбрать таблицу цен по масштабу
  const priceTable = selectPriceTableByScale(params.scale);

  // ШАГ 2: Найти базовую цену по категории
  const priceEntry = priceTable.find(entry => entry.category === params.category);

  if (!priceEntry) {
    throw new Error(
      `Не найдена цена для масштаба ${params.scale}, категория ${params.category}`
    );
  }

  const basePrice = priceEntry.pricePerUnit;

  // ШАГ 3: Собрать применимые коэффициенты
  const coefficientsApplied = collectCoefficients(params);

  // ШАГ 4: Рассчитать общий коэффициент
  const totalCoefficient = Object.values(coefficientsApplied).reduce(
    (acc, coef) => acc * coef,
    1
  );

  // ШАГ 5: Рассчитать стоимость с коэффициентами
  const priceWithCoefficients = basePrice * totalCoefficient;

  // ШАГ 6: Итоговая стоимость
  const totalCost = roundPrice(priceWithCoefficients * params.area);

  // ШАГ 7: Сформировать позицию сметы
  const items: EstimateItem[] = [
    {
      code: priceEntry.code,
      workType: `Топографическая съёмка масштаба ${params.scale}, категория ${params.category}`,
      unit: 'га',
      quantity: roundPrice(params.area),
      unitPrice: basePrice,
      coefficient: roundPrice(totalCoefficient),
      cost: totalCost,
      section: 'Раздел 1',
      tableReference: getTableReference(params.scale),
      notes: generateNotes(params)
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
 * Выбор таблицы цен по масштабу
 */
function selectPriceTableByScale(scale: string): GeodeticPrice[] {
  switch (scale) {
    case '1:500':
      return TABLE_1601_0101;
    case '1:1000':
      return TABLE_1601_0102;
    case '1:2000':
      return TABLE_1601_0103;
    case '1:5000':
      return TABLE_1601_0104;
    default:
      throw new Error(`Неизвестный масштаб: ${scale}`);
  }
}

/**
 * Сбор применимых коэффициентов
 */
function collectCoefficients(params: TopographicSurveyParams): Record<string, number> {
  const coefficients: Record<string, number> = {};

  // Коэффициент объёма (скидка при больших площадях)
  coefficients.volume = getVolumeCoefficient(params.area);

  // Сезонный коэффициент
  if (params.season) {
    coefficients.season = GEODETIC_COEFFICIENTS.SEASONAL[params.season];
  }

  // Рельеф местности
  if (params.terrain) {
    coefficients.terrain = GEODETIC_COEFFICIENTS.TERRAIN[params.terrain];
  }

  // Растительность
  if (params.vegetation) {
    coefficients.vegetation = GEODETIC_COEFFICIENTS.VEGETATION[params.vegetation];
  }

  // Плотность застройки
  if (params.developmentDensity) {
    coefficients.development = GEODETIC_COEFFICIENTS.DEVELOPMENT[params.developmentDensity];
  }

  // Коммуникации
  if (params.utilitiesDensity) {
    coefficients.utilities = GEODETIC_COEFFICIENTS.UTILITIES[params.utilitiesDensity];
  }

  // Требования к точности
  if (params.accuracyRequirement) {
    coefficients.accuracy = GEODETIC_COEFFICIENTS.ACCURACY[params.accuracyRequirement];
  }

  // Срочность
  if (params.urgency) {
    coefficients.urgency = GEODETIC_COEFFICIENTS.URGENCY[params.urgency];
  }

  // Удалённость
  if (params.remoteness) {
    coefficients.remoteness = GEODETIC_COEFFICIENTS.REMOTENESS[params.remoteness];
  }

  // Сейсмичность
  if (params.seismicity && params.seismicity > 0) {
    coefficients.seismicity = GEODETIC_COEFFICIENTS.SEISMICITY[params.seismicity];
  }

  return coefficients;
}

/**
 * Получение ссылки на таблицу
 */
function getTableReference(scale: string): string {
  const tableMap = {
    '1:500': '1601-0101',
    '1:1000': '1601-0102',
    '1:2000': '1601-0103',
    '1:5000': '1601-0104'
  };
  return tableMap[scale as keyof typeof tableMap];
}

/**
 * Генерация примечаний
 */
function generateNotes(params: TopographicSurveyParams): string {
  const notes: string[] = [];

  if (params.season === 'winter') {
    notes.push('Зимние условия работ');
  }

  if (params.terrain && params.terrain !== 'flat') {
    const terrainNames = {
      hilly: 'холмистый рельеф',
      mountainous: 'горный рельеф',
      steep_mountainous: 'высокогорный рельеф'
    };
    notes.push(terrainNames[params.terrain]);
  }

  if (params.vegetation && params.vegetation !== 'none') {
    const vegNames = {
      grass: 'травяной покров',
      bushes: 'кустарник',
      sparse_forest: 'редколесье',
      dense_forest: 'густой лес'
    };
    notes.push(vegNames[params.vegetation]);
  }

  if (params.accuracyRequirement && params.accuracyRequirement !== 'standard') {
    notes.push('Повышенные требования к точности');
  }

  if (params.urgency && params.urgency !== 'normal') {
    notes.push('Сокращённые сроки');
  }

  return notes.join('; ');
}

export default calculateTopographicSurvey;
