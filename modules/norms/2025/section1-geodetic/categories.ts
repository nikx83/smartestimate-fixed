/**
 * Путь: /modules/norms/2025/section1-geodetic/categories.ts
 * Назначение: Определение категорий сложности геодезических работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 1
 */

export interface GeodeticCategoryDefinition {
  category: 'I' | 'II' | 'III' | 'IV';
  name: string;
  description: string;
  characteristics: string[];
  applicableWorks: string[];
}

/**
 * КАТЕГОРИИ СЛОЖНОСТИ ДЛЯ ТОПОГРАФИЧЕСКИХ СЪЁМОК
 */
export const TOPOGRAPHIC_SURVEY_CATEGORIES: GeodeticCategoryDefinition[] = [
  {
    category: 'I',
    name: 'I категория сложности',
    description: 'Открытая незастроенная территория',
    characteristics: [
      'Плотность застройки до 10%',
      'Ровный рельеф (уклоны до 2°)',
      'Отсутствие или редкая растительность',
      'Малое количество подземных коммуникаций',
      'Хорошая проходимость'
    ],
    applicableWorks: [
      'Топографическая съёмка открытых территорий',
      'Съёмка сельскохозяйственных угодий',
      'Предпроектные изыскания'
    ]
  },
  {
    category: 'II',
    name: 'II категория сложности',
    description: 'Слабо застроенная территория',
    characteristics: [
      'Плотность застройки 10-30%',
      'Холмистый рельеф (уклоны 2-6°)',
      'Травяной покров, редкий кустарник',
      'Умеренное количество коммуникаций',
      'Удовлетворительная проходимость'
    ],
    applicableWorks: [
      'Съёмка окраин населённых пунктов',
      'Съёмка промышленных площадок',
      'Изыскания для линейных объектов'
    ]
  },
  {
    category: 'III',
    name: 'III категория сложности',
    description: 'Застроенная территория средней плотности',
    characteristics: [
      'Плотность застройки 30-50%',
      'Пересечённый рельеф (уклоны 6-15°)',
      'Кустарник, редколесье',
      'Значительное количество коммуникаций',
      'Затруднённая проходимость'
    ],
    applicableWorks: [
      'Съёмка жилых кварталов',
      'Съёмка производственных зон',
      'Детальные изыскания'
    ]
  },
  {
    category: 'IV',
    name: 'IV категория сложности',
    description: 'Плотно застроенная территория',
    characteristics: [
      'Плотность застройки более 50%',
      'Сложный рельеф (уклоны более 15°)',
      'Густая растительность',
      'Высокая плотность коммуникаций',
      'Сильно затруднённая проходимость',
      'Историческая застройка'
    ],
    applicableWorks: [
      'Съёмка центров городов',
      'Съёмка особо сложных объектов',
      'Исполнительная съёмка',
      'Съёмка памятников архитектуры'
    ]
  }
];

/**
 * КАТЕГОРИИ СЛОЖНОСТИ ДЛЯ РАЗБИВОЧНЫХ РАБОТ
 */
export const LAYOUT_WORK_CATEGORIES: GeodeticCategoryDefinition[] = [
  {
    category: 'I',
    name: 'I категория сложности',
    description: 'Простые объекты на открытой местности',
    characteristics: [
      'Простая геометрия здания',
      'Открытая видимость',
      'Хорошая доступность',
      'Отсутствие помех'
    ],
    applicableWorks: [
      'Вынос осей простых зданий',
      'Разбивка сетей на открытой местности',
      'Работы на незастроенных территориях'
    ]
  },
  {
    category: 'II',
    name: 'II категория сложности',
    description: 'Объекты средней сложности',
    characteristics: [
      'Средняя сложность геометрии',
      'Частичные ограничения видимости',
      'Удовлетворительная доступность',
      'Незначительные помехи'
    ],
    applicableWorks: [
      'Вынос осей многоэтажных зданий',
      'Разбивка на слабо застроенных территориях',
      'Работы в стеснённых условиях'
    ]
  },
  {
    category: 'III',
    name: 'III категория сложности',
    description: 'Сложные объекты',
    characteristics: [
      'Сложная геометрия здания',
      'Ограниченная видимость',
      'Затруднённая доступность',
      'Наличие помех'
    ],
    applicableWorks: [
      'Вынос осей сложных зданий',
      'Разбивка на застроенных территориях',
      'Работы рядом с существующими зданиями'
    ]
  },
  {
    category: 'IV',
    name: 'IV категория сложности',
    description: 'Особо сложные объекты',
    characteristics: [
      'Очень сложная геометрия',
      'Сильно ограниченная видимость',
      'Особо затруднённая доступность',
      'Многочисленные помехи',
      'Высокие требования к точности'
    ],
    applicableWorks: [
      'Вынос осей уникальных зданий',
      'Разбивка на плотно застроенных территориях',
      'Работы в исторических центрах',
      'Особо точные работы'
    ]
  }
];

/**
 * Автоматическое определение категории для топосъёмки
 */
export function determineTopographicCategory(params: {
  developmentDensity: number; // % застройки
  terrain: 'flat' | 'hilly' | 'mountainous' | 'steep_mountainous';
  vegetation: 'none' | 'grass' | 'bushes' | 'sparse_forest' | 'dense_forest';
  utilitiesDensity: number; // количество сетей на га
}): 'I' | 'II' | 'III' | 'IV' {
  const { developmentDensity, terrain, vegetation, utilitiesDensity } = params;

  let score = 0;

  // Оценка по застройке
  if (developmentDensity < 10) score += 1;
  else if (developmentDensity < 30) score += 2;
  else if (developmentDensity < 50) score += 3;
  else score += 4;

  // Оценка по рельефу
  if (terrain === 'flat') score += 0;
  else if (terrain === 'hilly') score += 1;
  else if (terrain === 'mountainous') score += 2;
  else score += 3;

  // Оценка по растительности
  if (vegetation === 'none' || vegetation === 'grass') score += 0;
  else if (vegetation === 'bushes') score += 1;
  else if (vegetation === 'sparse_forest') score += 2;
  else score += 3;

  // Оценка по коммуникациям
  if (utilitiesDensity < 5) score += 0;
  else if (utilitiesDensity < 10) score += 1;
  else if (utilitiesDensity < 20) score += 2;
  else score += 3;

  // Определение категории по общему баллу
  const avgScore = score / 4;
  if (avgScore < 1.5) return 'I';
  if (avgScore < 2.5) return 'II';
  if (avgScore < 3.5) return 'III';
  return 'IV';
}

/**
 * Автоматическое определение категории для разбивочных работ
 */
export function determineLayoutCategory(params: {
  buildingComplexity: 'simple' | 'medium' | 'complex' | 'unique';
  visibility: 'good' | 'fair' | 'poor' | 'very_poor';
  accessibility: 'good' | 'fair' | 'difficult' | 'very_difficult';
  accuracyRequirement: 'standard' | 'increased' | 'high' | 'ultra_high';
}): 'I' | 'II' | 'III' | 'IV' {
  const { buildingComplexity, visibility, accessibility, accuracyRequirement } = params;

  let score = 0;

  // Оценка по сложности здания
  const complexityScores = { simple: 1, medium: 2, complex: 3, unique: 4 };
  score += complexityScores[buildingComplexity];

  // Оценка по видимости
  const visibilityScores = { good: 1, fair: 2, poor: 3, very_poor: 4 };
  score += visibilityScores[visibility];

  // Оценка по доступности
  const accessibilityScores = { good: 1, fair: 2, difficult: 3, very_difficult: 4 };
  score += accessibilityScores[accessibility];

  // Оценка по точности
  const accuracyScores = { standard: 1, increased: 2, high: 3, ultra_high: 4 };
  score += accuracyScores[accuracyRequirement];

  // Определение категории по общему баллу
  const avgScore = score / 4;
  if (avgScore < 1.5) return 'I';
  if (avgScore < 2.5) return 'II';
  if (avgScore < 3.5) return 'III';
  return 'IV';
}
