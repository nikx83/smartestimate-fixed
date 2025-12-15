/**
 * Путь: /modules/norms/2025/section3-hydrographic/categories.ts
 * Назначение: Определение категорий сложности гидрографических работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 3
 */

export interface HydrographicCategoryDefinition {
  category: 'I' | 'II' | 'III' | 'IV';
  name: string;
  description: string;
  characteristics: string[];
  applicableWorks: string[];
}

/**
 * КАТЕГОРИИ СЛОЖНОСТИ ГИДРОГРАФИЧЕСКИХ РАБОТ
 */
export const HYDROGRAPHIC_CATEGORIES: HydrographicCategoryDefinition[] = [
  {
    category: 'I',
    name: 'I категория - Простые условия',
    description: 'Спокойные водоёмы в благоприятных условиях',
    characteristics: [
      'Озёра и водохранилища',
      'Спокойная вода (волнение до 1 балла)',
      'Отсутствие течения или слабое течение (до 0.3 м/с)',
      'Открытая навигация',
      'Глубины до 10 м',
      'Хорошая погода'
    ],
    applicableWorks: [
      'Промеры на озёрах',
      'Наблюдения на водохранилищах',
      'Летние работы на спокойных водоёмах'
    ]
  },
  {
    category: 'II',
    name: 'II категория - Средние условия',
    description: 'Медленные реки и заливы',
    characteristics: [
      'Медленные реки (течение 0.3-0.8 м/с)',
      'Заливы, бухты',
      'Слабое волнение (2-3 балла)',
      'Глубины 10-25 м',
      'Удовлетворительная навигация',
      'Переменные погодные условия'
    ],
    applicableWorks: [
      'Промеры на реках',
      'Работы в заливах',
      'Гидрологические наблюдения'
    ]
  },
  {
    category: 'III',
    name: 'III категория - Сложные условия',
    description: 'Средние реки и прибрежные морские зоны',
    characteristics: [
      'Средние реки (течение 0.8-2.0 м/с)',
      'Прибрежная морская зона',
      'Умеренное волнение (4-5 баллов)',
      'Глубины 25-50 м',
      'Затруднённая навигация',
      'Переменная погода, периодические штормы'
    ],
    applicableWorks: [
      'Промеры на средних реках',
      'Морские прибрежные работы',
      'Работы в сложных условиях'
    ]
  },
  {
    category: 'IV',
    name: 'IV категория - Особо сложные условия',
    description: 'Быстрые реки и открытые морские акватории',
    characteristics: [
      'Быстрые и горные реки (течение более 2.0 м/с)',
      'Открытое море',
      'Сильное волнение (6+ баллов)',
      'Глубины более 50 м',
      'Особо затруднённая навигация',
      'Штормовые условия',
      'Ледовая обстановка'
    ],
    applicableWorks: [
      'Промеры на быстрых реках',
      'Открытые морские работы',
      'Зимние работы с ледовыми условиями',
      'Работы в шторм'
    ]
  }
];

/**
 * Автоматическое определение категории
 */
export function determineHydrographicCategory(params: {
  waterBodyType: 'lake' | 'slow_river' | 'medium_river' | 'fast_river' | 'sea';
  currentSpeed?: number; // м/с
  waveHeight?: number; // баллы
  depth?: number; // метры
  hasIce?: boolean;
}): 'I' | 'II' | 'III' | 'IV' {
  const { waterBodyType, currentSpeed = 0, waveHeight = 0, depth = 0, hasIce } = params;

  let score = 0;

  // Оценка по типу водоёма
  if (waterBodyType === 'lake') score += 1;
  else if (waterBodyType === 'slow_river') score += 2;
  else if (waterBodyType === 'medium_river') score += 3;
  else if (waterBodyType === 'fast_river' || waterBodyType === 'sea') score += 4;

  // Оценка по течению
  if (currentSpeed < 0.5) score += 0;
  else if (currentSpeed < 1.5) score += 1;
  else if (currentSpeed < 3.0) score += 2;
  else score += 3;

  // Оценка по волнению
  if (waveHeight < 2) score += 0;
  else if (waveHeight < 4) score += 1;
  else if (waveHeight < 6) score += 2;
  else score += 3;

  // Оценка по глубине
  if (depth < 10) score += 0;
  else if (depth < 25) score += 1;
  else if (depth < 50) score += 2;
  else score += 3;

  // Ледовые условия
  if (hasIce) score += 2;

  // Определение категории по общему баллу
  const avgScore = score / 5;
  if (avgScore < 1.5) return 'I';
  if (avgScore < 2.5) return 'II';
  if (avgScore < 3.5) return 'III';
  return 'IV';
}

/**
 * СЕЗОНЫ РАБОТ
 */
export const WORK_SEASONS = {
  spring: {
    name: 'Весна',
    months: [3, 4, 5],
    description: 'Паводок, ледоход, повышенный уровень воды',
    coefficient: 1.2
  },
  summer: {
    name: 'Лето',
    months: [6, 7, 8],
    description: 'Навигационный период, оптимальные условия',
    coefficient: 1.0
  },
  autumn: {
    name: 'Осень',
    months: [9, 10, 11],
    description: 'Штормы, переменная погода, снижение уровня',
    coefficient: 1.15
  },
  winter: {
    name: 'Зима',
    months: [12, 1, 2],
    description: 'Ледовая обстановка, ледостав',
    coefficient: 1.4
  }
} as const;

/**
 * Определение сезона по месяцу
 */
export function determineSeason(month: number): 'spring' | 'summer' | 'autumn' | 'winter' {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
