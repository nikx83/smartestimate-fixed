/**
 * Путь: /modules/norms/2025/section2-geological/coefficients.ts
 * Назначение: Коэффициенты для расчёта стоимости геологических работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2
 */

/**
 * КАТЕГОРИИ ГРУНТОВ ПО БУРИМОСТИ
 */
export const SOIL_CATEGORIES = {
  I: {
    name: 'I категория',
    description: 'Песок, супесь',
    examples: ['Песок любой влажности', 'Супесь пластичная', 'Насыпные грунты']
  },
  II: {
    name: 'II категория',
    description: 'Суглинок мягкопластичный',
    examples: ['Суглинок мягкопластичный', 'Торф', 'Растительный слой']
  },
  III: {
    name: 'III категория',
    description: 'Суглинок тугопластичный, глина мягкопластичная',
    examples: ['Суглинок тугопластичный', 'Глина мягкопластичная', 'Лёссовые грунты']
  },
  IV: {
    name: 'IV категория',
    description: 'Глина тугопластичная, суглинок твердый',
    examples: ['Глина тугопластичная', 'Суглинок твердый', 'Мергель']
  },
  V: {
    name: 'V категория',
    description: 'Глина твердая',
    examples: ['Глина твердая', 'Аргиллиты слабые']
  },
  VI: {
    name: 'VI категория',
    description: 'Полускальные и скальные грунты',
    examples: ['Известняк', 'Песчаник', 'Выветрелые скальные породы']
  }
} as const;

/**
 * СЕЗОННЫЕ КОЭФФИЦИЕНТЫ
 */
export const SEASONAL_COEFFICIENTS = {
  summer: 1.0,    // Летний период (апрель-октябрь)
  winter: 1.3     // Зимний период (ноябрь-март)
} as const;

/**
 * КОЭФФИЦИЕНТЫ ГЛУБИНЫ БУРЕНИЯ
 * Применяются при глубине скважин более 30 м
 */
export const DEPTH_COEFFICIENTS = {
  'до 10м': 1.0,
  '10-20м': 1.0,
  '20-30м': 1.0,
  '30-50м': 1.15,
  '50-80м': 1.3,
  'свыше 80м': 1.5
} as const;

/**
 * КОЭФФИЦИЕНТЫ ОБВОДНЁННОСТИ
 */
export const WATER_SATURATION_COEFFICIENTS = {
  dry: 1.0,           // Сухие грунты
  moist: 1.1,         // Влажные грунты
  saturated: 1.2,     // Водонасыщенные грунты
  flooded: 1.3        // Затопленные условия
} as const;

/**
 * КОЭФФИЦИЕНТЫ ПЛОТНОСТИ ЗАСТРОЙКИ
 */
export const DEVELOPMENT_COEFFICIENTS = {
  open: 1.0,              // Открытая территория
  low_density: 1.15,      // Слабо застроенная
  medium_density: 1.3,    // Средне застроенная
  high_density: 1.5       // Плотно застроенная
} as const;

/**
 * КОЭФФИЦИЕНТЫ УДАЛЁННОСТИ
 */
export const REMOTENESS_COEFFICIENTS = {
  nearby: 1.0,              // До 5 км от базы
  moderate: 1.15,           // 5-25 км
  remote: 1.3,              // 25-100 км
  very_remote: 1.5,         // 100-300 км
  extremely_remote: 1.8     // Более 300 км
} as const;

/**
 * КОЭФФИЦИЕНТЫ СРОЧНОСТИ
 */
export const URGENCY_COEFFICIENTS = {
  normal: 1.0,        // Обычные сроки
  urgent: 1.3,        // Срочно
  very_urgent: 1.5    // Особо срочно
} as const;

/**
 * КОЭФФИЦИЕНТЫ СЛОЖНОСТИ ГРУНТОВЫХ УСЛОВИЙ
 */
export const COMPLEXITY_COEFFICIENTS = {
  simple: 1.0,              // Простые условия (однородный грунт)
  medium: 1.2,              // Средние условия (2-3 слоя)
  complex: 1.4,             // Сложные условия (многослойность)
  very_complex: 1.6         // Особо сложные (карст, оползни, мерзлота)
} as const;

/**
 * КОЭФФИЦИЕНТЫ ОСОБЫХ УСЛОВИЙ
 */
export const SPECIAL_CONDITIONS_COEFFICIENTS = {
  permafrost: 1.5,          // Вечномерзлые грунты
  karst: 1.4,               // Карстовые явления
  landslide: 1.4,           // Оползневые территории
  seismic: {                // Сейсмичность
    6: 1.1,
    7: 1.2,
    8: 1.3,
    9: 1.4,
    10: 1.5
  },
  contaminated: 1.3,        // Загрязнённые грунты
  aggressive: 1.2           // Агрессивная среда
} as const;

/**
 * КОЭФФИЦИЕНТЫ ОБЪЁМА РАБОТ (скидка при больших объёмах)
 */
export const VOLUME_COEFFICIENTS = {
  drilling: {
    'до 100м': 1.0,
    '100-500м': 0.95,
    '500-1000м': 0.9,
    '1000-2000м': 0.85,
    'свыше 2000м': 0.8
  },
  laboratory: {
    'до 20 проб': 1.0,
    '20-50 проб': 0.95,
    '50-100 проб': 0.9,
    '100-200 проб': 0.85,
    'свыше 200 проб': 0.8
  }
} as const;

/**
 * Функция определения коэффициента глубины
 */
export function getDepthCoefficient(depth: number): number {
  if (depth <= 30) return DEPTH_COEFFICIENTS['до 10м'];
  if (depth <= 50) return DEPTH_COEFFICIENTS['30-50м'];
  if (depth <= 80) return DEPTH_COEFFICIENTS['50-80м'];
  return DEPTH_COEFFICIENTS['свыше 80м'];
}

/**
 * Функция определения коэффициента объёма бурения
 */
export function getDrillingVolumeCoefficient(totalDepth: number): number {
  if (totalDepth < 100) return VOLUME_COEFFICIENTS.drilling['до 100м'];
  if (totalDepth < 500) return VOLUME_COEFFICIENTS.drilling['100-500м'];
  if (totalDepth < 1000) return VOLUME_COEFFICIENTS.drilling['500-1000м'];
  if (totalDepth < 2000) return VOLUME_COEFFICIENTS.drilling['1000-2000м'];
  return VOLUME_COEFFICIENTS.drilling['свыше 2000м'];
}

/**
 * Функция определения коэффициента объёма лабораторных работ
 */
export function getLaboratoryVolumeCoefficient(samplesCount: number): number {
  if (samplesCount < 20) return VOLUME_COEFFICIENTS.laboratory['до 20 проб'];
  if (samplesCount < 50) return VOLUME_COEFFICIENTS.laboratory['20-50 проб'];
  if (samplesCount < 100) return VOLUME_COEFFICIENTS.laboratory['50-100 проб'];
  if (samplesCount < 200) return VOLUME_COEFFICIENTS.laboratory['100-200 проб'];
  return VOLUME_COEFFICIENTS.laboratory['свыше 200 проб'];
}

/**
 * Применение всех коэффициентов
 */
export function applyCoefficients(
  basePrice: number,
  coefficients: number[]
): number {
  const totalCoefficient = coefficients.reduce((acc, coef) => acc * coef, 1);
  return basePrice * totalCoefficient;
}

/**
 * Экспорт всех коэффициентов одним объектом
 */
export const GEOLOGICAL_COEFFICIENTS = {
  SEASONAL: SEASONAL_COEFFICIENTS,
  DEPTH: DEPTH_COEFFICIENTS,
  WATER_SATURATION: WATER_SATURATION_COEFFICIENTS,
  DEVELOPMENT: DEVELOPMENT_COEFFICIENTS,
  REMOTENESS: REMOTENESS_COEFFICIENTS,
  URGENCY: URGENCY_COEFFICIENTS,
  COMPLEXITY: COMPLEXITY_COEFFICIENTS,
  SPECIAL_CONDITIONS: SPECIAL_CONDITIONS_COEFFICIENTS,
  VOLUME: VOLUME_COEFFICIENTS
} as const;

export default GEOLOGICAL_COEFFICIENTS;
