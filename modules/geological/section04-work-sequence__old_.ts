/**
 * Файл: /modules/geological/section04-workflow.ts
 * Назначение: Блоки инструкции для определения порядка выполнения изыскательских работ
 * 
 * Описание:
 * Реализация Раздела 4 инструкции РК - этапность изысканий, последовательность работ,
 * необходимость дополнительных исследований согласно Правилам осуществления ИГИ РК,
 * СП РК 1.02-102-2014, СП РК 1.02-105-2014, СТ РК 1399-2005, ВСН 34.2-88
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 4.1: ЭТАПНОСТЬ ВЫПОЛНЕНИЯ ИЗЫСКАНИЙ
// ============================================================================

/**
 * Блок 4.1: Этапность выполнения изысканий (обязательный для всех)
 */
export const block_04_01_stages: InstructionBlock = {
  id: 'block-04-01-stages-of-works',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Этапность выполнения изысканий',
  description: 'Три обязательных этапа: подготовительный, полевой, камеральный',
  priority: 30,
  tags: ['порядок-работ', 'этапность', 'обязательный', 'все-объекты'],
  
  condition: (input: GeologicalInput) => {
    // Применимо для ВСЕХ видов изысканий
    return true;
  },
  
  variants: [
    {
      id: 'variant-highest-rules',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 1',
        priority: 'ВЫСШИЙ',
        fullReference: 'Утв. приказом Министра индустрии и инфраструктурного развития РК от 30 сентября 2020 года № 509'
      },
      recommendation: 'Выполнение изысканий в три этапа:\n' +
        '1. **Подготовительный этап**: сбор и обработка материалов прошлых лет, подготовка программы изысканий, регистрация работ\n' +
        '2. **Полевой этап**: рекогносцировочное обследование, комплекс полевых работ, текущая обработка материалов\n' +
        '3. **Камеральный этап**: окончательная обработка данных, составление технического отчета',
      recommendedValues: {
        stages: {
          value: ['подготовительный', 'полевой', 'камеральный'],
          unit: 'этапы',
          explanation: 'Три последовательных этапа работ'
        }
      }
    },
    {
      id: 'variant-mandatory-sp-rk-105',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.7',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Инженерно-геологические изыскания выполняются в три этапа:\n' +
        '- Подготовительный период\n' +
        '- Полевые работы\n' +
        '- Камеральная обработка результатов',
      recommendedValues: {
        stages: {
          value: ['подготовительный', 'полевой', 'камеральный'],
          unit: 'этапы',
          explanation: 'Согласно СП РК'
        }
      }
    },
    {
      id: 'variant-mandatory-st-rk-1399',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'п. 5.1.1.4',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Изыскания выполняются поэтапно с учетом стадийности проектирования',
      recommendedValues: {
        stages: {
          value: ['подготовительный', 'полевой', 'камеральный'],
          unit: 'этапы',
          explanation: 'Стандарт РК'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [
      {
        workId: 'stage-01-preparation',
        name: 'Подготовительный этап',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'этап',
        normativeBase: 'Правила осуществления ИГИ РК, п. 1',
        description: 'Сбор материалов прошлых лет, программа работ, регистрация',
        priority: 'ВЫСШИЙ',
        tags: ['подготовительный', 'этап-1']
      },
      {
        workId: 'stage-02-field',
        name: 'Полевой этап',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'этап',
        normativeBase: 'Правила осуществления ИГИ РК, п. 1',
        description: 'Рекогносцировка, буровые работы, полевые испытания',
        priority: 'ВЫСШИЙ',
        dependencies: ['stage-01-preparation'],
        tags: ['полевой', 'этап-2']
      },
      {
        workId: 'stage-03-office',
        name: 'Камеральный этап',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'этап',
        normativeBase: 'Правила осуществления ИГИ РК, п. 1',
        description: 'Обработка данных, составление технического отчета',
        priority: 'ВЫСШИЙ',
        dependencies: ['stage-02-field'],
        tags: ['камеральный', 'этап-3']
      }
    ];
    
    return works;
  }
};

// ============================================================================
// РАЗДЕЛ 4.2: ПОСЛЕДОВАТЕЛЬНОСТЬ ИЗЫСКАТЕЛЬСКИХ РАБОТ
// ============================================================================

/**
 * Блок 4.2: Последовательность работ (9 этапов)
 */
export const block_04_02_sequence: InstructionBlock = {
  id: 'block-04-02-works-sequence',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Последовательность изыскательских работ',
  description: 'Обязательная последовательность выполнения работ в составе изысканий',
  priority: 31,
  tags: ['порядок-работ', 'последовательность', 'обязательный'],
  
  condition: (input: GeologicalInput) => {
    // Применимо для всех типов изысканий
    return true;
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.3',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Соблюдать последовательность работ:\n' +
        '1. Сбор и обработка материалов прошлых лет\n' +
        '2. Рекогносцировочное обследование территории\n' +
        '3. Инженерно-геологическая съемка (при необходимости)\n' +
        '4. Геофизические исследования\n' +
        '5. Горно-буровые работы\n' +
        '6. Полевые испытания грунтов\n' +
        '7. Гидрогеологические исследования\n' +
        '8. Лабораторные исследования\n' +
        '9. Стационарные наблюдения (при необходимости)',
      recommendedValues: {
        workSequence: {
          value: [
            'архивные материалы',
            'рекогносцировка',
            'геологическая съемка',
            'геофизика',
            'бурение',
            'полевые испытания',
            'гидрогеология',
            'лаборатория',
            'мониторинг'
          ],
          unit: 'последовательность',
          explanation: 'Рекомендуемый порядок работ'
        }
      },
      note: 'Последовательность может корректироваться в зависимости от конкретных условий объекта'
    },
    {
      id: 'variant-reference-vsn-hydro',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 1.4',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов: последовательность работ определяется спецификой объекта',
      applicableWhen: (input) => input.objectType === 'гидроэнергетический' || input.requiresVSN === true
    }
  ]
};

// ============================================================================
// РАЗДЕЛ 4.3: СБОР МАТЕРИАЛОВ ПРОШЛЫХ ЛЕТ
// ============================================================================

/**
 * Блок 4.3: Сбор архивных материалов (обязательный)
 */
export const block_04_03_archive: InstructionBlock = {
  id: 'block-04-03-archive-materials',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Сбор материалов прошлых лет',
  description: 'Обязательный сбор и обработка архивных материалов',
  priority: 32,
  tags: ['архивные-материалы', 'обязательный', 'подготовительный-этап'],
  
  condition: (input: GeologicalInput) => {
    // ВСЕГДА обязательно
    return true;
  },
  
  variants: [
    {
      id: 'variant-highest-rules',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 18',
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Выполнять сбор и обработку материалов:\n' +
        '- Инженерно-геологических изысканий прошлых лет\n' +
        '- Геолого-съемочных работ и геологических карт\n' +
        '- Аэрокосмических съемок территории\n' +
        '- Научно-исследовательских работ\n' +
        '- Данных о климате, рельефе, геологическом строении\n' +
        '- Сведений о деформациях зданий и опыте строительства',
      recommendedValues: {
        archiveRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Обязательно для всех объектов'
        }
      }
    },
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.6',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Сбор, анализ и обобщение материалов изысканий прошлых лет является обязательным',
      recommendedValues: {
        archiveRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Обязательно'
        }
      }
    },
    {
      id: 'variant-mandatory-st-rk-1399',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'п. 6.1.2.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Сбор, систематизация и анализ материалов прошлых лет',
      recommendedValues: {
        archiveRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Стандарт РК'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'archive-collection',
        name: 'Сбор и обработка материалов прошлых лет',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплект',
        normativeBase: 'Правила ИГИ РК, п. 18; СП РК 1.02-102-2014, п. 5.6',
        description: 'Сбор геологических карт, отчётов изысканий, аэрофотоснимков, данных о климате и опыте строительства',
        priority: 'ВЫСШИЙ',
        tags: ['архив', 'подготовительный']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 4.4: НЕОБХОДИМОСТЬ ИНЖЕНЕРНО-ГЕОЛОГИЧЕСКОЙ СЪЁМКИ
// ============================================================================

/**
 * Блок 4.4: Инженерно-геологическая съёмка (условно)
 */
export const block_04_04_survey: InstructionBlock = {
  id: 'block-04-04-geological-survey',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Необходимость инженерно-геологической съёмки',
  description: 'Определение необходимости выполнения ИГ съёмки в зависимости от стадии и изученности',
  priority: 33,
  tags: ['съёмка', 'условный', 'полевые-работы'],
  
  condition: (input: GeologicalInput) => {
    // Условия из инструкции (строки 206-212):
    return (
      input.designStage === 'предпроектная' ||
      (input.territoryStudyLevel === 'неизученная' && (input.buildingArea || 0) > 500000) || // > 0.5 км² = 500000 м²
      input.objectType === 'гидроэнергетический'
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
      recommendation: 'Включить инженерно-геологическую съёмку масштаба 1:25000-1:500 в зависимости от стадии и сложности территории',
      recommendedValues: {
        surveyRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Требуется съёмка'
        },
        surveyScale: {
          value: '1:2000',
          unit: 'масштаб',
          explanation: 'Рекомендуемый масштаб для предпроектной стадии',
          formula: 'Зависит от стадии проектирования'
        }
      }
    },
    {
      id: 'variant-reference-vsn-hydro',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 4.1',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов обязательна инженерно-геологическая съёмка масштаба 1:10000-1:5000',
      applicableWhen: (input) => input.objectType === 'гидроэнергетический',
      recommendedValues: {
        surveyRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Обязательно для ГЭС'
        },
        surveyScale: {
          value: '1:5000',
          unit: 'масштаб',
          explanation: 'Для гидроэнергетических объектов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    if (!selectedVariant.recommendedValues?.surveyRequired?.value) return [];
    
    const scale = selectedVariant.recommendedValues.surveyScale?.value || '1:2000';
    const area = input.buildingArea || 100000; // м²
    const areaInKm2 = area / 1000000; // Перевод в км²
    
    return [
      {
        workId: 'geological-survey',
        name: `Инженерно-геологическая съёмка М ${scale}`,
        category: 'mandatory',
        module: 'geological',
        quantity: Math.ceil(areaInKm2 * 10) / 10, // Округление до 0.1 км²
        unit: 'км²',
        normativeBase: selectedVariant.normative.document + ', ' + selectedVariant.normative.section,
        description: 'Съёмка территории для изучения геологического строения и опасных процессов',
        priority: selectedVariant.priority,
        tags: ['съёмка', 'полевые']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 4.5: НЕОБХОДИМОСТЬ ГИДРОГЕОЛОГИЧЕСКИХ ИЗЫСКАНИЙ
// ============================================================================

/**
 * Блок 4.5: Гидрогеологические изыскания (условно)
 */
export const block_04_05_hydrogeology: InstructionBlock = {
  id: 'block-04-05-hydrogeology-required',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Необходимость гидрогеологических изысканий',
  description: 'Определение необходимости гидрогеологических исследований',
  priority: 34,
  tags: ['гидрогеология', 'условный', 'подземные-воды'],
  
  condition: (input: GeologicalInput) => {
    // Условия из инструкции (строки 214-220):
    return (
      input.hasBasement ||
      (input.undergroundFloors && input.undergroundFloors > 0) ||
      input.foundationDepth > 3 ||
      input.foundationType === 'свайный' ||
      input.geotechnicalCategory === 'III' ||
      input.hasGroundwater ||
      input.groundwaterInActiveZone === true
    );
  },
  
  variants: [
    {
      id: 'variant-highest-rules',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 19',
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Включить гидрогеологические исследования для:\n' +
        '- Объектов с подземными частями\n' +
        '- Глубины фундаментов более 3 м\n' +
        '- Свайных фундаментов\n' +
        '- Сложных геотехнических условий\n' +
        '- При наличии подземных вод в зоне взаимодействия',
      recommendedValues: {
        hydrogeologyRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Требуются гидрогеологические изыскания'
        }
      }
    },
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.12',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Гидрогеологические исследования обязательны при наличии подземных вод в зоне влияния фундаментов',
      recommendedValues: {
        hydrogeologyRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Обязательно'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'hydrogeology-research',
        name: 'Гидрогеологические исследования',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'Правила ИГИ РК, п. 19; СП РК 1.02-102-2014, п. 5.12',
        description: 'Установление УГВ, химический анализ воды, фильтрационные испытания',
        priority: 'ВЫСШИЙ',
        tags: ['гидрогеология', 'подземные-воды']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 4.6: НЕОБХОДИМОСТЬ СТАЦИОНАРНЫХ НАБЛЮДЕНИЙ
// ============================================================================

/**
 * Блок 4.6: Стационарные наблюдения (условно)
 */
export const block_04_06_monitoring: InstructionBlock = {
  id: 'block-04-06-stationary-monitoring',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Необходимость стационарных наблюдений',
  description: 'Определение необходимости организации режимных наблюдений',
  priority: 35,
  tags: ['мониторинг', 'условный', 'наблюдения'],
  
  condition: (input: GeologicalInput) => {
    // Условия из инструкции (строки 222-228):
    return (
      input.geotechnicalCategory === 'III' ||
      (input.hazards && input.hazards.length > 0) ||
      input.objectType === 'гидроэнергетический' ||
      (input.specialSoils && input.specialSoils.length > 0) ||
      input.groundwaterInActiveZone === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.11',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Организовать стационарные наблюдения за динамикой геологической среды:\n' +
        '- Режим подземных вод\n' +
        '- Опасные геологические процессы\n' +
        '- Деформации грунтов (просадки, набухание)\n' +
        '- Температурный режим (для мерзлых грунтов)',
      recommendedValues: {
        monitoringRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Требуется мониторинг'
        },
        monitoringDuration: {
          value: 12,
          min: 6,
          max: 24,
          unit: 'месяцев',
          explanation: 'Минимальный период наблюдений - 1 год для полного гидрогеологического цикла',
          formula: 'Зависит от типа процессов и категории объекта'
        }
      },
      note: 'Для III геотехнической категории мониторинг обязателен'
    },
    {
      id: 'variant-reference-vsn-hydro',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 10.1',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов стационарные наблюдения обязательны на всех стадиях (изыскания, строительство, эксплуатация)',
      applicableWhen: (input) => input.objectType === 'гидроэнергетический',
      recommendedValues: {
        monitoringRequired: {
          value: true,
          unit: 'да/нет',
          explanation: 'Обязательно для ГЭС'
        },
        monitoringDuration: {
          value: 24,
          min: 24,
          unit: 'месяцев',
          explanation: 'Минимум 2 года для гидроэнергетических объектов'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    if (!selectedVariant.recommendedValues?.monitoringRequired?.value) return [];
    
    const duration = selectedVariant.recommendedValues.monitoringDuration?.value || 12;
    
    const works: WorkItem[] = [
      {
        workId: 'monitoring-groundwater',
        name: 'Режимные наблюдения за уровнем подземных вод',
        category: 'mandatory',
        module: 'geological',
        quantity: duration,
        unit: 'месяцев',
        normativeBase: selectedVariant.normative.document + ', ' + selectedVariant.normative.section,
        description: 'Ежемесячные замеры уровня подземных вод в наблюдательных скважинах',
        priority: selectedVariant.priority,
        tags: ['мониторинг', 'подземные-воды']
      }
    ];
    
    // Дополнительно - мониторинг опасных процессов
    if (input.hazards && input.hazards.length > 0) {
      works.push({
        workId: 'monitoring-hazards',
        name: 'Режимные наблюдения за опасными геологическими процессами',
        category: 'mandatory',
        module: 'geological',
        quantity: duration,
        unit: 'месяцев',
        normativeBase: selectedVariant.normative.document + ', ' + selectedVariant.normative.section,
        description: `Мониторинг: ${input.hazards.join(', ')}`,
        priority: selectedVariant.priority,
        tags: ['мониторинг', 'опасные-процессы']
      });
    }
    
    return works;
  }
};

// ============================================================================
// ЭКСПОРТ ВСЕХ БЛОКОВ РАЗДЕЛА 4
// ============================================================================

export const section04Blocks: InstructionBlock[] = [
  block_04_01_stages,              // 4.1 Этапность
  block_04_02_sequence,            // 4.2 Последовательность
  block_04_03_archive,             // 4.3 Архивные материалы
  block_04_04_survey,              // 4.4 Геологическая съёмка
  block_04_05_hydrogeology,        // 4.5 Гидрогеология
  block_04_06_monitoring           // 4.6 Мониторинг
];

export default section04Blocks;
