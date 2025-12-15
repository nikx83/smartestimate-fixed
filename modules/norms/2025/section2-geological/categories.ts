/**
 * Путь: /modules/norms/2025/section2-geological/categories.ts
 * Назначение: Определение категорий сложности геологических работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 2
 */

export interface SoilCategoryInfo {
  category: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  name: string;
  description: string;
  soilTypes: string[];
  characteristics: string[];
}

/**
 * ДЕТАЛЬНОЕ ОПИСАНИЕ КАТЕГОРИЙ ГРУНТОВ
 */
export const SOIL_CATEGORY_DEFINITIONS: SoilCategoryInfo[] = [
  {
    category: 'I',
    name: 'I категория - Лёгкие грунты',
    description: 'Песчаные и супесчаные грунты',
    soilTypes: [
      'Песок рыхлый любой влажности',
      'Песок средней плотности маловлажный',
      'Супесь пластичная',
      'Насыпные грунты рыхлые'
    ],
    characteristics: [
      'Лёгкое бурение',
      'Высокая скорость проходки',
      'Простое крепление скважин',
      'Незначительное сопротивление'
    ]
  },
  {
    category: 'II',
    name: 'II категория - Средние грунты',
    description: 'Суглинки мягкопластичные',
    soilTypes: [
      'Суглинок мягкопластичный',
      'Торф',
      'Растительный слой с корнями',
      'Песок плотный влажный'
    ],
    characteristics: [
      'Умеренное сопротивление бурению',
      'Средняя скорость проходки',
      'Требуется стандартное крепление',
      'Возможны осложнения при обводнении'
    ]
  },
  {
    category: 'III',
    name: 'III категория - Тугопластичные грунты',
    description: 'Суглинки тугопластичные, глины мягкопластичные',
    soilTypes: [
      'Суглинок тугопластичный',
      'Глина мягкопластичная',
      'Лёсс и лёссовидные суглинки',
      'Насыпные грунты слежавшиеся'
    ],
    characteristics: [
      'Значительное сопротивление',
      'Сниженная скорость проходки',
      'Необходимо усиленное крепление',
      'Требуется больше усилий'
    ]
  },
  {
    category: 'IV',
    name: 'IV категория - Твёрдые связные грунты',
    description: 'Глины тугопластичные, суглинки твердые',
    soilTypes: [
      'Глина тугопластичная',
      'Суглинок твердый',
      'Мергель рыхлый',
      'Аргиллиты сильновыветрелые'
    ],
    characteristics: [
      'Высокое сопротивление',
      'Медленная проходка',
      'Сложное крепление',
      'Износ инструмента'
    ]
  },
  {
    category: 'V',
    name: 'V категория - Очень твёрдые грунты',
    description: 'Глины твердые, полускальные грунты',
    soilTypes: [
      'Глина твердая',
      'Аргиллиты слабые',
      'Мергель плотный',
      'Мерзлые грунты'
    ],
    characteristics: [
      'Очень высокое сопротивление',
      'Низкая скорость проходки',
      'Специальное оборудование',
      'Высокий износ инструмента'
    ]
  },
  {
    category: 'VI',
    name: 'VI категория - Скальные грунты',
    description: 'Полускальные и скальные породы',
    soilTypes: [
      'Известняк',
      'Песчаник',
      'Доломит',
      'Мергель крепкий',
      'Выветрелые скальные породы'
    ],
    characteristics: [
      'Максимальное сопротивление',
      'Очень медленная проходка',
      'Специализированное оборудование',
      'Высокие затраты на инструмент',
      'Может потребоваться колонковое бурение'
    ]
  }
];

/**
 * Автоматическое определение категории грунта по характеристикам
 */
export function determineSoilCategory(params: {
  soilType: string;
  consistency?: 'liquid' | 'soft' | 'plastic' | 'semi_solid' | 'solid';
  moisture?: 'dry' | 'moist' | 'wet' | 'saturated';
  density?: 'loose' | 'medium' | 'dense';
}): 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' {
  const { soilType, consistency, density } = params;

  // Скальные и полускальные
  if (
    soilType.includes('известняк') ||
    soilType.includes('песчаник') ||
    soilType.includes('скальн') ||
    soilType.includes('доломит')
  ) {
    return 'VI';
  }

  // Очень твёрдые
  if (
    soilType.includes('мерзл') ||
    (soilType.includes('глина') && consistency === 'solid') ||
    soilType.includes('аргиллит')
  ) {
    return 'V';
  }

  // Твёрдые связные
  if (
    (soilType.includes('глина') && consistency === 'semi_solid') ||
    (soilType.includes('суглинок') && consistency === 'solid') ||
    soilType.includes('мергель')
  ) {
    return 'IV';
  }

  // Тугопластичные
  if (
    (soilType.includes('суглинок') && consistency === 'semi_solid') ||
    (soilType.includes('глина') && consistency === 'plastic') ||
    soilType.includes('лёсс')
  ) {
    return 'III';
  }

  // Мягкопластичные
  if (
    (soilType.includes('суглинок') && consistency === 'plastic') ||
    soilType.includes('торф')
  ) {
    return 'II';
  }

  // Лёгкие грунты (по умолчанию для песка и супеси)
  return 'I';
}
