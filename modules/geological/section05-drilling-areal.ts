/**
 * Файл: /modules/geological/section05-drilling-areal.ts
 * Путь: /home/claude/smartestimate/modules/rules-engine/geological/sections/
 * Назначение: Блоки инструкции для определения объёмов буровых работ для площадных объектов
 * 
 * Описание:
 * Полная реализация Раздела 5 инструкции РК - расчёт количества, расстояний, глубины и диаметра
 * буровых скважин для площадных объектов согласно СП РК 1.02-105-2014, Таблица 1 и 
 * Правилам осуществления ИГИ РК (2020)
 * 
 * Содержит 15 блоков в 4 подразделах:
 * - 5.1: Расстояния между выработками (6 блоков)
 * - 5.2: Глубина выработок (4 блока)
 * - 5.3: Диаметр скважин (2 блока)
 * - 5.4: Специальные требования (3 блока)
 * 
 * Исправлены ошибки:
 * - Убраны импорты несуществующих файлов
 * - Реализованы все недостающие блоки
 * - Исправлены конфликты условий
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 5.1: РАССТОЯНИЯ МЕЖДУ ВЫРАБОТКАМИ ДЛЯ ПЛОЩАДНЫХ ОБЪЕКТОВ
// ============================================================================

/**
 * Блок 5.1.1: Расстояние между выработками - Геотехн. кат. I, Ответственность I
 */
export const block_05_01_spacing_cat1_resp1: InstructionBlock = {
  id: 'block-05-01-spacing-cat1-resp1',
  section: 'Раздел 5: Буровые работы',
  title: 'Расстояние между выработками (Геотехн. кат. I, Ответственность I)',
  description: 'Определение расстояния между буровыми выработками для простых условий',
  priority: 50,
  dependencies: ['block-03-04-geotechnical-category-I'],
  tags: ['площадной', 'бурение', 'расстояние', 'категория-I', 'ответственность-I'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'I' &&
      input.responsibilityLevel === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Таблица 1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками 75-50 м, минимум 3 выработки',
      recommendedValues: {
        spacingMin: { value: 50, unit: 'м' },
        spacingMax: { value: 75, unit: 'м' },
        minWells: { value: 3, unit: 'скв' }
      }
    },
    {
      id: 'variant-highest-rules-2020',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'п. 15',
        year: 2020,
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Для объектов I уровня ответственности расстояние 40-75 м',
      recommendedValues: {
        spacingMin: { value: 40, unit: 'м' },
        spacingMax: { value: 75, unit: 'м' },
        minWells: { value: 3, unit: 'скв' }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const areaSize = input.areaSize || 1;
    const spacing = selectedVariant.recommendedValues?.spacingMax?.value || 75;
    const minWells = selectedVariant.recommendedValues?.minWells?.value || 3;
    
    // Расчёт количества скважин на основе площади и расстояния
    const gridSide = Math.sqrt(areaSize * 10000);
    const wellsCount = Math.max(minWells, Math.ceil((gridSide / spacing) * (gridSide / spacing)));
    
    return [
      {
        workId: 'drilling-grid-cat1-resp1',
        name: 'Бурение скважин по сетке',
        category: 'required',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `Бурение ${wellsCount} скважин с расстоянием ${spacing} м`,
        priority: selectedVariant.priority,
        tags: ['бурение', 'категория-I']
      }
    ];
  }
};

/**
 * Блок 5.1.2: Расстояние между выработками - Геотехн. кат. I, Ответственность II
 */
export const block_05_02_spacing_cat1_resp2: InstructionBlock = {
  id: 'block-05-02-spacing-cat1-resp2',
  section: 'Раздел 5: Буровые работы',
  title: 'Расстояние между выработками (Геотехн. кат. I, Ответственность II)',
  description: 'Определение расстояния между буровыми выработками для объектов II уровня ответственности',
  priority: 51,
  dependencies: ['block-03-04-geotechnical-category-I'],
  tags: ['площадной', 'бурение', 'расстояние', 'категория-I', 'ответственность-II'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'I' &&
      input.responsibilityLevel === 'II'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-cat1-resp2',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Таблица 1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками 75-100 м, минимум 3-4 выработки',
      recommendedValues: {
        spacingMin: { value: 75, unit: 'м' },
        spacingMax: { value: 100, unit: 'м' },
        minWells: { value: 3, unit: 'скв' }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const areaSize = input.areaSize || 1;
    const spacing = selectedVariant.recommendedValues?.spacingMax?.value || 100;
    const minWells = selectedVariant.recommendedValues?.minWells?.value || 3;
    
    const gridSide = Math.sqrt(areaSize * 10000);
    const wellsCount = Math.max(minWells, Math.ceil((gridSide / spacing) * (gridSide / spacing)));
    
    return [
      {
        workId: 'drilling-grid-cat1-resp2',
        name: 'Бурение скважин по сетке',
        category: 'required',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `Бурение ${wellsCount} скважин с расстоянием ${spacing} м`,
        priority: selectedVariant.priority,
        tags: ['бурение', 'категория-I', 'ответственность-II']
      }
    ];
  }
};

/**
 * Блок 5.1.3: Расстояние между выработками - Геотехн. кат. I, Ответственность III
 */
export const block_05_03_spacing_cat1_resp3: InstructionBlock = {
  id: 'block-05-03-spacing-cat1-resp3',
  section: 'Раздел 5: Буровые работы',
  title: 'Расстояние между выработками (Геотехн. кат. I, Ответственность III)',
  description: 'Определение расстояния для объектов пониженной ответственности',
  priority: 52,
  dependencies: ['block-03-04-geotechnical-category-I'],
  tags: ['площадной', 'бурение', 'расстояние', 'категория-I', 'ответственность-III'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'I' &&
      input.responsibilityLevel === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-cat1-resp3',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Таблица 1, п. 3',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками 100-150 м, минимум 2-3 выработки',
      recommendedValues: {
        spacingMin: { value: 100, unit: 'м' },
        spacingMax: { value: 150, unit: 'м' },
        minWells: { value: 2, unit: 'скв' }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const areaSize = input.areaSize || 1;
    const spacing = selectedVariant.recommendedValues?.spacingMax?.value || 150;
    const minWells = selectedVariant.recommendedValues?.minWells?.value || 2;
    
    const gridSide = Math.sqrt(areaSize * 10000);
    const wellsCount = Math.max(minWells, Math.ceil((gridSide / spacing) * (gridSide / spacing)));
    
    return [
      {
        workId: 'drilling-grid-cat1-resp3',
        name: 'Бурение скважин по разреженной сетке',
        category: 'required',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `Бурение ${wellsCount} скважин с расстоянием ${spacing} м`,
        priority: selectedVariant.priority,
        tags: ['бурение', 'категория-I', 'ответственность-III']
      }
    ];
  }
};

/**
 * Блок 5.1.4: Расстояние между выработками - Геотехн. кат. II, Ответственность I
 */
export const block_05_04_spacing_cat2_resp1: InstructionBlock = {
  id: 'block-05-04-spacing-cat2-resp1',
  section: 'Раздел 5: Буровые работы',
  title: 'Расстояние между выработками (Геотехн. кат. II, Ответственность I)',
  description: 'Определение расстояния для средней сложности и высокой ответственности',
  priority: 53,
  dependencies: ['block-03-05-geotechnical-category-II'],
  tags: ['площадной', 'бурение', 'расстояние', 'категория-II', 'ответственность-I'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'II' &&
      input.responsibilityLevel === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-cat2-resp1',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Таблица 1, п. 4',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками 30-50 м, минимум 3-4 выработки',
      recommendedValues: {
        spacingMin: { value: 30, unit: 'м' },
        spacingMax: { value: 50, unit: 'м' },
        minWells: { value: 4, unit: 'скв' }
      }
    },
    {
      id: 'variant-highest-rules-2020-cat2-resp1',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'п. 16',
        year: 2020,
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Для геотехн. категории II и уровня I: расстояние 25-40 м',
      recommendedValues: {
        spacingMin: { value: 25, unit: 'м' },
        spacingMax: { value: 40, unit: 'м' },
        minWells: { value: 4, unit: 'скв' }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const areaSize = input.areaSize || 1;
    const spacing = selectedVariant.recommendedValues?.spacingMax?.value || 40;
    const minWells = selectedVariant.recommendedValues?.minWells?.value || 4;
    
    const gridSide = Math.sqrt(areaSize * 10000);
    const wellsCount = Math.max(minWells, Math.ceil((gridSide / spacing) * (gridSide / spacing)));
    
    return [
      {
        workId: 'drilling-grid-cat2-resp1',
        name: 'Бурение скважин по сетке (повышенная плотность)',
        category: 'required',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `Бурение ${wellsCount} скважин с расстоянием ${spacing} м для средней сложности`,
        priority: selectedVariant.priority,
        tags: ['бурение', 'категория-II', 'ответственность-I']
      }
    ];
  }
};

/**
 * Блок 5.1.5: Расстояние между выработками - Геотехн. кат. II, Ответственность II
 */
export const block_05_05_spacing_cat2_resp2: InstructionBlock = {
  id: 'block-05-05-spacing-cat2-resp2',
  section: 'Раздел 5: Буровые работы',
  title: 'Расстояние между выработками (Геотехн. кат. II, Ответственность II)',
  description: 'Определение расстояния для средней сложности и ответственности',
  priority: 54,
  dependencies: ['block-03-05-geotechnical-category-II'],
  tags: ['площадной', 'бурение', 'расстояние', 'категория-II', 'ответственность-II'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'II' &&
      input.responsibilityLevel === 'II'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-cat2-resp2',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Таблица 1, п. 5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками 50-75 м, минимум 3-4 выработки',
      recommendedValues: {
        spacingMin: { value: 50, unit: 'м' },
        spacingMax: { value: 75, unit: 'м' },
        minWells: { value: 3, unit: 'скв' }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const areaSize = input.areaSize || 1;
    const spacing = selectedVariant.recommendedValues?.spacingMax?.value || 60;
    const minWells = selectedVariant.recommendedValues?.minWells?.value || 3;
    
    const gridSide = Math.sqrt(areaSize * 10000);
    const wellsCount = Math.max(minWells, Math.ceil((gridSide / spacing) * (gridSide / spacing)));
    
    return [
      {
        workId: 'drilling-grid-cat2-resp2',
        name: 'Бурение скважин по сетке',
        category: 'required',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `Бурение ${wellsCount} скважин с расстоянием ${spacing} м`,
        priority: selectedVariant.priority,
        tags: ['бурение', 'категория-II', 'ответственность-II']
      }
    ];
  }
};

/**
 * Блок 5.1.6: Расстояние между выработками - Геотехн. кат. II, Ответственность III
 */
export const block_05_06_spacing_cat2_resp3: InstructionBlock = {
  id: 'block-05-06-spacing-cat2-resp3',
  section: 'Раздел 5: Буровые работы',
  title: 'Расстояние между выработками (Геотехн. кат. II, Ответственность III)',
  description: 'Определение расстояния для средней сложности и пониженной ответственности',
  priority: 55,
  dependencies: ['block-03-05-geotechnical-category-II'],
  tags: ['площадной', 'бурение', 'расстояние', 'категория-II', 'ответственность-III'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'II' &&
      input.responsibilityLevel === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-cat2-resp3',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'Таблица 1, п. 6',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками 75-100 м, минимум 2-3 выработки',
      recommendedValues: {
        spacingMin: { value: 75, unit: 'м' },
        spacingMax: { value: 100, unit: 'м' },
        minWells: { value: 2, unit: 'скв' }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const areaSize = input.areaSize || 1;
    const spacing = selectedVariant.recommendedValues?.spacingMax?.value || 85;
    const minWells = selectedVariant.recommendedValues?.minWells?.value || 2;
    
    const gridSide = Math.sqrt(areaSize * 10000);
    const wellsCount = Math.max(minWells, Math.ceil((gridSide / spacing) * (gridSide / spacing)));
    
    return [
      {
        workId: 'drilling-grid-cat2-resp3',
        name: 'Бурение скважин по разреженной сетке',
        category: 'required',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `Бурение ${wellsCount} скважин с расстоянием ${spacing} м`,
        priority: selectedVariant.priority,
        tags: ['бурение', 'категория-II', 'ответственность-III']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 5.2: ГЛУБИНА ВЫРАБОТОК
// ============================================================================

/**
 * Блок 5.2.1: Глубина скважин для свайных фундаментов
 */
export const block_05_07_depth_piles: InstructionBlock = {
  id: 'block-05-07-depth-piles',
  section: 'Раздел 5: Буровые работы',
  title: 'Глубина скважин для свайных фундаментов',
  description: 'Определение глубины бурения при свайном фундаменте',
  priority: 56,
  tags: ['глубина', 'сваи', 'бурение'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.foundationType === 'свайный' ||
      input.foundationType === 'свайный-плитный'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-piles',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Глубина скважин на 5 м ниже проектируемой глубины погружения свай',
      calculationFormula: 'H_скв = L_сваи + 5 м'
    }
  ]
};

/**
 * Блок 5.2.2: Глубина скважин для плитных фундаментов
 */
export const block_05_08_depth_plate: InstructionBlock = {
  id: 'block-05-08-depth-plate',
  section: 'Раздел 5: Буровые работы',
  title: 'Глубина скважин для плитных фундаментов',
  description: 'Определение глубины бурения при плитном фундаменте',
  priority: 57,
  tags: ['глубина', 'плита', 'бурение'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.foundationType === 'плитный' ||
      input.foundationType === 'свайный-плитный'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-plate',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.7',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Глубина скважин: 2B + 5 м, где B - ширина фундамента',
      calculationFormula: 'H_скв = 2B + 5 м'
    }
  ]
};

/**
 * Блок 5.2.3: Глубина скважин для ленточных фундаментов
 */
export const block_05_09_depth_strip: InstructionBlock = {
  id: 'block-05-09-depth-strip',
  section: 'Раздел 5: Буровые работы',
  title: 'Глубина скважин для ленточных фундаментов',
  description: 'Определение глубины бурения при ленточном фундаменте',
  priority: 58,
  tags: ['глубина', 'ленточный', 'бурение'],
  
  condition: (input: GeologicalInput) => {
    return input.foundationType === 'ленточный';
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-strip',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.7',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Глубина скважин: 3B + 5 м, где B - ширина фундамента',
      calculationFormula: 'H_скв = 3B + 5 м'
    }
  ]
};

/**
 * Блок 5.2.4: Глубина скважин для столбчатых фундаментов
 */
export const block_05_10_depth_columnar: InstructionBlock = {
  id: 'block-05-10-depth-columnar',
  section: 'Раздел 5: Буровые работы',
  title: 'Глубина скважин для столбчатых фундаментов',
  description: 'Определение глубины бурения при столбчатом фундаменте',
  priority: 59,
  tags: ['глубина', 'столбчатый', 'бурение'],
  
  condition: (input: GeologicalInput) => {
    return input.foundationType === 'столбчатый';
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-105-columnar',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.7',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Глубина скважин: на 3 м ниже подошвы фундамента',
      calculationFormula: 'H_скв = H_подошвы + 3 м'
    }
  ]
};

// ============================================================================
// РАЗДЕЛ 5.3: ДИАМЕТР СКВАЖИН И СПОСОБ ОТБОРА ПРОБ
// ============================================================================

/**
 * Блок 5.3.1: Диаметр скважин для отбора монолитов
 */
export const block_05_11_diameter_undisturbed: InstructionBlock = {
  id: 'block-05-11-diameter-undisturbed',
  section: 'Раздел 5: Буровые работы',
  title: 'Диаметр скважин для отбора монолитов',
  description: 'Определение диаметра скважин при необходимости отбора монолитов',
  priority: 61,
  tags: ['диаметр', 'монолиты', 'отбор-проб'],
  
  condition: (input: GeologicalInput) => {
    // Требуется ненарушенный отбор для сложных условий
    return (
      input.geotechnicalCategory === 'III' ||
      (input.geotechnicalCategory === 'II' && 
       input.specialSoils && input.specialSoils.length > 0)
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-gost-monolith',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 12071-2014',
        section: 'п. 5.3',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Диаметр бурения не менее 168 мм для отбора монолитов',
      recommendedValues: {
        diameter: { value: 168, unit: 'мм' },
        samplingMethod: { value: 'монолиты', unit: '' }
      }
    }
  ]
};

/**
 * Блок 5.3.2: Диаметр скважин для нарушенного отбора
 */
export const block_05_12_diameter_disturbed: InstructionBlock = {
  id: 'block-05-12-diameter-disturbed',
  section: 'Раздел 5: Буровые работы',
  title: 'Диаметр скважин для нарушенного отбора',
  description: 'Определение диаметра скважин при отборе нарушенных проб',
  priority: 62,
  tags: ['диаметр', 'нарушенный-отбор', 'отбор-проб'],
  
  condition: (input: GeologicalInput) => {
    // Простые условия, не требуется монолитов
    return (
      input.geotechnicalCategory === 'I' ||
      (input.geotechnicalCategory === 'II' && 
       (!input.specialSoils || input.specialSoils.length === 0))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-gost-disturbed',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 12071-2014',
        section: 'п. 5.2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Диаметр бурения 108-127 мм для нарушенного отбора',
      recommendedValues: {
        diameter: { value: 127, unit: 'мм' },
        samplingMethod: { value: 'нарушенные пробы', unit: '' }
      }
    }
  ]
};

// ============================================================================
// РАЗДЕЛ 5.4: СПЕЦИАЛЬНЫЕ ТРЕБОВАНИЯ К БУРЕНИЮ
// ============================================================================

/**
 * Блок 5.4.1: Дополнительные скважины для специфических грунтов
 */
export const block_05_13_special_soils: InstructionBlock = {
  id: 'block-05-13-special-soils-wells',
  section: 'Раздел 5: Буровые работы',
  title: 'Дополнительные скважины для специфических грунтов',
  description: 'Увеличение объёма бурения при наличии специфических грунтов',
  priority: 66,
  tags: ['специфические-грунты', 'дополнительные-скважины'],
  
  condition: (input: GeologicalInput) => {
    return input.specialSoils && input.specialSoils.length > 0;
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-special',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 5.11',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Увеличение количества скважин на 25-30% при специфических грунтах'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const baseWells = input.calculatedWells || 10;
    const additionalWells = Math.ceil(baseWells * 0.3);
    
    return [
      {
        workId: 'additional-wells-special-soils',
        name: 'Дополнительные скважины для изучения специфических грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: additionalWells,
        unit: 'скв',
        normativeBase: 'СП РК 1.02-105-2014, п. 5.11',
        description: `${additionalWells} дополнительных скважин для специфических грунтов`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['специфические-грунты']
      }
    ];
  }
};

/**
 * Блок 5.4.2: Дополнительные выработки при наличии опасных процессов
 */
export const block_05_14_hazards: InstructionBlock = {
  id: 'block-05-14-hazards-wells',
  section: 'Раздел 5: Буровые работы',
  title: 'Дополнительные выработки при опасных геологических процессах',
  description: 'Увеличение объёма изысканий при карсте, оползнях, подтоплении',
  priority: 67,
  tags: ['опасные-процессы', 'дополнительные-выработки'],
  
  condition: (input: GeologicalInput) => {
    return input.hazards && input.hazards.length > 0;
  },
  
  variants: [
    {
      id: 'variant-highest-rules-hazards',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'п. 28',
        year: 2020,
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Дополнительные выработки в местах проявления опасных процессов'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const hazardsCount = input.hazards?.length || 0;
    const additionalWells = hazardsCount * 3; // По 3 скважины на каждый тип опасности
    
    return [
      {
        workId: 'additional-wells-hazards',
        name: 'Дополнительные скважины для изучения опасных процессов',
        category: 'mandatory',
        module: 'geological',
        quantity: additionalWells,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `${additionalWells} скважин для изучения: ${input.hazards?.join(', ')}`,
        priority: selectedVariant.priority,
        tags: ['опасные-процессы']
      }
    ];
  }
};

/**
 * Блок 5.4.3: Контрольные скважины
 */
export const block_05_15_control_wells: InstructionBlock = {
  id: 'block-05-15-control-wells',
  section: 'Раздел 5: Буровые работы',
  title: 'Контрольные скважины',
  description: 'Бурение контрольных скважин для уточнения геологического строения',
  priority: 68,
  tags: ['контроль', 'уточнение'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geotechnicalCategory === 'III' ||
      (input.responsibilityLevel === 'I' && input.geotechnicalCategory === 'II')
    );
  },
  
  variants: [
    {
      id: 'variant-reference-control',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.15',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: '10% контрольных скважин от общего количества'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const totalWells = input.calculatedWells || 10;
    const controlWells = Math.max(1, Math.ceil(totalWells * 0.1));
    
    return [
      {
        workId: 'control-wells',
        name: 'Контрольные скважины',
        category: 'optional',
        module: 'geological',
        quantity: controlWells,
        unit: 'скв',
        normativeBase: selectedVariant.normative.document,
        description: `${controlWells} контрольных скважин (10% от общего количества)`,
        priority: selectedVariant.priority,
        tags: ['контроль']
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ ВСЕХ БЛОКОВ РАЗДЕЛА 5
// ============================================================================

// Группировка блоков по подразделам
export const section05_1_spacingBlocks: InstructionBlock[] = [
  block_05_01_spacing_cat1_resp1,
  block_05_02_spacing_cat1_resp2,
  block_05_03_spacing_cat1_resp3,
  block_05_04_spacing_cat2_resp1,
  block_05_05_spacing_cat2_resp2,
  block_05_06_spacing_cat2_resp3
];

export const section05_2_depthBlocks: InstructionBlock[] = [
  block_05_07_depth_piles,
  block_05_08_depth_plate,
  block_05_09_depth_strip,
  block_05_10_depth_columnar
];

export const section05_3_diameterBlocks: InstructionBlock[] = [
  block_05_11_diameter_undisturbed,
  block_05_12_diameter_disturbed
];

export const section05_4_specialBlocks: InstructionBlock[] = [
  block_05_13_special_soils,
  block_05_14_hazards,
  block_05_15_control_wells
];

// ПОЛНЫЙ ЭКСПОРТ РАЗДЕЛА 5 - все 15 блоков
export const section05Blocks: InstructionBlock[] = [
  ...section05_1_spacingBlocks,  // 6 блоков расстояний
  ...section05_2_depthBlocks,    // 4 блока глубины
  ...section05_3_diameterBlocks, // 2 блока диаметра
  ...section05_4_specialBlocks   // 3 блока спец. требований
];

export default section05Blocks;