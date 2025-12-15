/**
 * Файл: /modules/geological/section11-field-tests.ts  
 * Путь: /home/claude/smartestimate/modules/rules-engine/geological/sections/
 * Назначение: Блоки инструкции для полевых испытаний грунтов
 * 
 * Описание:
 * Реализация Раздела 11 инструкции РК - полевые испытания грунтов на площадках изысканий,
 * включая статическое зондирование (CPT), динамическое зондирование, прессиометрию,
 * штамповые испытания согласно СП РК 1.02-102-2014 и ГОСТ 19912-2012
 * 
 * Содержит 7 блоков:
 * - 11.1: Количество точек зондирования для разных категорий (3 блока)
 * - 11.2: Глубина статического зондирования (1 блок)
 * - 11.3: Динамическое зондирование (1 блок)
 * - 11.4: Прессиометрия (1 блок)
 * - 11.5: Штамповые испытания (1 блок)
 * 
 * Исправлены ошибки:
 * - Убраны жестко заданные значения estimatedWells, estimatedPiles
 * - Добавлены динамические расчеты на основе входных данных
 * - Исправлены нулевые значения глубины
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАСЧЕТОВ
// ============================================================================

/**
 * Расчет количества скважин на основе площади и категории
 */
function calculateWellsCount(input: GeologicalInput): number {
  const areaSize = input.areaSize || 1; // га
  const category = input.geotechnicalCategory || 'II';
  
  // Базовое количество скважин на 1 га
  const baseWellsPerHa = {
    'I': 3,
    'II': 5,
    'III': 8
  };
  
  const wells = Math.ceil(areaSize * baseWellsPerHa[category]);
  
  // Учитываем минимальные требования
  const minWells = {
    'I': 3,
    'II': 5,
    'III': 6
  };
  
  return Math.max(wells, minWells[category]);
}

/**
 * Расчет количества свай на основе площади здания и типа фундамента
 */
function calculatePilesCount(input: GeologicalInput): number {
  if (input.foundationType !== 'свайный' && input.foundationType !== 'свайный-плитный') {
    return 0;
  }
  
  const buildingArea = input.buildingArea || 1000; // м²
  const pilesPerSquareMeter = 0.1; // Примерно 1 свая на 10 м²
  
  return Math.ceil(buildingArea * pilesPerSquareMeter);
}

/**
 * Расчет глубины зондирования на основе типа фундамента
 */
function calculateCPTDepth(input: GeologicalInput): number {
  const foundationType = input.foundationType || 'ленточный';
  const foundationWidth = input.foundationWidth || 2; // м
  
  const depthFactors = {
    'свайный': { base: 5, factor: 1 }, // Глубина сваи + 5м
    'плитный': { base: 5, factor: 2 }, // 2B + 5м
    'ленточный': { base: 5, factor: 3 }, // 3B + 5м
    'столбчатый': { base: 3, factor: 1 }, // Глубина + 3м
    'свайный-плитный': { base: 5, factor: 2 }
  };
  
  const params = depthFactors[foundationType] || depthFactors['ленточный'];
  
  // Если есть проектная глубина свай, используем её
  if (foundationType === 'свайный' && input.pileDepth) {
    return input.pileDepth + params.base;
  }
  
  // Иначе рассчитываем по ширине фундамента
  return params.factor * foundationWidth + params.base;
}

// ============================================================================
// РАЗДЕЛ 11.1: КОЛИЧЕСТВО ТОЧЕК ЗОНДИРОВАНИЯ
// ============================================================================

/**
 * Блок 11.1.1: Количество точек статического зондирования - Категория I
 */
export const block_11_01_cpt_quantity_cat1: InstructionBlock = {
  id: 'block-11-01-cpt-quantity-cat1',
  section: 'Раздел 11: Полевые испытания',
  title: 'Количество точек статического зондирования для категории I',
  description: 'Определение количества точек зондирования для простых условий',
  priority: 70,
  tags: ['полевые-испытания', 'зондирование', 'CPT', 'категория-I'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102-cat1',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 6.9',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: '1 точка статического зондирования на 2 скважины, минимум 3 точки на объект',
      recommendedValues: {
        cptPointsRatio: {
          value: 0.5,
          unit: 'точек/скважину',
          formula: '1 точка на 2 скважины',
          explanation: 'Соотношение 1:2'
        },
        minCptPoints: {
          value: 3,
          unit: 'точек',
          explanation: 'Минимум для категории I'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Динамический расчет количества скважин
    const estimatedWells = input.calculatedWells || calculateWellsCount(input);
    const ratio = selectedVariant.recommendedValues?.cptPointsRatio?.value || 0.5;
    const minPoints = selectedVariant.recommendedValues?.minCptPoints?.value || 3;
    
    const cptPoints = Math.max(Math.ceil(estimatedWells * ratio), minPoints);
    
    return [
      {
        workId: 'cpt-category-I',
        name: 'Статическое зондирование (CPT)',
        category: 'mandatory',
        module: 'geological',
        quantity: cptPoints,
        unit: 'точек',
        normativeBase: 'СП РК 1.02-102-2014, п. 6.9',
        description: `${cptPoints} точек зондирования (1:2 к скважинам)`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['зондирование', 'CPT']
      }
    ];
  }
};

/**
 * Блок 11.1.2: Количество точек статического зондирования - Категория II
 */
export const block_11_02_cpt_quantity_cat2: InstructionBlock = {
  id: 'block-11-02-cpt-quantity-cat2',
  section: 'Раздел 11: Полевые испытания',
  title: 'Количество точек статического зондирования для категории II',
  description: 'Определение количества точек зондирования для условий средней сложности',
  priority: 71,
  tags: ['полевые-испытания', 'зондирование', 'CPT', 'категория-II'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'II'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102-cat2',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 6.9',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: '1 точка статического зондирования на каждую скважину, минимум 5 точек на объект',
      recommendedValues: {
        cptPointsRatio: {
          value: 1.0,
          unit: 'точек/скважину',
          formula: '1 точка на 1 скважину',
          explanation: 'Соотношение 1:1'
        },
        minCptPoints: {
          value: 5,
          unit: 'точек',
          explanation: 'Минимум для категории II'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Динамический расчет количества скважин
    const estimatedWells = input.calculatedWells || calculateWellsCount(input);
    const ratio = selectedVariant.recommendedValues?.cptPointsRatio?.value || 1.0;
    const minPoints = selectedVariant.recommendedValues?.minCptPoints?.value || 5;
    
    const cptPoints = Math.max(Math.ceil(estimatedWells * ratio), minPoints);
    
    return [
      {
        workId: 'cpt-category-II',
        name: 'Статическое зондирование (CPT)',
        category: 'mandatory',
        module: 'geological',
        quantity: cptPoints,
        unit: 'точек',
        normativeBase: 'СП РК 1.02-102-2014, п. 6.9',
        description: `${cptPoints} точек зондирования (1:1 к скважинам)`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['зондирование', 'CPT']
      }
    ];
  }
};

/**
 * Блок 11.1.3: Количество точек статического зондирования - Категория III
 */
export const block_11_03_cpt_quantity_cat3: InstructionBlock = {
  id: 'block-11-03-cpt-quantity-cat3',
  section: 'Раздел 11: Полевые испытания',
  title: 'Количество точек статического зондирования для категории III',
  description: 'Определение количества точек зондирования для сложных условий',
  priority: 72,
  tags: ['полевые-испытания', 'зондирование', 'CPT', 'категория-III'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'площадной' &&
      input.geotechnicalCategory === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102-cat3',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 6.9',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: '2 точки статического зондирования на каждую скважину, минимум 6 точек на объект',
      recommendedValues: {
        cptPointsRatio: {
          value: 2.0,
          unit: 'точек/скважину',
          formula: '2 точки на 1 скважину',
          explanation: 'Соотношение 2:1'
        },
        minCptPoints: {
          value: 6,
          unit: 'точек',
          explanation: 'Минимум для категории III'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Динамический расчет количества скважин
    const estimatedWells = input.calculatedWells || calculateWellsCount(input);
    const ratio = selectedVariant.recommendedValues?.cptPointsRatio?.value || 2.0;
    const minPoints = selectedVariant.recommendedValues?.minCptPoints?.value || 6;
    
    const cptPoints = Math.max(Math.ceil(estimatedWells * ratio), minPoints);
    
    return [
      {
        workId: 'cpt-category-III',
        name: 'Статическое зондирование (CPT) с повышенной плотностью',
        category: 'mandatory',
        module: 'geological',
        quantity: cptPoints,
        unit: 'точек',
        normativeBase: 'СП РК 1.02-102-2014, п. 6.9',
        description: `${cptPoints} точек зондирования (2:1 к скважинам) для сложных условий`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['зондирование', 'CPT', 'сложные-условия']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 11.2: ГЛУБИНА СТАТИЧЕСКОГО ЗОНДИРОВАНИЯ
// ============================================================================

/**
 * Блок 11.2.1: Глубина статического зондирования
 */
export const block_11_04_cpt_depth: InstructionBlock = {
  id: 'block-11-04-cpt-depth',
  section: 'Раздел 11: Полевые испытания',
  title: 'Глубина статического зондирования',
  description: 'Определение глубины проходки при зондировании',
  priority: 73,
  tags: ['полевые-испытания', 'зондирование', 'глубина'],
  
  condition: (input: GeologicalInput) => {
    // Применимо если выполняется зондирование
    return input.geotechnicalCategory !== undefined;
  },
  
  variants: [
    {
      id: 'variant-mandatory-gost-depth',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 19912-2012',
        section: 'п. 5.2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Глубина зондирования должна превышать глубину активной зоны на 2-3 м',
      calculationFormula: 'H_cpt = H_активной_зоны + (2-3) м',
      recommendedValues: {
        cptDepth: {
          value: null, // Рассчитывается динамически
          unit: 'м',
          formula: 'Зависит от типа фундамента'
        }
      }
    },
    {
      id: 'variant-reference-sp-depth',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 6.10',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'При свайном фундаменте - на 5 м ниже острия свай',
      calculationFormula: 'H_cpt = L_сваи + 5 м'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Динамический расчет глубины зондирования
    const cptDepth = calculateCPTDepth(input);
    
    return [
      {
        workId: 'cpt-depth-specification',
        name: 'Требования к глубине статического зондирования',
        category: 'specification',
        module: 'geological',
        quantity: cptDepth,
        unit: 'м',
        normativeBase: selectedVariant.normative.document,
        description: `Глубина зондирования ${cptDepth} м`,
        priority: selectedVariant.priority,
        tags: ['глубина', 'зондирование']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 11.3: ДИНАМИЧЕСКОЕ ЗОНДИРОВАНИЕ
// ============================================================================

/**
 * Блок 11.3.1: Динамическое зондирование для свайных фундаментов
 */
export const block_11_05_dynamic_sounding: InstructionBlock = {
  id: 'block-11-05-dynamic-sounding',
  section: 'Раздел 11: Полевые испытания',
  title: 'Динамическое зондирование для свайных фундаментов',
  description: 'Определение несущей способности свай динамическим зондированием',
  priority: 74,
  tags: ['полевые-испытания', 'динамическое-зондирование', 'сваи'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.foundationType === 'свайный' ||
      input.foundationType === 'свайный-плитный'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-gost-dynamic',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ГОСТ 19912-2012',
        section: 'п. 7.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Динамическое зондирование в местах погружения свай',
      recommendedValues: {
        dynamicPointsRatio: {
          value: 0.01,
          unit: 'точек/сваю',
          formula: '1% от количества свай',
          explanation: 'Минимум 3 точки'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Динамический расчет количества свай
    const estimatedPiles = input.pilesCount || calculatePilesCount(input);
    const ratio = selectedVariant.recommendedValues?.dynamicPointsRatio?.value || 0.01;
    
    const dynamicPoints = Math.max(3, Math.ceil(estimatedPiles * ratio));
    
    return [
      {
        workId: 'dynamic-sounding-piles',
        name: 'Динамическое зондирование',
        category: 'mandatory',
        module: 'geological',
        quantity: dynamicPoints,
        unit: 'точек',
        normativeBase: 'ГОСТ 19912-2012, п. 7.1',
        description: `${dynamicPoints} точек динамического зондирования (1% от ${estimatedPiles} свай)`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['динамическое-зондирование', 'сваи']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 11.4: ПРЕССИОМЕТРИЯ
// ============================================================================

/**
 * Блок 11.4.1: Прессиометрические испытания
 */
export const block_11_06_pressuremeter: InstructionBlock = {
  id: 'block-11-06-pressuremeter',
  section: 'Раздел 11: Полевые испытания',
  title: 'Прессиометрические испытания',
  description: 'Определение деформационных характеристик грунтов прессиометром',
  priority: 75,
  tags: ['полевые-испытания', 'прессиометрия', 'деформации'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.responsibilityLevel === 'I' ||
      (input.geotechnicalCategory === 'III' && input.buildingHeight && input.buildingHeight > 75)
    );
  },
  
  variants: [
    {
      id: 'variant-reference-gost-pressuremeter',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ГОСТ 20276-2012',
        section: 'п. 5.3',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Прессиометрические испытания в 3-5 скважинах',
      recommendedValues: {
        pressuremeterTests: {
          value: 4,
          unit: 'скважин',
          explanation: 'Для объектов I уровня ответственности'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const tests = selectedVariant.recommendedValues?.pressuremeterTests?.value || 4;
    
    return [
      {
        workId: 'pressuremeter-tests',
        name: 'Прессиометрические испытания',
        category: 'optional',
        module: 'geological',
        quantity: tests,
        unit: 'испытаний',
        normativeBase: 'ГОСТ 20276-2012, п. 5.3',
        description: `${tests} прессиометрических испытаний в скважинах`,
        priority: 'СПРАВОЧНЫЙ',
        tags: ['прессиометрия', 'деформации']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 11.5: ШТАМПОВЫЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 11.5.1: Штамповые испытания грунтов
 */
export const block_11_07_plate_load: InstructionBlock = {
  id: 'block-11-07-plate-load',
  section: 'Раздел 11: Полевые испытания',
  title: 'Штамповые испытания грунтов',
  description: 'Определение модуля деформации штамповыми испытаниями',
  priority: 76,
  tags: ['полевые-испытания', 'штамп', 'модуль-деформации'],
  
  condition: (input: GeologicalInput) => {
    // Для уникальных и особо ответственных зданий
    return (
      input.responsibilityLevel === 'I' &&
      input.geotechnicalCategory === 'III' &&
      input.foundationType === 'плитный'
    );
  },
  
  variants: [
    {
      id: 'variant-reference-gost-plate',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ГОСТ 20276-2012',
        section: 'п. 5.2',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Штамповые испытания в 2-3 точках основания',
      recommendedValues: {
        plateLoadTests: {
          value: 3,
          unit: 'испытаний',
          explanation: 'Для плитных фундаментов особо ответственных зданий'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const tests = selectedVariant.recommendedValues?.plateLoadTests?.value || 3;
    
    return [
      {
        workId: 'plate-load-tests',
        name: 'Штамповые испытания грунтов',
        category: 'optional',
        module: 'geological',
        quantity: tests,
        unit: 'испытаний',
        normativeBase: 'ГОСТ 20276-2012, п. 5.2',
        description: `${tests} штамповых испытаний для определения модуля деформации`,
        priority: 'СПРАВОЧНЫЙ',
        tags: ['штамп', 'модуль-деформации']
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ ВСЕХ БЛОКОВ РАЗДЕЛА 11
// ============================================================================

export const section11Blocks: InstructionBlock[] = [
  block_11_01_cpt_quantity_cat1,
  block_11_02_cpt_quantity_cat2,
  block_11_03_cpt_quantity_cat3,
  block_11_04_cpt_depth,
  block_11_05_dynamic_sounding,
  block_11_06_pressuremeter,
  block_11_07_plate_load
];

export default section11Blocks;