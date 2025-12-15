/**
 * Файл: /modules/geological/section09-laboratory.ts
 * Назначение: Блоки инструкции для лабораторных исследований грунтов
 * 
 * ПРИМЕЧАНИЕ: Это Раздел 9 инструкции
 * 
 * Описание:
 * Реализация требований к лабораторным исследованиям физико-механических свойств грунтов
 * согласно СП РК 1.02-102-2014, раздел 7
 * 
 * Содержит 15 блоков:
 * - 9.1-9.6: Общие требования и количество образцов
 * - 9.7-9.15: Специальные испытания и методы
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 9.1: ОБЩИЕ ТРЕБОВАНИЯ К ЛАБОРАТОРНЫМ ИССЛЕДОВАНИЯМ
// ============================================================================

/**
 * Блок 9.1: Общие требования к лабораторным исследованиям
 */
export const block_09_01_general_requirements: InstructionBlock = {
  id: 'block-09-01-laboratory-general-requirements',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Общие требования к лабораторные исследованиям',
  description: 'Минимальный объём лабораторных определений для каждого инженерно-геологического элемента',
  priority: 90,
  tags: ['лаборатория', 'общие-требования'],
  
  condition: (input: GeologicalInput) => {
    return input.lithologicLayers !== undefined && input.lithologicLayers.length > 0;
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для каждого инженерно-геологического элемента (ИГЭ) выполнить определения:\n' +
        '- Плотности грунта ρ (г/см³)\n' +
        '- Влажности W (%)\n' +
        '- Плотности частиц грунта ρs (г/см³)\n' +
        '- Границ текучести и раскатывания (для глинистых грунтов)\n' +
        '- Удельного сцепления c (кПа) и угла внутреннего трения φ (°)\n' +
        '- Модуля деформации E (МПа)',
      recommendedValues: {
        determinationsPerLayer: {
          value: 6,
          min: 6,
          unit: 'видов',
          explanation: 'Минимальное количество определений на ИГЭ'
        }
      },
      warnings: [
        'Количество определений должно быть статистически обеспеченным',
        'Для неоднородных грунтов увеличить количество образцов',
        'Результаты должны пройти статистическую обработку'
      ]
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const layersCount = input.lithologicLayers?.length || 1;
    
    return [
      {
        workId: 'lab-general-determinations',
        name: 'Общие лабораторные определения физико-механических свойств',
        category: 'mandatory',
        module: 'geological',
        quantity: layersCount * 6,
        unit: 'определений',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.1',
        description: 'Плотность, влажность, прочностные характеристики для каждого ИГЭ',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'физико-механические']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.2: КОЛИЧЕСТВО ОБРАЗЦОВ ДЛЯ ЛАБОРАТОРНЫХ ИССЛЕДОВАНИЙ
// ============================================================================

/**
 * Блок 9.2: Количество образцов для лабораторных исследований
 */
export const block_09_02_sample_quantity: InstructionBlock = {
  id: 'block-09-02-laboratory-sample-quantity',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Количество образцов для лабораторных исследований',
  description: 'Определение минимального количества образцов для статистической обеспеченности',
  priority: 91,
  tags: ['лаборатория', 'образцы', 'статистика'],
  
  condition: (input: GeologicalInput) => true,
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Минимальное количество образцов для каждого ИГЭ:\n' +
        '- Для I геотехнической категории: 6 образцов\n' +
        '- Для II геотехнической категории: 10 образцов\n' +
        '- Для III геотехнической категории: 15 образцов\n\n' +
        'При неоднородности грунтов увеличить количество на 25-50%',
      recommendedValues: {
        samplesCategoryI: {
          value: 6,
          min: 6,
          unit: 'образцов',
          explanation: 'Для I геотехнической категории'
        },
        samplesCategoryII: {
          value: 10,
          min: 10,
          unit: 'образцов',
          explanation: 'Для II геотехнической категории'
        },
        samplesCategoryIII: {
          value: 15,
          min: 15,
          unit: 'образцов',
          explanation: 'Для III геотехнической категории'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const layersCount = input.lithologicLayers?.length || 1;
    let samplesPerLayer = 6;
    
    if (input.geotechnicalCategory === 'II') samplesPerLayer = 10;
    if (input.geotechnicalCategory === 'III') samplesPerLayer = 15;
    
    // Увеличение для неоднородных грунтов
    if (input.soilHeterogeneity === 'высокая') samplesPerLayer = Math.ceil(samplesPerLayer * 1.5);
    
    return [
      {
        workId: 'lab-samples-collection',
        name: 'Отбор образцов для лабораторных исследований',
        category: 'mandatory',
        module: 'geological',
        quantity: layersCount * samplesPerLayer,
        unit: 'образцов',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.2',
        description: `Минимальное количество образцов для ${input.geotechnicalCategory || 'I'} категории`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'отбор-образцов']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.3: ИСПЫТАНИЯ СКАЛЬНЫХ ГРУНТОВ
// ============================================================================

/**
 * Блок 9.3: Лабораторные испытания скальных грунтов
 */
export const block_09_03_rock_testing: InstructionBlock = {
  id: 'block-09-03-rock-laboratory-testing',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Лабораторные испытания скальных грунтов',
  description: 'Определение прочностных и деформационных характеристик скальных грунтов',
  priority: 92,
  tags: ['лаборатория', 'скальные', 'прочность'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.lithologicLayers &&
      input.lithologicLayers.some(layer => 
        layer.toLowerCase().includes('скальн') || 
        layer.toLowerCase().includes('порода')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.3',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для скальных грунтов обязательно определить:\n' +
        '- Предел прочности на одноосное сжатие в водонасыщенном состоянии Rc\n' +
        '- Модуль деформации E (статический и динамический)\n' +
        '- Угол внутреннего трения φ и сцепление c\n' +
        '- Показатель анизотропии прочности\n' +
        '- Коэффициент выветрелости\n' +
        '- Плотность и влажность',
      recommendedValues: {
        rockTests: {
          value: ['Rc', 'E', 'φ', 'c', 'анизотропия', 'выветрелость'],
          unit: 'видов',
          explanation: 'Обязательные определения для скальных грунтов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const rockLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('скальн') || 
      layer.toLowerCase().includes('порода')
    ).length || 1;
    
    return [
      {
        workId: 'lab-rock-strength',
        name: 'Испытания скальных грунтов на прочность',
        category: 'mandatory',
        module: 'geological',
        quantity: rockLayersCount * 6,
        unit: 'определений',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.3',
        description: 'Прочность на сжатие, модуль деформации, угол внутреннего трения',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'скальные', 'прочность']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.4: ИСПЫТАНИЯ ПЕСЧАНЫХ ГРУНТОВ
// ============================================================================

/**
 * Блок 9.4: Лабораторные испытания песчаных грунтов
 */
export const block_09_04_sandy_soils: InstructionBlock = {
  id: 'block-09-04-sandy-soils-laboratory',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Лабораторные испытания песчаных грунтов',
  description: 'Определение характеристик песчаных грунтов',
  priority: 93,
  tags: ['лаборатория', 'песчаные', 'гранулометрия'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.lithologicLayers &&
      input.lithologicLayers.some(layer => 
        layer.toLowerCase().includes('пес') || 
        layer.toLowerCase().includes('песчан')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.4',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для песчаных грунтов обязательно определить:\n' +
        '- Гранулометрический состав (ситовой анализ)\n' +
        '- Коэффициент пористости e\n' +
        '- Угол внутреннего трения φ в плотном и рыхлом состоянии\n' +
        '- Удельное сцепление c\n' +
        '- Модуль деформации E\n' +
        '- Плотность скелета ρd',
      recommendedValues: {
        sandyTests: {
          value: ['гранулометрия', 'e', 'φ', 'c', 'E', 'ρd'],
          unit: 'видов',
          explanation: 'Обязательные определения для песчаных грунтов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const sandyLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('пес') || 
      layer.toLowerCase().includes('песчан')
    ).length || 1;
    
    return [
      {
        workId: 'lab-sandy-granulometry',
        name: 'Гранулометрический анализ песчаных грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: sandyLayersCount,
        unit: 'анализов',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.4',
        description: 'Ситовой анализ, определение коэффициента пористости',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'песчаные', 'гранулометрия']
      },
      {
        workId: 'lab-sandy-strength',
        name: 'Испытания песчаных грунтов на прочность',
        category: 'mandatory',
        module: 'geological',
        quantity: sandyLayersCount * 4,
        unit: 'определений',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.4',
        description: 'Угол внутреннего трения, сцепление, модуль деформации',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'песчаные', 'прочность']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.5: ИСПЫТАНИЯ ГЛИНИСТЫХ ГРУНТОВ
// ============================================================================

/**
 * Блок 9.5: Лабораторные испытания глинистых грунтов
 */
export const block_09_05_clayey_soils: InstructionBlock = {
  id: 'block-09-05-clayey-soils-laboratory',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Лабораторные испытания глинистых грунтов',
  description: 'Определение характеристик глинистых грунтов',
  priority: 94,
  tags: ['лаборатория', 'глинистые', 'консистенция'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.lithologicLayers &&
      input.lithologicLayers.some(layer => 
        layer.toLowerCase().includes('глин') || 
        layer.toLowerCase().includes('суглин') ||
        layer.toLowerCase().includes('супес')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для глинистых грунтов обязательно определить:\n' +
        '- Влажность на границе текучести WL и раскатывания WP\n' +
        '- Число пластичности IP\n' +
        '- Показатель текучести IL\n' +
        '- Удельное сцепление c и угол внутреннего трения φ\n' +
        '- Модуль деформации E\n' +
        '- Коэффициент консолидации Cv',
      recommendedValues: {
        clayeyTests: {
          value: ['WL', 'WP', 'IP', 'IL', 'c', 'φ', 'E', 'Cv'],
          unit: 'видов',
          explanation: 'Обязательные определения для глинистых грунтов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const clayeyLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('глин') || 
      layer.toLowerCase().includes('суглин') ||
      layer.toLowerCase().includes('супес')
    ).length || 1;
    
    return [
      {
        workId: 'lab-clayey-consistency',
        name: 'Определение консистенции глинистых грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: clayeyLayersCount * 3,
        unit: 'определений',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.5',
        description: 'Границы текучести и раскатывания, число пластичности',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'глинистые', 'консистенция']
      },
      {
        workId: 'lab-clayey-strength',
        name: 'Испытания глинистых грунтов на прочность',
        category: 'mandatory',
        module: 'geological',
        quantity: clayeyLayersCount * 4,
        unit: 'определений',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.5',
        description: 'Сцепление, угол внутреннего трения, модуль деформации',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'глинистые', 'прочность']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.6: ИСПЫТАНИЯ ОРГАНИЧЕСКИХ ГРУНТОВ
// ============================================================================

/**
 * Блок 9.6: Лабораторные испытания органических грунтов
 */
export const block_09_06_organic_soils: InstructionBlock = {
  id: 'block-09-06-organic-soils-laboratory',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Лабораторные испытания органических грунтов',
  description: 'Определение характеристик торфов и заторфованных грунтов',
  priority: 95,
  tags: ['лаборатория', 'органические', 'торфы'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.lithologicLayers &&
      input.lithologicLayers.some(layer => 
        layer.toLowerCase().includes('торф') || 
        layer.toLowerCase().includes('орган')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.6',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для органических грунтов обязательно определить:\n' +
        '- Степень разложения торфа R (%)\n' +
        '- Зольность Ad (%)\n' +
        '- Влажность W (%)\n' +
        '- Плотность ρ\n' +
        '- Коэффициент пористости e\n' +
        '- Модуль деформации E (с длительной консолидацией)\n' +
        '- Параметры ползучести',
      recommendedValues: {
        organicTests: {
          value: ['R', 'Ad', 'W', 'ρ', 'e', 'E', 'ползучесть'],
          unit: 'видов',
          explanation: 'Обязательные определения для органических грунтов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const organicLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('торф') || 
      layer.toLowerCase().includes('орган')
    ).length || 1;
    
    return [
      {
        workId: 'lab-organic-composition',
        name: 'Определение состава органических грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: organicLayersCount * 3,
        unit: 'определений',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.6',
        description: 'Степень разложения, зольность, влажность',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'органические', 'состав']
      },
      {
        workId: 'lab-organic-deformation',
        name: 'Испытания органических грунтов на деформации',
        category: 'mandatory',
        module: 'geological',
        quantity: organicLayersCount,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.6',
        description: 'Модуль деформации с длительной консолидацией (до 30 суток)',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'органические', 'деформации']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.7: КОМПРЕССИОННЫЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 9.7: Компрессионные испытания грунтов
 */
export const block_09_07_compression_tests: InstructionBlock = {
  id: 'block-09-07-compression-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Компрессионные испытания грунтов',
  description: 'Определение модуля деформации и коэффициента сжимаемости',
  priority: 96,
  tags: ['лаборатория', 'компрессия', 'деформации'],
  
  condition: (input: GeologicalInput) => {
    return input.geotechnicalCategory === 'II' || input.geotechnicalCategory === 'III';
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.7',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Компрессионные испытания выполнить для определения:\n' +
        '- Модуля деформации E (компрессионного)\n' +
        '- Коэффициента сжимаемости mv\n' +
        '- Коэффициента относительной сжимаемости δ\n' +
        '- Давления набухания/просадочности (для специфических грунтов)\n\n' +
        'Испытания проводить при ступенях нагрузки: 0,05; 0,1; 0,2; 0,3; 0,4; 0,6; 0,8; 1,0 МПа',
      recommendedValues: {
        compressionSteps: {
          value: [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0],
          unit: 'МПа',
          explanation: 'Ступени нагрузки при компрессионных испытаниях'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const layersCount = input.lithologicLayers?.length || 1;
    const testsCount = input.geotechnicalCategory === 'III' ? layersCount * 2 : layersCount;
    
    return [
      {
        workId: 'lab-compression-tests',
        name: 'Компрессионные испытания грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: testsCount,
        unit: 'испытаний',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.7',
        description: 'Определение модуля деформации при 8 ступенях нагрузки',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'компрессия', 'деформации']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.8: ИСПЫТАНИЯ НА СРЕЗ
// ============================================================================

/**
 * Блок 9.8: Испытания грунтов на срез
 */
export const block_09_08_shear_tests: InstructionBlock = {
  id: 'block-09-08-shear-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Испытания грунтов на срез',
  description: 'Определение прочностных характеристик при сдвиге',
  priority: 97,
  tags: ['лаборатория', 'срез', 'прочность'],
  
  condition: (input: GeologicalInput) => {
    return input.geotechnicalCategory === 'II' || input.geotechnicalCategory === 'III';
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Испытания на срез выполнить для определения:\n' +
        '- Удельного сцепления c (кПа)\n' +
        '- Угла внутреннего трения φ (°)\n' +
        '- Зависимости τ = f(σ)\n\n' +
        '**Методы испытаний:**\n' +
        '- Одноплоскостной срез\n' +
        '- Трехосное сжатие (для ответственных объектов)\n' +
        '- Срез по заданной плоскости (для оползневых склонов)',
      recommendedValues: {
        shearMethods: {
          value: ['одноплоскостной', 'трехосный'],
          unit: 'методы',
          explanation: 'Методы испытаний на срез'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const layersCount = input.lithologicLayers?.length || 1;
    const testsCount = input.geotechnicalCategory === 'III' ? layersCount * 3 : layersCount * 2;
    
    return [
      {
        workId: 'lab-shear-tests',
        name: 'Испытания грунтов на срез',
        category: 'mandatory',
        module: 'geological',
        quantity: testsCount,
        unit: 'испытаний',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.8',
        description: 'Определение сцепления и угла внутреннего трения',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'срез', 'прочность']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.9: КОНСОЛИДАЦИОННЫЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 9.9: Консолидационные испытания
 */
export const block_09_09_consolidation: InstructionBlock = {
  id: 'block-09-09-consolidation-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Консолидационные испытания',
  description: 'Определение параметров консолидации глинистых грунтов',
  priority: 98,
  tags: ['лаборатория', 'консолидация', 'осадки'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geotechnicalCategory === 'III' ||
      (input.lithologicLayers && input.lithologicLayers.some(layer => 
        layer.toLowerCase().includes('глин') || 
        layer.toLowerCase().includes('ил')
      ))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.9',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Консолидационные испытания выполнить для определения:\n' +
        '- Коэффициента консолидации Cv\n' +
        '- Коэффициента фильтрации k\n' +
        '- Времени консолидации t90\n' +
        '- Зависимости осадки от времени S = f(t)\n\n' +
        'Особенно важно для:\n' +
        '- Слабых водонасыщенных глинистых грунтов\n' +
        '- Илов и сапропелей\n' +
        '- Оснований предварительно обжатых грунтов',
      recommendedValues: {
        consolidationParams: {
          value: ['Cv', 'k', 't90'],
          unit: 'параметров',
          explanation: 'Определяемые параметры консолидации'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const clayeyLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('глин') || 
      layer.toLowerCase().includes('ил') ||
      layer.toLowerCase().includes('слаб')
    ).length || 1;
    
    return [
      {
        workId: 'lab-consolidation-tests',
        name: 'Консолидационные испытания',
        category: 'recommended',
        module: 'geological',
        quantity: clayeyLayersCount,
        unit: 'испытаний',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.9',
        description: 'Определение параметров консолидации и фильтрации',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['лаборатория', 'консолидация']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.10: ФИЛЬТРАЦИОННЫЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 9.10: Фильтрационные испытания
 */
export const block_09_10_filtration: InstructionBlock = {
  id: 'block-09-10-filtration-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Фильтрационные испытания',
  description: 'Определение коэффициента фильтрации грунтов',
  priority: 99,
  tags: ['лаборатория', 'фильтрация', 'гидрогеология'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.hydrogeologyConditions === 'сложные' ||
      input.foundationType === 'подземный' ||
      input.waterproofingRequired === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.10',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Фильтрационные испытания выполнить для определения:\n' +
        '- Коэффициента фильтрации k (м/сут)\n' +
        '- Зависимости k = f(e) для песков\n' +
        '- Зависимости k = f(W) для глин\n' +
        '- Анизотропии фильтрационных свойств\n\n' +
        '**Методы:**\n' +
        '- Постоянного напора (для песков)\n' +
        '- Переменного напора (для глин)\n' +
        '- Компрессионно-фильтрационные приборы',
      recommendedValues: {
        filtrationMethods: {
          value: ['постоянный-напор', 'переменный-напор'],
          unit: 'методы',
          explanation: 'Методы фильтрационных испытаний'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const layersCount = input.lithologicLayers?.length || 1;
    
    return [
      {
        workId: 'lab-filtration-tests',
        name: 'Фильтрационные испытания грунтов',
        category: 'recommended',
        module: 'geological',
        quantity: layersCount,
        unit: 'испытаний',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.10',
        description: 'Определение коэффициента фильтрации',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['лаборатория', 'фильтрация']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.11: ДИНАМИЧЕСКИЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 9.11: Динамические испытания грунтов
 */
export const block_09_11_dynamic_properties: InstructionBlock = {
  id: 'block-09-11-dynamic-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Динамические испытания грунтов',
  description: 'Определение динамических характеристик для сейсмических расчетов',
  priority: 100,
  tags: ['лаборатория', 'динамика', 'сейсмика'],
  
  condition: (input: GeologicalInput) => {
    return input.seismicity !== undefined && input.seismicity >= 6;
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-104',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-104-2014',
        section: 'раздел 6.3',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для сейсмических районов обязательно определить:\n' +
        '- Динамический модуль упругости Edyn\n' +
        '- Коэффициент Пуассона ν\n' +
        '- Декремент колебаний λ\n' +
        '- Скорости распространения волн Vp, Vs\n' +
        '- Критические скорости деформирования\n\n' +
        '**Методы:**\n' +
        '- Резонансная колонка\n' +
        '- Циклическое трехосное сжатие\n' +
        '- Ультразвуковые измерения',
      recommendedValues: {
        dynamicParams: {
          value: ['Edyn', 'ν', 'λ', 'Vp', 'Vs'],
          unit: 'параметров',
          explanation: 'Динамические характеристики для сейсмики'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const layersCount = input.lithologicLayers?.length || 1;
    
    return [
      {
        workId: 'lab-dynamic-tests',
        name: 'Динамические испытания грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: layersCount,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-104-2014, раздел 6.3',
        description: 'Определение динамических характеристик для сейсмических расчетов',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'динамика', 'сейсмика']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.12: ТЕПЛОФИЗИЧЕСКИЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 9.12: Теплофизические испытания
 */
export const block_09_12_thermal_properties: InstructionBlock = {
  id: 'block-09-12-thermal-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Теплофизические испытания',
  description: 'Определение тепловых характеристик грунтов',
  priority: 101,
  tags: ['лаборатория', 'теплофизика', 'мерзлота'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils && 
      input.specialSoils.some(soil => soil.toLowerCase().includes('мерзл'))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.12',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для мерзлых грунтов обязательно определить:\n' +
        '- Теплопроводность λ (Вт/м·°C)\n' +
        '- Теплоемкость C (кДж/кг·°C)\n' +
        '- Температуру фазовых переходов\n' +
        '- Льдистость и криогенное строение\n' +
        '- Сжимаемость при оттаивании\n\n' +
        'Испытания проводить при различных температурах',
      recommendedValues: {
        thermalParams: {
          value: ['λ', 'C', 'льдистость', 'сжимаемость'],
          unit: 'параметров',
          explanation: 'Теплофизические характеристики мерзлых грунтов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const frozenLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('мерзл')
    ).length || 1;
    
    return [
      {
        workId: 'lab-thermal-tests',
        name: 'Теплофизические испытания мерзлых грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: frozenLayersCount,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.12',
        description: 'Определение теплопроводности, теплоемкости, льдистости',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'теплофизика', 'мерзлота']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.13: ХИМИЧЕСКИЙ АНАЛИЗ
// ============================================================================

/**
 * Блок 9.13: Химический анализ грунтов и вод
 */
export const block_09_13_chemical_analysis: InstructionBlock = {
  id: 'block-09-13-chemical-analysis',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Химический анализ грунтов и вод',
  description: 'Определение химического состава и агрессивности',
  priority: 102,
  tags: ['лаборатория', 'химия', 'коррозия'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils && 
      input.specialSoils.some(soil => soil.toLowerCase().includes('засолен')) ||
      input.waterSamples === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.13',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Химический анализ выполнить для определения:\n' +
        '- Содержания солей (Cl⁻, SO₄²⁻, CO₃²⁻, HCO₃⁻)\n' +
        '- Водородного показателя pH\n' +
        '- Жёсткости воды\n' +
        '- Агрессивности к бетону и металлам\n' +
        '- Типа и степени засоления\n\n' +
        '**Методы:**\n' +
        '- Водные вытяжки из грунтов\n' +
        '- Анализ проб подземных вод\n' +
        '- Ионная хроматография',
      recommendedValues: {
        chemicalParams: {
          value: ['Cl⁻', 'SO₄²⁻', 'CO₃²⁻', 'HCO₃⁻', 'pH', 'агрессивность'],
          unit: 'показателей',
          explanation: 'Химические показатели для оценки агрессивности'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const samplesCount = input.waterSamples ? 3 : 1; // Вода + грунты
    
    return [
      {
        workId: 'lab-chemical-analysis',
        name: 'Химический анализ грунтов и вод',
        category: 'mandatory',
        module: 'geological',
        quantity: samplesCount,
        unit: 'анализов',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.13',
        description: 'Определение химического состава и агрессивности',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'химия', 'коррозия']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.14: МИНЕРАЛОГИЧЕСКИЙ АНАЛИЗ
// ============================================================================

/**
 * Блок 9.14: Минералогический анализ
 */
export const block_09_14_mineralogy: InstructionBlock = {
  id: 'block-09-14-mineralogical-analysis',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Минералогический анализ',
  description: 'Определение минерального состава грунтов',
  priority: 103,
  tags: ['лаборатория', 'минералогия', 'рентген'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils && 
      input.specialSoils.some(soil => 
        soil.toLowerCase().includes('набухающ') ||
        soil.toLowerCase().includes('просадочн')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-recommended-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.14',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Минералогический анализ выполнить для:\n' +
        '- Идентификации глинистых минералов (монтмориллонит, каолинит, иллит)\n' +
        '- Определения причин набухания/просадочности\n' +
        '- Оценки потенциальной агрессивности\n\n' +
        '**Методы:**\n' +
        '- Рентгеноструктурный анализ (XRD)\n' +
        '- Термогравиметрический анализ (TGA)\n' +
        '- Электронная микроскопия',
      recommendedValues: {
        mineralogyMethods: {
          value: ['XRD', 'TGA', 'микроскопия'],
          unit: 'методы',
          explanation: 'Методы минералогического анализа'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const specialLayersCount = input.lithologicLayers?.filter(layer => 
      layer.toLowerCase().includes('глин') || 
      layer.toLowerCase().includes('суглин')
    ).length || 1;
    
    return [
      {
        workId: 'lab-mineralogy-analysis',
        name: 'Минералогический анализ грунтов',
        category: 'recommended',
        module: 'geological',
        quantity: specialLayersCount,
        unit: 'анализов',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.14',
        description: 'Рентгеноструктурный анализ для идентификации глинистых минералов',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['лаборатория', 'минералогия', 'рентген']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 9.15: КОРРОЗИОННЫЕ ИСПЫТАНИЯ
// ============================================================================

/**
 * Блок 9.15: Коррозионные испытания
 */
export const block_09_15_corrosion: InstructionBlock = {
  id: 'block-09-15-corrosion-tests',
  section: 'Раздел 9: Лабораторные исследования',
  title: 'Коррозионные испытания',
  description: 'Оценка коррозионной активности грунтов',
  priority: 104,
  tags: ['лаборатория', 'коррозия', 'металлы', 'бетон'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.corrosionRisk === true ||
      (input.specialSoils && 
       input.specialSoils.some(soil => soil.toLowerCase().includes('засолен')))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 7.15',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Коррозионные испытания выполнить для оценки:\n' +
        '- Агрессивности грунтов к бетону (по pH, содержанию солей)\n' +
        '- Агрессивности к черным металлам\n' +
        '- Агрессивности к алюминиевым сплавам\n' +
        '- Скорости коррозии в естественных условиях\n\n' +
        '**Методы:**\n' +
        '- Измерение удельного электрического сопротивления\n' +
        '- Потенциостатические измерения\n' +
        '- Испытания образцов материалов в грунте',
      recommendedValues: {
        corrosionTests: {
          value: ['бетон', 'сталь', 'алюминий', 'сопротивление'],
          unit: 'видов',
          explanation: 'Виды коррозионных испытаний'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'lab-corrosion-tests',
        name: 'Коррозионные испытания грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 7.15',
        description: 'Оценка агрессивности к бетону и металлам',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['лаборатория', 'коррозия']
      }
    ];
  }
};

// ============================================================================
// ОБЪЕДИНЕННЫЙ ЭКСПОРТ ДЛЯ ВСЕХ БЛОКОВ РАЗДЕЛА 9
// ============================================================================

export const section09Blocks: InstructionBlock[] = [
  block_09_01_general_requirements,
  block_09_02_sample_quantity,
  block_09_03_rock_testing,
  block_09_04_sandy_soils,
  block_09_05_clayey_soils,
  block_09_06_organic_soils,
  block_09_07_compression_tests,
  block_09_08_shear_tests,
  block_09_09_consolidation,
  block_09_10_filtration,
  block_09_11_dynamic_properties,
  block_09_12_thermal_properties,
  block_09_13_chemical_analysis,
  block_09_14_mineralogy,
  block_09_15_corrosion
];

// ТОЛЬКО ОДИН ЭКСПОРТ ПО УМОЛЧАНИЮ
export default section09Blocks;
