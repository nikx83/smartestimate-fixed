/**
 * Путь: /modules/norms/2025/section3-hydrographic/coefficients.ts
 * Назначение: Коэффициенты для расчёта стоимости гидрографических работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3
 */

/**
 * СЕЗОННЫЕ КОЭФФИЦИЕНТЫ
 */
export const SEASONAL_COEFFICIENTS = {
  spring: 1.2,      // Весенний период (паводок, ледоход)
  summer: 1.0,      // Летний период (навигация)
  autumn: 1.15,     // Осенний период (штормы)
  winter: 1.4       // Зимний период (ледовая обстановка)
} as const;

/**
 * КОЭФФИЦИЕНТЫ ЛЕДОВЫХ УСЛОВИЙ
 */
export const ICE_CONDITIONS_COEFFICIENTS = {
  open_water: 1.0,        // Чистая вода
  thin_ice: 1.3,          // Тонкий лёд (до 20 см)
  thick_ice: 1.5,         // Толстый лёд (20-50 см)
  very_thick_ice: 1.8,    // Очень толстый лёд (более 50 см)
  ice_drift: 1.6          // Ледоход
} as const;

/**
 * КОЭФФИЦИЕНТЫ ГИДРОМЕТЕОРОЛОГИЧЕСКИХ УСЛОВИЙ
 */
export const WEATHER_CONDITIONS_COEFFICIENTS = {
  calm: 1.0,              // Штиль (волнение 0-1 балла)
  light: 1.1,             // Слабое волнение (2-3 балла)
  moderate: 1.3,          // Умеренное волнение (4-5 баллов)
  rough: 1.5,             // Сильное волнение (6-7 баллов)
  storm: 1.8              // Шторм (8+ баллов)
} as const;

/**
 * КОЭФФИЦИЕНТЫ ГЛУБИНЫ ВОДОЁМА
 */
export const DEPTH_COEFFICIENTS = {
  shallow: 1.0,           // Мелководье (до 5 м)
  medium: 1.1,            // Средние глубины (5-20 м)
  deep: 1.2,              // Глубоководье (20-50 м)
  very_deep: 1.3          // Очень глубокое (более 50 м)
} as const;

/**
 * КОЭФФИЦИЕНТЫ УДАЛЁННОСТИ ОТ БАЗЫ
 */
export const REMOTENESS_COEFFICIENTS = {
  nearby: 1.0,              // До 10 км от базы
  moderate: 1.15,           // 10-50 км
  remote: 1.3,              // 50-200 км
  very_remote: 1.5,         // 200-500 км
  extremely_remote: 1.8     // Более 500 км
} as const;

/**
 * КОЭФФИЦИЕНТЫ ТИПА ВОДОЁМА
 */
export const WATER_BODY_TYPE_COEFFICIENTS = {
  lake: 1.0,              // Озеро, водохранилище
  slow_river: 1.1,        // Медленная река (до 0.5 м/с)
  medium_river: 1.2,      // Средняя река (0.5-1.5 м/с)
  fast_river: 1.4,        // Быстрая река (1.5-3.0 м/с)
  mountain_river: 1.6,    // Горная река (более 3.0 м/с)
  coastal_sea: 1.3,       // Прибрежная морская зона
  open_sea: 1.5           // Открытое море
} as const;

/**
 * КОЭФФИЦИЕНТЫ НАВИГАЦИОННЫХ УСЛОВИЙ
 */
export const NAVIGATION_COEFFICIENTS = {
  good: 1.0,              // Хорошие условия (широкий фарватер)
  satisfactory: 1.15,     // Удовлетворительные (узкий фарватер)
  difficult: 1.3,         // Затруднённые (мели, перекаты)
  very_difficult: 1.5     // Особо сложные (пороги, теснины)
} as const;

/**
 * КОЭФФИЦИЕНТЫ СРОЧНОСТИ
 */
export const URGENCY_COEFFICIENTS = {
  normal: 1.0,        // Обычные сроки
  urgent: 1.3,        // Срочно (сокращение на 30%)
  very_urgent: 1.5    // Особо срочно (сокращение на 50%)
} as const;

/**
 * КОЭФФИЦИЕНТЫ ОБЪЁМА РАБОТ (скидка)
 */
export const VOLUME_COEFFICIENTS = {
  depth_sounding: {
    'до 10 км': 1.0,
    '10-50 км': 0.95,
    '50-200 км': 0.9,
    '200-500 км': 0.85,
    'свыше 500 км': 0.8
  },
  observations: {
    'до 1 месяца': 1.0,
    '1-3 месяца': 0.95,
    '3-6 месяцев': 0.9,
    '6-12 месяцев': 0.85,
    'свыше года': 0.8
  }
} as const;

/**
 * КОЭФФИЦИЕНТЫ ТРЕБОВАНИЙ К ТОЧНОСТИ
 */
export const ACCURACY_COEFFICIENTS = {
  standard: 1.0,      // Стандартная точность
  increased: 1.2,     // Повышенная точность
  high: 1.4,          // Высокая точность
  ultra_high: 1.6     // Особо высокая точность
} as const;

/**
 * Функция определения коэффициента объёма промеров
 */
export function getDepthSoundingVolumeCoefficient(distance: number): number {
  if (distance < 10) return VOLUME_COEFFICIENTS.depth_sounding['до 10 км'];
  if (distance < 50) return VOLUME_COEFFICIENTS.depth_sounding['10-50 км'];
  if (distance < 200) return VOLUME_COEFFICIENTS.depth_sounding['50-200 км'];
  if (distance < 500) return VOLUME_COEFFICIENTS.depth_sounding['200-500 км'];
  return VOLUME_COEFFICIENTS.depth_sounding['свыше 500 км'];
}

/**
 * Функция определения коэффициента объёма наблюдений
 */
export function getObservationsVolumeCoefficient(months: number): number {
  if (months < 1) return VOLUME_COEFFICIENTS.observations['до 1 месяца'];
  if (months < 3) return VOLUME_COEFFICIENTS.observations['1-3 месяца'];
  if (months < 6) return VOLUME_COEFFICIENTS.observations['3-6 месяцев'];
  if (months < 12) return VOLUME_COEFFICIENTS.observations['6-12 месяцев'];
  return VOLUME_COEFFICIENTS.observations['свыше года'];
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
export const HYDROGRAPHIC_COEFFICIENTS = {
  SEASONAL: SEASONAL_COEFFICIENTS,
  ICE_CONDITIONS: ICE_CONDITIONS_COEFFICIENTS,
  WEATHER: WEATHER_CONDITIONS_COEFFICIENTS,
  DEPTH: DEPTH_COEFFICIENTS,
  REMOTENESS: REMOTENESS_COEFFICIENTS,
  WATER_BODY_TYPE: WATER_BODY_TYPE_COEFFICIENTS,
  NAVIGATION: NAVIGATION_COEFFICIENTS,
  URGENCY: URGENCY_COEFFICIENTS,
  ACCURACY: ACCURACY_COEFFICIENTS,
  VOLUME: VOLUME_COEFFICIENTS
} as const;

export default HYDROGRAPHIC_COEFFICIENTS;
