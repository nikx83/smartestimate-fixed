/**
 * Файл: /modules/geological/section07-survey.ts
 * Назначение: Блоки инструкции для определения масштабов инженерно-геологической съёмки
 * 
 * Описание:
 * Реализация требований к съёмке территории - масштабы, плотность точек наблюдений,
 * количество горных выработок согласно СП РК 1.02-102-2014, Таблица 2, ВСН 34.2-88
 * 
 * Содержит 7 блоков:
 * - 7.1: Масштаб 1:25000 (3 блока по категориям)
 * - 7.2: Масштаб 1:10000 (3 блока по категориям)
 * - 7.3: Детальная съёмка 1:2000-1:500 (1 блок)
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 7.1: СЪЁМКА МАСШТАБА 1:25000 (ТЭО)
// ============================================================================

/**
 * Блок 7.1.1: Съёмка 1:25000 категория I
 */
export const block_07_01_survey_25k_cat1: InstructionBlock = {
  id: 'block-07-01-survey-25k-category-i',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Съёмка масштаба 1:25000 категория I',
  description: 'Мелкомасштабная съёмка для предпроектной стадии, простые условия',
  priority: 70,
  tags: ['съёмка', 'масштаб-25000', 'категория-I'],
  
  condition: (input: GeologicalInput) => {
    return (
      (input.stage === 'ТЭО' || input.stage === 'Схема использования') &&
      input.complexityCategory === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Таблица 2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологическая съёмка масштаба 1:25000:\n' +
        '- 6 точек наблюдений на 1 км²\n' +
        '- В том числе 2 горные выработки\n' +
        '- Расстояние между выработками ~700 м',
      recommendedValues: {
        observationsPerKm2: {
          value: 6,
          unit: 'точек/км²',
          explanation: 'Плотность наблюдений'
        },
        excavationsPerKm2: {
          value: 2,
          unit: 'выработок/км²',
          explanation: 'Горные выработки'
        },
        spacing: {
          value: 700,
          unit: 'м',
          explanation: 'Между выработками'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const area = (input.areaSize || 100) / 100; // га → км²
    const observations = Math.ceil(area * 6);
    const excavations = Math.ceil(area * 2);
    
    return [
      {
        workId: 'survey-25k-cat1',
        name: 'Инженерно-геологическая съёмка масштаба 1:25000',
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: 'СП РК 1.02-102-2014, Таблица 2',
        description: `${observations} точек наблюдений, ${excavations} горных выработок`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['съёмка', 'масштаб-25000', 'категория-I'],
        notes: [
          `Площадь съёмки: ${area.toFixed(2)} км²`,
          `Точек наблюдений: ${observations}`,
          `Горных выработок: ${excavations}`,
          'Расстояние между выработками: ~700 м'
        ]
      }
    ];
  }
};

/**
 * Блок 7.1.2: Съёмка 1:25000 категория II
 */
export const block_07_02_survey_25k_cat2: InstructionBlock = {
  id: 'block-07-02-survey-25k-category-ii',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Съёмка масштаба 1:25000 категория II',
  description: 'Мелкомасштабная съёмка для предпроектной стадии, средние условия',
  priority: 71,
  tags: ['съёмка', 'масштаб-25000', 'категория-II'],
  
  condition: (input: GeologicalInput) => {
    return (
      (input.stage === 'ТЭО' || input.stage === 'Схема использования') &&
      input.complexityCategory === 'II'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Таблица 2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологическая съёмка масштаба 1:25000:\n' +
        '- 9 точек наблюдений на 1 км²\n' +
        '- В том числе 3 горные выработки\n' +
        '- Расстояние между выработками ~600 м',
      recommendedValues: {
        observationsPerKm2: {
          value: 9,
          unit: 'точек/км²',
          explanation: 'Плотность наблюдений'
        },
        excavationsPerKm2: {
          value: 3,
          unit: 'выработок/км²',
          explanation: 'Горные выработки'
        },
        spacing: {
          value: 600,
          unit: 'м',
          explanation: 'Между выработками'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const area = (input.areaSize || 100) / 100;
    const observations = Math.ceil(area * 9);
    const excavations = Math.ceil(area * 3);
    
    return [
      {
        workId: 'survey-25k-cat2',
        name: 'Инженерно-геологическая съёмка масштаба 1:25000',
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: 'СП РК 1.02-102-2014, Таблица 2',
        description: `${observations} точек наблюдений, ${excavations} горных выработок`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['съёмка', 'масштаб-25000', 'категория-II'],
        notes: [
          `Точек: ${observations}`,
          `Выработок: ${excavations}`,
          'Шаг: ~600 м'
        ]
      }
    ];
  }
};

/**
 * Блок 7.1.3: Съёмка 1:25000 категория III
 */
export const block_07_03_survey_25k_cat3: InstructionBlock = {
  id: 'block-07-03-survey-25k-category-iii',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Съёмка масштаба 1:25000 категория III',
  description: 'Мелкомасштабная съёмка для предпроектной стадии, сложные условия',
  priority: 72,
  tags: ['съёмка', 'масштаб-25000', 'категория-III'],
  
  condition: (input: GeologicalInput) => {
    return (
      (input.stage === 'ТЭО' || input.stage === 'Схема использования') &&
      input.complexityCategory === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Таблица 2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологическая съёмка масштаба 1:25000:\n' +
        '- 12 точек наблюдений на 1 км²\n' +
        '- В том числе 4 горные выработки\n' +
        '- Расстояние между выработками ~500 м',
      recommendedValues: {
        observationsPerKm2: {
          value: 12,
          unit: 'точек/км²',
          explanation: 'Плотность наблюдений'
        },
        excavationsPerKm2: {
          value: 4,
          unit: 'выработок/км²',
          explanation: 'Горные выработки'
        },
        spacing: {
          value: 500,
          unit: 'м',
          explanation: 'Между выработками'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const area = (input.areaSize || 100) / 100;
    const observations = Math.ceil(area * 12);
    const excavations = Math.ceil(area * 4);
    
    return [
      {
        workId: 'survey-25k-cat3',
        name: 'Инженерно-геологическая съёмка масштаба 1:25000',
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: 'СП РК 1.02-102-2014, Таблица 2',
        description: `${observations} точек наблюдений, ${excavations} горных выработок`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['съёмка', 'масштаб-25000', 'категория-III'],
        notes: [
          `Точек: ${observations}`,
          `Выработок: ${excavations}`,
          'Шаг: ~500 м'
        ]
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 7.2: СЪЁМКА МАСШТАБА 1:10000 (ПРОЕКТ)
// ============================================================================

/**
 * Блок 7.2.1: Съёмка 1:10000 категория I
 */
export const block_07_04_survey_10k_cat1: InstructionBlock = {
  id: 'block-07-04-survey-10k-category-i',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Съёмка масштаба 1:10000 категория I',
  description: 'Среднемасштабная съёмка для проектной стадии, простые условия',
  priority: 73,
  tags: ['съёмка', 'масштаб-10000', 'категория-I'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.stage === 'Проект' &&
      input.complexityCategory === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Таблица 2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологическая съёмка масштаба 1:10000:\n' +
        '- 25 точек наблюдений на 1 км²\n' +
        '- В том числе 9 горных выработок\n' +
        '- Расстояние между выработками ~350 м',
      recommendedValues: {
        observationsPerKm2: {
          value: 25,
          unit: 'точек/км²',
          explanation: 'Плотность наблюдений'
        },
        excavationsPerKm2: {
          value: 9,
          unit: 'выработок/км²',
          explanation: 'Горные выработки'
        },
        spacing: {
          value: 350,
          unit: 'м',
          explanation: 'Между выработками'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const area = (input.areaSize || 100) / 100;
    const observations = Math.ceil(area * 25);
    const excavations = Math.ceil(area * 9);
    
    return [
      {
        workId: 'survey-10k-cat1',
        name: 'Инженерно-геологическая съёмка масштаба 1:10000',
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: 'СП РК 1.02-102-2014, Таблица 2',
        description: `${observations} точек наблюдений, ${excavations} горных выработок`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['съёмка', 'масштаб-10000', 'категория-I'],
        notes: [
          `Точек: ${observations}`,
          `Выработок: ${excavations}`,
          'Шаг: ~350 м'
        ]
      }
    ];
  }
};

/**
 * Блок 7.2.2: Съёмка 1:10000 категория II
 */
export const block_07_05_survey_10k_cat2: InstructionBlock = {
  id: 'block-07-05-survey-10k-category-ii',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Съёмка масштаба 1:10000 категория II',
  description: 'Среднемасштабная съёмка для проектной стадии, средние условия',
  priority: 74,
  tags: ['съёмка', 'масштаб-10000', 'категория-II'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.stage === 'Проект' &&
      input.complexityCategory === 'II'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Таблица 2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологическая съёмка масштаба 1:10000:\n' +
        '- 30 точек наблюдений на 1 км²\n' +
        '- В том числе 11 горных выработок\n' +
        '- Расстояние между выработками ~300 м',
      recommendedValues: {
        observationsPerKm2: {
          value: 30,
          unit: 'точек/км²',
          explanation: 'Плотность наблюдений'
        },
        excavationsPerKm2: {
          value: 11,
          unit: 'выработок/км²',
          explanation: 'Горные выработки'
        },
        spacing: {
          value: 300,
          unit: 'м',
          explanation: 'Между выработками'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const area = (input.areaSize || 100) / 100;
    const observations = Math.ceil(area * 30);
    const excavations = Math.ceil(area * 11);
    
    return [
      {
        workId: 'survey-10k-cat2',
        name: 'Инженерно-геологическая съёмка масштаба 1:10000',
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: 'СП РК 1.02-102-2014, Таблица 2',
        description: `${observations} точек наблюдений, ${excavations} горных выработок`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['съёмка', 'масштаб-10000', 'категория-II'],
        notes: [
          `Точек: ${observations}`,
          `Выработок: ${excavations}`,
          'Шаг: ~300 м'
        ]
      }
    ];
  }
};

/**
 * Блок 7.2.3: Съёмка 1:10000 категория III
 */
export const block_07_06_survey_10k_cat3: InstructionBlock = {
  id: 'block-07-06-survey-10k-category-iii',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Съёмка масштаба 1:10000 категория III',
  description: 'Среднемасштабная съёмка для проектной стадии, сложные условия',
  priority: 75,
  tags: ['съёмка', 'масштаб-10000', 'категория-III'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.stage === 'Проект' &&
      input.complexityCategory === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Таблица 2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологическая съёмка масштаба 1:10000:\n' +
        '- 40 точек наблюдений на 1 км²\n' +
        '- В том числе 16 горных выработок\n' +
        '- Расстояние между выработками ~250 м',
      recommendedValues: {
        observationsPerKm2: {
          value: 40,
          unit: 'точек/км²',
          explanation: 'Плотность наблюдений'
        },
        excavationsPerKm2: {
          value: 16,
          unit: 'выработок/км²',
          explanation: 'Горные выработки'
        },
        spacing: {
          value: 250,
          unit: 'м',
          explanation: 'Между выработками'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const area = (input.areaSize || 100) / 100;
    const observations = Math.ceil(area * 40);
    const excavations = Math.ceil(area * 16);
    
    return [
      {
        workId: 'survey-10k-cat3',
        name: 'Инженерно-геологическая съёмка масштаба 1:10000',
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: 'СП РК 1.02-102-2014, Таблица 2',
        description: `${observations} точек наблюдений, ${excavations} горных выработок`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['съёмка', 'масштаб-10000', 'категория-III'],
        notes: [
          `Точек: ${observations}`,
          `Выработок: ${excavations}`,
          'Шаг: ~250 м'
        ]
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 7.3: ДЕТАЛЬНАЯ СЪЁМКА 1:2000-1:500
// ============================================================================

/**
 * Блок 7.3.1: Детальная крупномасштабная съёмка
 */
export const block_07_07_survey_detailed: InstructionBlock = {
  id: 'block-07-07-survey-detailed-large-scale',
  section: 'Раздел 7: Инженерно-геологическая съёмка',
  title: 'Детальная съёмка масштаба 1:2000-1:500',
  description: 'Крупномасштабная детальная съёмка для особо ответственных объектов',
  priority: 76,
  tags: ['съёмка', 'детальная', 'крупный-масштаб'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.responsibilityLevel === 'I' ||
      input.geotechnicalCategory === 'III' ||
      input.objectType === 'гидроэнергетический' ||
      (input.complexityCategory === 'III' && input.stage === 'Проект')
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.4',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Детальная инженерно-геологическая съёмка масштаба 1:2000-1:500 с картировочным бурением через 20-100 м для:\n' +
        '- Особо ответственных объектов (I уровень ответственности)\n' +
        '- Сложных инженерно-геологических условий (III категория)\n' +
        '- Локальных участков в пределах площадки строительства',
      recommendedValues: {
        scale: {
          value: '1:2000-1:500',
          unit: 'масштаб',
          explanation: 'Диапазон масштабов'
        },
        boringSpacing: {
          value: 50,
          min: 20,
          max: 100,
          unit: 'м',
          explanation: 'Картировочное бурение'
        }
      }
    },
    {
      id: 'variant-hydro-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 4.10',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов детальная съёмка масштаба 1:1000-1:500:\n' +
        '- Площадки плотин и ГЭС\n' +
        '- Портальные участки туннелей\n' +
        '- Берегоукрепительные сооружения\n' +
        '- Картировочное бурение через 20-50 м',
      recommendedValues: {
        scale: {
          value: '1:1000-1:500',
          unit: 'масштаб',
          explanation: 'Крупный масштаб'
        },
        boringSpacing: {
          value: 35,
          min: 20,
          max: 50,
          unit: 'м',
          explanation: 'Плотная сеть'
        }
      },
      note: 'Применяется для гидроэнергетических объектов'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const area = (input.areaSize || 100) / 100; // км²
    const areaM2 = area * 1_000_000; // м²
    
    let spacing: number;
    let scale: string;
    
    if (selectedVariant.id === 'variant-hydro-vsn') {
      spacing = 35;
      scale = '1:1000';
    } else {
      spacing = 50;
      scale = '1:2000';
    }
    
    // Количество точек картировочного бурения
    const boringPoints = Math.ceil(Math.sqrt(areaM2) / spacing);
    
    return [
      {
        workId: 'survey-detailed',
        name: `Детальная инженерно-геологическая съёмка масштаба ${scale}`,
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'км²',
        normativeBase: selectedVariant.normative.document,
        description: `Картировочное бурение через ${spacing} м, ${boringPoints} точек`,
        priority: selectedVariant.priority,
        tags: ['съёмка', 'детальная', 'крупномасштабная'],
        notes: [
          `Масштаб: ${scale}`,
          `Шаг бурения: ${spacing} м`,
          `Точек картировки: ${boringPoints}`
        ]
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 7
// ============================================================================

export const section07Blocks: InstructionBlock[] = [
  // Масштаб 1:25000 (ТЭО)
  block_07_01_survey_25k_cat1,
  block_07_02_survey_25k_cat2,
  block_07_03_survey_25k_cat3,
  
  // Масштаб 1:10000 (Проект)
  block_07_04_survey_10k_cat1,
  block_07_05_survey_10k_cat2,
  block_07_06_survey_10k_cat3,
  
  // Детальная съёмка
  block_07_07_survey_detailed
];

export default section07Blocks;
