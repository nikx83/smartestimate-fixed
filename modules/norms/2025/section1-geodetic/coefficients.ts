/**
 * Путь: /modules/norms/2025/section1-geodetic/coefficients.ts
 * Назначение: Коэффициенты для расчёта стоимости геодезических работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

/**
 * СЕЗОННЫЕ КОЭФФИЦИЕНТЫ
 * Применяются ко всем видам геодезических работ
 */
export const SEASONAL_COEFFICIENTS = {
  summer: 1.0,    // Летний период (апрель-октябрь)
  winter: 1.3     // Зимний период (ноябрь-март)
} as const;

/**
 * КОЭФФИЦИЕНТЫ РЕЛЬЕФА МЕСТНОСТИ
 * Применяются для топографических съёмок
 */
export const TERRAIN_COEFFICIENTS = {
  flat: 1.0,              // Равнинная местность (уклон до 2°)
  hilly: 1.2,             // Холмистая местность (уклон 2-6°)
  mountainous: 1.5,       // Горная местность (уклон 6-15°)
  steep_mountainous: 1.8  // Высокогорная местность (уклон более 15°)
} as const;

/**
 * КОЭФФИЦИЕНТЫ РАСТИТЕЛЬНОСТИ
 * Применяются для топографических съёмок
 */
export const VEGETATION_COEFFICIENTS = {
  none: 1.0,           // Отсутствие растительности
  grass: 1.1,          // Травяной покров
  bushes: 1.2,         // Кустарник
  sparse_forest: 1.3,  // Редколесье
  dense_forest: 1.5    // Густой лес
} as const;

/**
 * КОЭФФИЦИЕНТЫ ЗАСТРОЙКИ
 * Применяются для работ на застроенных территориях
 */
export const DEVELOPMENT_COEFFICIENTS = {
  undeveloped: 1.0,         // Незастроенная территория
  low_density: 1.15,        // Слабо застроенная (до 10%)
  medium_density: 1.3,      // Средне застроенная (10-30%)
  high_density: 1.5,        // Плотно застроенная (30-50%)
  very_high_density: 1.7    // Особо плотная застройка (более 50%)
} as const;

/**
 * КОЭФФИЦИЕНТЫ КОММУНИКАЦИЙ
 * Применяются при съёмке подземных и надземных коммуникаций
 */
export const UTILITIES_COEFFICIENTS = {
  none: 1.0,              // Без коммуникаций
  low: 1.2,               // Малонасыщенная (до 5 сетей на га)
  medium: 1.4,            // Средненасыщенная (5-10 сетей на га)
  high: 1.6,              // Высоконасыщенная (10-20 сетей на га)
  very_high: 1.8          // Особо насыщенная (более 20 сетей на га)
} as const;

/**
 * КОЭФФИЦИЕНТЫ ТОЧНОСТИ РАБОТ
 * Применяются при повышенных требованиях к точности
 */
export const ACCURACY_COEFFICIENTS = {
  standard: 1.0,      // Стандартная точность
  increased: 1.3,     // Повышенная точность (в 1.5 раза выше стандарта)
  high: 1.5,          // Высокая точность (в 2 раза выше стандарта)
  ultra_high: 1.8     // Особо высокая точность (в 3 раза выше стандарта)
} as const;

/**
 * КОЭФФИЦИЕНТЫ СРОЧНОСТИ
 * Применяются при сокращённых сроках выполнения
 */
export const URGENCY_COEFFICIENTS = {
  normal: 1.0,        // Обычные сроки
  urgent: 1.3,        // Срочно (сокращение сроков на 30%)
  very_urgent: 1.5    // Особо срочно (сокращение сроков на 50%)
} as const;

/**
 * КОЭФФИЦИЕНТЫ УДАЛЁННОСТИ
 * Применяются при работах вдали от населённых пунктов
 */
export const REMOTENESS_COEFFICIENTS = {
  nearby: 1.0,              // До 5 км от населённого пункта
  moderate: 1.15,           // 5-25 км
  remote: 1.3,              // 25-100 км
  very_remote: 1.5,         // 100-300 км
  extremely_remote: 1.8     // Более 300 км
} as const;

/**
 * КОЭФФИЦИЕНТЫ СЕЙСМИЧНОСТИ
 * Применяются в сейсмоопасных районах
 */
export const SEISMICITY_COEFFICIENTS = {
  0: 1.0,
  6: 1.1,
  7: 1.2,
  8: 1.3,
  9: 1.4,
  10: 1.5
} as const;

/**
 * КОЭФФИЦИЕНТЫ ОБЪЁМА РАБОТ
 * Применяются при больших объёмах (скидка)
 */
export const VOLUME_COEFFICIENTS = {
  small: 1.0,           // До 10 га
  medium: 0.95,         // 10-50 га
  large: 0.9,           // 50-200 га
  very_large: 0.85,     // 200-500 га
  extra_large: 0.8      // Более 500 га
} as const;

/**
 * Функция определения коэффициента объёма по площади
 */
export function getVolumeCoefficient(area: number): number {
  if (area < 10) return VOLUME_COEFFICIENTS.small;
  if (area < 50) return VOLUME_COEFFICIENTS.medium;
  if (area < 200) return VOLUME_COEFFICIENTS.large;
  if (area < 500) return VOLUME_COEFFICIENTS.very_large;
  return VOLUME_COEFFICIENTS.extra_large;
}

/**
 * КОЭФФИЦИЕНТЫ МАСШТАБА
 * Уже учтены в базовых ценах таблиц, но для справки:
 */
export const SCALE_INFO = {
  '1:500': 'Максимальная детальность (застроенные территории)',
  '1:1000': 'Высокая детальность (населённые пункты)',
  '1:2000': 'Средняя детальность (промышленные площадки)',
  '1:5000': 'Обзорная съёмка (предпроектная стадия)'
} as const;

/**
 * Применение всех коэффициентов
 * Коэффициенты ПЕРЕМНОЖАЮТСЯ
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
export const GEODETIC_COEFFICIENTS = {
  SEASONAL: SEASONAL_COEFFICIENTS,
  TERRAIN: TERRAIN_COEFFICIENTS,
  VEGETATION: VEGETATION_COEFFICIENTS,
  DEVELOPMENT: DEVELOPMENT_COEFFICIENTS,
  UTILITIES: UTILITIES_COEFFICIENTS,
  ACCURACY: ACCURACY_COEFFICIENTS,
  URGENCY: URGENCY_COEFFICIENTS,
  REMOTENESS: REMOTENESS_COEFFICIENTS,
  SEISMICITY: SEISMICITY_COEFFICIENTS,
  VOLUME: VOLUME_COEFFICIENTS
} as const;

export default GEODETIC_COEFFICIENTS;
