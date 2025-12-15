/**
 * Файл: /modules/geological/section08-hydrogeology.ts
 * Назначение: Блоки инструкции для определения объёмов гидрогеологических исследований
 * 
 * Описание:
 * Реализация гидрогеологических работ - скважины, опытно-фильтрационные работы,
 * химический анализ подземных вод согласно СП РК 1.02-102-2014, раздел 5.12-5.13
 * 
 * Содержит 10 блоков:
 * - 8.1: Гидрогеологические скважины (2 блока)
 * - 8.2: Опытно-фильтрационные работы (3 блока)
 * - 8.3: Химический анализ воды (3 блока)
 * - 8.4: Режимные наблюдения (2 блока)
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 8.1: ГИДРОГЕОЛОГИЧЕСКИЕ СКВАЖИНЫ
// ============================================================================

/**
 * Блок 8.1.1: Количество гидрогеологических скважин
 */
export const block_08_01_hydro_wells_count: InstructionBlock = {
  id: 'block-08-01-hydro-wells-count',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Количество гидрогеологических скважин',
  description: 'Определение необходимого количества скважин в зависимости от площади',
  priority: 100,
  tags: ['гидрогеология', 'скважины', 'количество'],
  
  condition: (input: GeologicalInput) => {
    // Если есть подвал, большая глубина или водонасыщенные грунты
    return (
      input.hasBasement ||
      (input.undergroundFloors && input.undergroundFloors > 0) ||
      (input.specialSoils && input.specialSoils.some(s => s.toLowerCase().includes('водонасыщ')))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.12',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Не менее 3 гидрогеологических скважин на участок до 1 км², по 1-2 дополнительные скважины на каждый последующий км²',
      recommendedValues: {
        minWells: {
          value: 3,
          min: 3,
          unit: 'скважин',
          explanation: 'Минимум для участка до 1 км²'
        },
        additionalPerKm2: {
          value: 1.5,
          min: 1,
          max: 2,
          unit: 'скважин/км²',
          explanation: 'Дополнительные на каждый км²'
        }
      },
      note: 'Количество может быть увеличено для сложных гидрогеологических условий'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Расчёт количества скважин
    const area = input.areaSize || 1; // га -> км²
    const areaKm2 = area / 100;
    
    let wellsCount = 3; // Минимум
    if (areaKm2 > 1) {
      const additionalArea = areaKm2 - 1;
      wellsCount += Math.ceil(additionalArea * 1.5); // 1-2 на каждый км²
    }
    
    // Увеличить для сложных условий
    if (input.geotechnicalCategory === 'III') {
      wellsCount = Math.ceil(wellsCount * 1.3);
    }
    
    return [
      {
        workId: 'hydro-wells',
        name: 'Гидрогеологические скважины',
        category: 'mandatory',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скважин',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.12',
        description: `${wellsCount} скважин для площади ${areaKm2.toFixed(2)} км²`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['гидрогеология', 'скважины'],
        notes: [`Площадь участка: ${areaKm2.toFixed(2)} км²`]
      }
    ];
  }
};

/**
 * Блок 8.1.2: Глубина гидрогеологических скважин
 */
export const block_08_02_hydro_wells_depth: InstructionBlock = {
  id: 'block-08-02-hydro-wells-depth',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Глубина гидрогеологических скважин',
  description: 'Определение необходимой глубины вскрытия водоносного горизонта',
  priority: 101,
  tags: ['гидрогеология', 'скважины', 'глубина'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.hasBasement ||
      (input.undergroundFloors && input.undergroundFloors > 0)
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.12',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Глубина гидрогеологических скважин:\n' +
        '- Вскрытие водоносного горизонта на 3-5 м, ИЛИ\n' +
        '- H + 10 м (где H - глубина подошвы фундамента)',
      recommendedValues: {
        penetrationIntoAquifer: {
          value: 4,
          min: 3,
          max: 5,
          unit: 'м',
          explanation: 'Проходка в водоносный горизонт'
        },
        belowFoundation: {
          value: 10,
          unit: 'м',
          explanation: 'Ниже подошвы фундамента'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    // Расчёт глубины
    const foundationDepth = (input.undergroundFloors || 0) * 3 + 2; // примерная глубина
    const recommendedDepth = foundationDepth + 10;
    
    return [
      {
        workId: 'hydro-wells-depth',
        name: 'Определение глубины гидрогеологических скважин',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'требование',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.12',
        description: `Глубина: H + 10 м = ${recommendedDepth} м, или вскрытие водоносного горизонта на 3-5 м`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['гидрогеология', 'глубина'],
        notes: [
          `Глубина фундамента: ~${foundationDepth} м`,
          `Рекомендуемая глубина скважин: ${recommendedDepth} м`
        ]
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 8.2: ОПЫТНО-ФИЛЬТРАЦИОННЫЕ РАБОТЫ
// ============================================================================

/**
 * Блок 8.2.1: Экспресс-откачки (простые условия)
 */
export const block_08_03_express_pumping: InstructionBlock = {
  id: 'block-08-03-express-pumping-tests',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Экспресс-откачки',
  description: 'Кратковременные откачки для простых гидрогеологических условий',
  priority: 102,
  tags: ['гидрогеология', 'откачки', 'фильтрация'],
  
  condition: (input: GeologicalInput) => {
    // Для простых объектов
    return (
      input.geotechnicalCategory === 'I' ||
      input.responsibilityLevel === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-recommended-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение М',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Экспресс-откачки продолжительностью 4-8 часов в каждой гидрогеологической скважине для определения водопроводимости',
      recommendedValues: {
        duration: {
          value: 6,
          min: 4,
          max: 8,
          unit: 'часов',
          explanation: 'Продолжительность откачки'
        },
        wellsPerPumping: {
          value: 1,
          unit: 'скважин',
          explanation: 'Откачка в каждой скважине'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const wellsCount = 3; // Из предыдущего блока
    const duration = selectedVariant.recommendedValues?.duration?.value || 6;
    
    return [
      {
        workId: 'hydro-express-pumping',
        name: 'Экспресс-откачки',
        category: 'recommended',
        module: 'geological',
        quantity: wellsCount,
        unit: 'откачек',
        normativeBase: 'СП РК 1.02-102-2014, Приложение М',
        description: `${wellsCount} экспресс-откачки по ${duration} часов`,
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['откачки', 'экспресс']
      }
    ];
  }
};

/**
 * Блок 8.2.2: Опытные откачки (сложные условия)
 */
export const block_08_04_pilot_pumping: InstructionBlock = {
  id: 'block-08-04-pilot-pumping-tests',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Опытные откачки',
  description: 'Длительные откачки с наблюдательными скважинами',
  priority: 103,
  tags: ['гидрогеология', 'откачки', 'водопонижение'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geotechnicalCategory === 'III' ||
      input.responsibilityLevel === 'I' ||
      (input.hasBasement && (input.undergroundFloors || 0) >= 2) // Глубокий подвал
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение М',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Опытные откачки продолжительностью 72 часа с наблюдательными скважинами (минимум 3 наблюдательных на разных расстояниях) для определения гидрогеологических параметров',
      recommendedValues: {
        duration: {
          value: 72,
          min: 72,
          unit: 'часов',
          explanation: 'Продолжительность откачки'
        },
        observationWells: {
          value: 3,
          min: 3,
          unit: 'скважин',
          explanation: 'Наблюдательные скважины'
        }
      },
      warnings: ['Обязательны для объектов III категории и при проектировании водопонижения']
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const pumpingTests = 2; // Минимум 2 опытные откачки
    const observationWells = selectedVariant.recommendedValues?.observationWells?.value || 3;
    
    return [
      {
        workId: 'hydro-pilot-pumping',
        name: 'Опытные откачки продолжительностью 72 часа',
        category: 'mandatory',
        module: 'geological',
        quantity: pumpingTests,
        unit: 'откачек',
        normativeBase: 'СП РК 1.02-102-2014, Приложение М',
        description: `${pumpingTests} откачки по 72 часа`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['откачки', 'опытные']
      },
      {
        workId: 'hydro-observation-wells',
        name: 'Наблюдательные скважины для откачек',
        category: 'mandatory',
        module: 'geological',
        quantity: pumpingTests * observationWells,
        unit: 'скважин',
        normativeBase: 'СП РК 1.02-102-2014, Приложение М',
        description: `${observationWells} наблюдательных на каждую откачку`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['откачки', 'наблюдательные']
      }
    ];
  }
};

/**
 * Блок 8.2.3: Кустовые откачки (особо сложные объекты)
 */
export const block_08_05_cluster_pumping: InstructionBlock = {
  id: 'block-08-05-cluster-pumping-tests',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Кустовые откачки для сложных объектов',
  description: 'Длительные откачки с системой наблюдательных скважин',
  priority: 104,
  tags: ['гидрогеология', 'откачки', 'кустовые'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'гидроэнергетический' ||
      input.objectType === 'гидротехнический' ||
      (input.geotechnicalCategory === 'III' && input.responsibilityLevel === 'I')
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-vsn-sp-rk',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'ВСН 34.2-88, п. 4.11; СП РК 1.02-102-2014',
        section: 'Приложение М',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Кустовые откачки с центральной и 3-4 наблюдательными скважинами, продолжительность 7-30 суток для детального изучения фильтрационных свойств',
      recommendedValues: {
        duration: {
          value: 14,
          min: 7,
          max: 30,
          unit: 'суток',
          explanation: 'Продолжительность откачки'
        },
        observationWells: {
          value: 4,
          min: 3,
          max: 4,
          unit: 'скважин',
          explanation: 'Наблюдательные скважины в кусте'
        }
      },
      warnings: ['Требуется для гидроэнергетических объектов и особо сложных условий']
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const clusters = 1; // Минимум 1 куст
    const observationWells = selectedVariant.recommendedValues?.observationWells?.value || 4;
    
    return [
      {
        workId: 'hydro-cluster-pumping',
        name: 'Кустовая откачка продолжительностью 7-30 суток',
        category: 'mandatory',
        module: 'geological',
        quantity: clusters,
        unit: 'кустов',
        normativeBase: 'ВСН 34.2-88, п. 4.11; СП РК 1.02-102-2014',
        description: 'Центральная скважина + 4 наблюдательные',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['откачки', 'кустовые']
      },
      {
        workId: 'hydro-cluster-observation',
        name: 'Наблюдательные скважины в кусте',
        category: 'mandatory',
        module: 'geological',
        quantity: clusters * observationWells,
        unit: 'скважин',
        normativeBase: 'ВСН 34.2-88, п. 4.11',
        description: `${observationWells} наблюдательных на разных расстояниях`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['откачки', 'наблюдательные', 'куст']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 8.3: ХИМИЧЕСКИЙ АНАЛИЗ ПОДЗЕМНЫХ ВОД
// ============================================================================

/**
 * Блок 8.3.1: Стандартный химический анализ воды
 */
export const block_08_06_water_standard: InstructionBlock = {
  id: 'block-08-06-water-analysis-standard',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Стандартный химический анализ воды',
  description: 'Базовый комплекс химанализа для оценки агрессивности',
  priority: 105,
  tags: ['гидрогеология', 'химанализ', 'агрессивность'],
  
  condition: (input: GeologicalInput) => {
    // Всегда нужен, если вскрыты подземные воды
    return (
      input.hasBasement ||
      (input.undergroundFloors && input.undergroundFloors > 0)
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение П',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Стандартный химический анализ воды включает:\n' +
        '- pH, общую минерализацию, жёсткость\n' +
        '- Главные ионы: HCO₃⁻, SO₄²⁻, Cl⁻, Ca²⁺, Mg²⁺, Na⁺ + K⁺\n' +
        '- Оценку агрессивности к бетону (сульфаты, хлориды, углекислота)\n' +
        '- Оценку коррозионной активности к металлам',
      recommendedValues: {
        parametersCount: {
          value: 12,
          unit: 'показателей',
          explanation: 'Стандартный комплекс'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const samplesCount = 3; // Минимум 3 пробы для статистики
    
    return [
      {
        workId: 'water-standard-analysis',
        name: 'Стандартный химический анализ подземных вод',
        category: 'mandatory',
        module: 'geological',
        quantity: samplesCount,
        unit: 'анализов',
        normativeBase: 'СП РК 1.02-102-2014, Приложение П',
        description: 'pH, минерализация, главные ионы, агрессивность к бетону и металлам',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['вода', 'химанализ', 'стандарт']
      }
    ];
  }
};

/**
 * Блок 8.3.2: Полный химический анализ воды
 */
export const block_08_07_water_full: InstructionBlock = {
  id: 'block-08-07-water-analysis-full',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Полный химический анализ воды',
  description: 'Расширенный комплекс для сложных объектов',
  priority: 106,
  tags: ['гидрогеология', 'химанализ', 'полный'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geotechnicalCategory === 'III' ||
      input.responsibilityLevel === 'I' ||
      input.objectType === 'гидроэнергетический' ||
      (input.hazards && input.hazards.some(h => h.toLowerCase().includes('загрязнен')))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение П',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Полный химический анализ воды дополнительно к стандартному:\n' +
        '- Fe общее, NH₄⁺, NO₂⁻, NO₃⁻, F⁻\n' +
        '- Агрессивную углекислоту, сульфид-ион (H₂S)\n' +
        '- Микрокомпоненты по спецпрограмме\n' +
        '- Органические загрязнители (при подозрении)',
      recommendedValues: {
        additionalParameters: {
          value: 8,
          unit: 'показателей',
          explanation: 'Дополнительно к стандартным'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const samplesCount = 3;
    
    return [
      {
        workId: 'water-full-analysis',
        name: 'Полный химический анализ подземных вод',
        category: 'mandatory',
        module: 'geological',
        quantity: samplesCount,
        unit: 'анализов',
        normativeBase: 'СП РК 1.02-102-2014, Приложение П',
        description: 'Стандарт + Fe, NH₄, NO₂, NO₃, F, агрессивная CO₂, H₂S',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['вода', 'химанализ', 'полный']
      }
    ];
  }
};

/**
 * Блок 8.3.3: Количество анализов воды для статистики
 */
export const block_08_08_water_statistics: InstructionBlock = {
  id: 'block-08-08-water-statistics-samples',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Количество анализов для статистической обработки',
  description: 'Подтверждение агрессивности несколькими пробами',
  priority: 107,
  tags: ['гидрогеология', 'химанализ', 'статистика'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.hasBasement ||
      (input.undergroundFloors && input.undergroundFloors > 0)
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.13',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Каждый выявленный тип агрессивности воды должен быть подтверждён не менее чем тремя анализами для статистической достоверности',
      recommendedValues: {
        minSamplesPerType: {
          value: 3,
          min: 3,
          unit: 'анализов',
          explanation: 'На каждый тип агрессивности'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'water-statistics-requirement',
        name: 'Требование по количеству проб воды',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'требование',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.13',
        description: 'Минимум 3 анализа для подтверждения каждого типа агрессивности',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['вода', 'статистика']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 8.4: РЕЖИМНЫЕ НАБЛЮДЕНИЯ
// ============================================================================

/**
 * Блок 8.4.1: Режимные наблюдения за уровнем подземных вод
 */
export const block_08_09_water_monitoring: InstructionBlock = {
  id: 'block-08-09-water-level-monitoring',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Режимные наблюдения за уровнем подземных вод',
  description: 'Периодические замеры УГВ для установления амплитуды колебаний',
  priority: 108,
  tags: ['гидрогеология', 'мониторинг', 'УГВ'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geotechnicalCategory === 'III' ||
      (input.hasBasement && (input.undergroundFloors || 0) >= 1)
    );
  },
  
  variants: [
    {
      id: 'variant-recommended-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.14',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Режимные наблюдения за уровнем подземных вод минимум 1 год (для установления максимальных и минимальных отметок УГВ, амплитуды колебаний)',
      recommendedValues: {
        duration: {
          value: 12,
          min: 12,
          unit: 'месяцев',
          explanation: 'Полный гидрологический цикл'
        },
        frequency: {
          value: 'ежемесячно',
          unit: 'замеров',
          explanation: 'Периодичность замеров'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'hydro-monitoring-level',
        name: 'Режимные наблюдения за уровнем подземных вод',
        category: 'recommended',
        module: 'geological',
        quantity: 12,
        unit: 'месяцев',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.14',
        description: 'Ежемесячные замеры УГВ в течение года',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['мониторинг', 'УГВ']
      }
    ];
  }
};

/**
 * Блок 8.4.2: Ускоренные наблюдения (при сжатых сроках)
 */
export const block_08_10_water_accelerated: InstructionBlock = {
  id: 'block-08-10-water-accelerated-observations',
  section: 'Раздел 8: Гидрогеологические исследования',
  title: 'Ускоренные гидрогеологические наблюдения',
  description: 'Интенсивные наблюдения при сжатых сроках проектирования',
  priority: 109,
  tags: ['гидрогеология', 'мониторинг', 'ускоренный'],
  
  condition: (input: GeologicalInput) => {
    // Если нужно быстро
    return input.geotechnicalCategory === 'I' || input.responsibilityLevel === 'III';
  },
  
  variants: [
    {
      id: 'variant-acceptable-sp-rk-102',
      priority: 'ДОПУСТИМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.14',
        priority: 'ДОПУСТИМЫЙ'
      },
      recommendation: 'При сжатых сроках допускается проведение наблюдений в течение наиболее информативного периода (весеннее снеготаяние + осенние дожди), но не менее 3 месяцев',
      recommendedValues: {
        minDuration: {
          value: 3,
          min: 3,
          unit: 'месяцев',
          explanation: 'Минимальный период'
        },
        keyPeriods: {
          value: ['весна', 'осень'],
          unit: 'сезоны',
          explanation: 'Критические периоды'
        }
      },
      note: 'Результаты менее достоверны, чем годовой цикл'
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'hydro-monitoring-accelerated',
        name: 'Ускоренные гидрогеологические наблюдения',
        category: 'optional',
        module: 'geological',
        quantity: 3,
        unit: 'месяца',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.14',
        description: 'Наблюдения в критические периоды (весна + осень)',
        priority: 'ДОПУСТИМЫЙ',
        tags: ['мониторинг', 'ускоренный']
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 8
// ============================================================================

export const section08Blocks: InstructionBlock[] = [
  // Гидрогеологические скважины
  block_08_01_hydro_wells_count,
  block_08_02_hydro_wells_depth,
  
  // Опытно-фильтрационные работы
  block_08_03_express_pumping,
  block_08_04_pilot_pumping,
  block_08_05_cluster_pumping,
  
  // Химический анализ воды
  block_08_06_water_standard,
  block_08_07_water_full,
  block_08_08_water_statistics,
  
  // Режимные наблюдения
  block_08_09_water_monitoring,
  block_08_10_water_accelerated
];

export default section08Blocks;
