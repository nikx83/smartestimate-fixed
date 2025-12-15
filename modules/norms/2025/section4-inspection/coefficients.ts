/**
 * Путь: /modules/norms/2025/section4-inspection/coefficients.ts
 * Назначение: Все коэффициенты для расчёта стоимости обследований
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, Таблицы 1, 2, 3
 */

/**
 * ТАБЛИЦА 1 - Коэффициенты в зависимости от шага несущих конструкций
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 2, п.8
 */
export const STRUCTURE_SPACING_COEFFICIENTS = {
  'до 6м': 1.15,
  '6-12м без подстропильных': 1.00,
  '6-12м с подстропильными': 1.10,
  'свыше 12м': 1.10
} as const;

/**
 * ТАБЛИЦА 2 - Коэффициенты для учёта сложных условий выполнения работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 2-3, п.10
 */
export const COMPLEX_CONDITIONS_COEFFICIENTS = {
  // 1. Вечномерзлые, просадочные, засоленные грунты и т.д.
  DIFFICULT_SOILS: 1.20,
  
  // 2. Опасное технологическое оборудование >50% площади
  HAZARDOUS_EQUIPMENT: 1.15,
  
  // 3. Зимние условия работ
  WINTER_CONDITIONS: 1.25,
  
  // 4. Обследование после землетрясений, взрывов, пожаров
  AFTER_EARTHQUAKE: 1.20,
  
  // 5. Сейсмичность района (баллы)
  SEISMICITY: {
    7: 1.20,
    8: 1.30,
    9: 1.40,
    10: 1.50
  } as const,
  
  // 6. Здание с горячими цехами (температура >40°C)
  HOT_WORKSHOPS: 1.25,
  
  // 7. Здание-памятник архитектуры
  HERITAGE_MONUMENT: 1.20,
  
  // 8. Усиление конструкций
  REINFORCEMENT_REQUIRED: 1.10,
  
  // 9. Обследование подземной части
  UNDERGROUND_PART: 1.30
} as const;

/**
 * ТАБЛИЦА 3 - Коэффициенты малых объёмов работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 3
 * Применяется при строительном объёме до 4000 м³
 */
export const SMALL_VOLUME_COEFFICIENTS = {
  'до 500': 3.5,
  '500-1000': 2.8,
  '1000-1500': 2.0,
  '1500-2000': 1.6,
  '2000-2500': 1.4,
  '2500-3000': 1.3,
  '3000-3500': 1.2,
  '3500-4000': 1.1,
  'свыше 4000': 1.0
} as const;

/**
 * Функция определения коэффициента малого объёма
 */
export function getSmallVolumeCoefficient(volume: number): number {
  if (volume < 500) return SMALL_VOLUME_COEFFICIENTS['до 500'];
  if (volume < 1000) return SMALL_VOLUME_COEFFICIENTS['500-1000'];
  if (volume < 1500) return SMALL_VOLUME_COEFFICIENTS['1000-1500'];
  if (volume < 2000) return SMALL_VOLUME_COEFFICIENTS['1500-2000'];
  if (volume < 2500) return SMALL_VOLUME_COEFFICIENTS['2000-2500'];
  if (volume < 3000) return SMALL_VOLUME_COEFFICIENTS['2500-3000'];
  if (volume < 3500) return SMALL_VOLUME_COEFFICIENTS['3000-3500'];
  if (volume < 4000) return SMALL_VOLUME_COEFFICIENTS['3500-4000'];
  return SMALL_VOLUME_COEFFICIENTS['свыше 4000'];
}

/**
 * Функция применения всех коэффициентов
 * Коэффициенты ПЕРЕМНОЖАЮТСЯ согласно п.10 СЦИ РК
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
export const COEFFICIENTS = {
  STRUCTURE_SPACING: STRUCTURE_SPACING_COEFFICIENTS,
  COMPLEX_CONDITIONS: COMPLEX_CONDITIONS_COEFFICIENTS,
  SMALL_VOLUME: SMALL_VOLUME_COEFFICIENTS
} as const;

export default COEFFICIENTS;
