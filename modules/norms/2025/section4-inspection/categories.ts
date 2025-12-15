/**
 * Путь: /modules/norms/2025/section4-inspection/categories.ts
 * Назначение: Определение категорий сложности зданий и работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, Таблица 8
 */

/**
 * ТАБЛИЦА 8 - Категории сложности выполнения обследовательских работ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4, стр. 4
 */

export interface WorkComplexityDefinition {
  category: 'I' | 'II' | 'III';
  name: string;
  description: string;
  includedWorks: string[];
  characteristics: string[];
}

export const WORK_COMPLEXITY_CATEGORIES: WorkComplexityDefinition[] = [
  {
    category: 'I',
    name: 'I категория сложности работ',
    description: 'Визуальное обследование без инструментальных измерений',
    includedWorks: [
      'Визуальный осмотр конструкций',
      'Выявление видимых дефектов и повреждений',
      'Обмерные работы',
      'Фотофиксация'
    ],
    characteristics: [
      'Без вскрытия конструкций',
      'Без испытаний материалов',
      'Быстрое обследование'
    ]
  },
  {
    category: 'II',
    name: 'II категория сложности работ',
    description: 'Детальное обследование с частичными инструментальными измерениями',
    includedWorks: [
      'Все работы I категории',
      'Выборочные вскрытия конструкций',
      'Определение прочности материалов неразрушающими методами',
      'Измерение прогибов и деформаций',
      'Определение армирования',
      'Выборочные лабораторные испытания'
    ],
    characteristics: [
      'Частичные вскрытия (до 10% площади)',
      'Неразрушающий контроль',
      'Выборочный отбор проб'
    ]
  },
  {
    category: 'III',
    name: 'III категория сложности работ',
    description: 'Комплексное детальное обследование с полным объёмом испытаний',
    includedWorks: [
      'Все работы I и II категории',
      'Многочисленные вскрытия конструкций',
      'Полный комплекс лабораторных испытаний',
      'Испытание конструкций нагружением',
      'Геодезические наблюдения за деформациями',
      'Обследование оснований и фундаментов',
      'Детальное обследование всех элементов'
    ],
    characteristics: [
      'Обширные вскрытия (более 10%)',
      'Полный объём испытаний',
      'Детальная проектно-сметная документация для ремонта',
      'Расчёт несущей способности'
    ]
  }
];

/**
 * КАТЕГОРИИ СЛОЖНОСТИ ЗДАНИЙ
 * Источник: СЦИ РК 8.03-04-2025, Раздел 4
 */

export interface BuildingComplexityDefinition {
  category: 'I' | 'II' | 'III';
  name: string;
  description: string;
  examples: string[];
}

export const BUILDING_COMPLEXITY_CATEGORIES: BuildingComplexityDefinition[] = [
  {
    category: 'I',
    name: 'I категория сложности здания',
    description: 'Простые промышленные и гражданские здания',
    examples: [
      'Одноэтажные складские здания простой конструкции',
      'Ангары с металлическим каркасом',
      'Производственные здания без сложного оборудования',
      'Простые прямоугольные в плане здания'
    ]
  },
  {
    category: 'II',
    name: 'II категория сложности здания',
    description: 'Здания средней сложности',
    examples: [
      'Промышленные здания с подкрановыми балками',
      'Многоэтажные производственные здания',
      'Здания со сложной планировкой',
      'Здания с мостовыми кранами средней грузоподъёмности'
    ]
  },
  {
    category: 'III',
    name: 'III категория сложности здания',
    description: 'Сложные промышленные здания',
    examples: [
      'Здания с тяжёлыми мостовыми кранами',
      'Здания с горячими цехами',
      'Высотные промышленные здания',
      'Здания с вибрационными нагрузками',
      'Уникальные производственные объекты'
    ]
  }
];

/**
 * Функция автоматического определения категории сложности здания
 */
export function determineBuildingCategory(params: {
  hasCranes?: boolean;
  craneCapacity?: number; // тонны
  hasHotWorkshops?: boolean;
  floors: number;
  height?: number;
  hasVibration?: boolean;
  isUnique?: boolean;
}): 'I' | 'II' | 'III' {
  const {
    hasCranes,
    craneCapacity = 0,
    hasHotWorkshops,
    floors,
    height = 0,
    hasVibration,
    isUnique
  } = params;

  // III категория
  if (isUnique) return 'III';
  if (hasHotWorkshops) return 'III';
  if (craneCapacity > 50) return 'III';
  if (height > 30) return 'III';
  if (hasVibration) return 'III';

  // II категория
  if (hasCranes && craneCapacity > 10) return 'II';
  if (floors > 3) return 'II';
  if (height > 18) return 'II';

  // I категория (по умолчанию)
  return 'I';
}

/**
 * Функция рекомендации категории сложности работ
 */
export function recommendWorkComplexity(params: {
  purpose: 'visual' | 'pre_project' | 'project' | 'detailed';
  buildingCondition: 'good' | 'satisfactory' | 'poor' | 'emergency';
  requiresReinforcement?: boolean;
}): 'I' | 'II' | 'III' {
  const { purpose, buildingCondition, requiresReinforcement } = params;

  // III категория
  if (purpose === 'detailed') return 'III';
  if (buildingCondition === 'emergency') return 'III';
  if (requiresReinforcement) return 'III';

  // II категория
  if (purpose === 'project') return 'II';
  if (buildingCondition === 'poor') return 'II';

  // I категория
  if (purpose === 'visual') return 'I';
  if (buildingCondition === 'good') return 'I';

  // По умолчанию II категория
  return 'II';
}
