/**
 * Файл: /modules/geological/section04-work-sequence.ts
 * Путь: /home/claude/smartestimate/modules/rules-engine/geological/sections/
 * Назначение: Блоки инструкции для порядка и последовательности выполнения работ
 * 
 * Описание:
 * Реализация Раздела 4 инструкции РК - определение этапности, последовательности
 * и обязательных элементов инженерно-геологических изысканий согласно 
 * Правилам осуществления ИГИ РК (2020) и СП РК 1.02-105-2014
 * 
 * Содержит 6 блоков:
 * - 4.1: Этапность выполнения изысканий (3 этапа)
 * - 4.2: Последовательность изыскательских работ (9 шагов)
 * - 4.3: Сбор материалов прошлых лет (обязательный)
 * - 4.4: Необходимость инженерно-геологической съёмки
 * - 4.5: Необходимость гидрогеологических изысканий
 * - 4.6: Необходимость стационарных наблюдений
 * 
 * Исправлены ошибки:
 * - Добавлен недостающий метод generateWorks в блок 4.2
 * - Реализованы все обязательные методы
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 4.1: ЭТАПНОСТЬ ВЫПОЛНЕНИЯ ИЗЫСКАНИЙ
// ============================================================================

/**
 * Блок 4.1: Этапность выполнения изысканий (3 этапа)
 */
export const block_04_01_stages: InstructionBlock = {
  id: 'block-04-01-stages',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Этапность выполнения изысканий',
  description: 'Определение обязательных этапов инженерно-геологических изысканий',
  priority: 30,
  tags: ['этапность', 'обязательный', 'порядок-работ'],
  
  condition: (input: GeologicalInput) => {
    // Применимо всегда
    return true;
  },
  
  variants: [
    {
      id: 'variant-highest-rules',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 1',
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Выполнять работы в три этапа: 1) Подготовительный 2) Полевой 3) Камеральный'
    },
    {
      id: 'variant-mandatory-sp-rk',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 4.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Этапы изысканий: подготовка → полевые работы → камеральная обработка'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
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
  description: 'Детальная последовательность выполнения всех видов работ',
  priority: 31,
  tags: ['последовательность', 'обязательный', 'этапы-работ'],
  
  condition: (input: GeologicalInput) => {
    // Применимо для всех объектов
    return true;
  },
  
  variants: [
    {
      id: 'variant-highest-rules-sequence',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 11-19',
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Последовательность:\n' +
        '1. Сбор фондовых материалов\n' +
        '2. Дешифрирование материалов аэро- и космосъёмки\n' +
        '3. Маршрутные наблюдения\n' +
        '4. Проходка горных выработок\n' +
        '5. Геофизические исследования\n' +
        '6. Полевые исследования грунтов\n' +
        '7. Гидрогеологические исследования\n' +
        '8. Стационарные наблюдения\n' +
        '9. Лабораторные исследования'
    },
    {
      id: 'variant-reference-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 1.4',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов: последовательность работ определяется спецификой объекта',
      applicableWhen: (input) => input.objectType === 'гидроэнергетический' || input.requiresVSN === true
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const works: WorkItem[] = [
      {
        workId: 'seq-01-archive',
        name: '1. Сбор фондовых материалов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплект',
        normativeBase: selectedVariant.normative.document,
        description: 'Сбор и анализ архивных материалов изысканий прошлых лет',
        priority: selectedVariant.priority,
        tags: ['последовательность', 'шаг-1']
      },
      {
        workId: 'seq-02-remote',
        name: '2. Дешифрирование аэрокосмоснимков',
        category: 'optional',
        module: 'geological',
        quantity: 1,
        unit: 'комплект',
        normativeBase: selectedVariant.normative.document,
        description: 'Анализ материалов дистанционного зондирования',
        priority: selectedVariant.priority,
        dependencies: ['seq-01-archive'],
        tags: ['последовательность', 'шаг-2']
      },
      {
        workId: 'seq-03-reconnaissance',
        name: '3. Маршрутные наблюдения',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'маршрут',
        normativeBase: selectedVariant.normative.document,
        description: 'Рекогносцировочное обследование территории',
        priority: selectedVariant.priority,
        dependencies: ['seq-02-remote'],
        tags: ['последовательность', 'шаг-3']
      },
      {
        workId: 'seq-04-drilling',
        name: '4. Проходка горных выработок',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Бурение скважин и проходка шурфов',
        priority: selectedVariant.priority,
        dependencies: ['seq-03-reconnaissance'],
        tags: ['последовательность', 'шаг-4']
      },
      {
        workId: 'seq-05-geophysics',
        name: '5. Геофизические исследования',
        category: 'optional',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Электроразведка, сейсморазведка, георадар',
        priority: selectedVariant.priority,
        dependencies: ['seq-04-drilling'],
        tags: ['последовательность', 'шаг-5']
      },
      {
        workId: 'seq-06-field-tests',
        name: '6. Полевые исследования грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Зондирование, испытания, опробование',
        priority: selectedVariant.priority,
        dependencies: ['seq-04-drilling'],
        tags: ['последовательность', 'шаг-6']
      },
      {
        workId: 'seq-07-hydrogeology',
        name: '7. Гидрогеологические исследования',
        category: 'conditional',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Изучение подземных вод',
        priority: selectedVariant.priority,
        dependencies: ['seq-04-drilling'],
        tags: ['последовательность', 'шаг-7']
      },
      {
        workId: 'seq-08-monitoring',
        name: '8. Стационарные наблюдения',
        category: 'conditional',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Мониторинг опасных процессов',
        priority: selectedVariant.priority,
        dependencies: ['seq-07-hydrogeology'],
        tags: ['последовательность', 'шаг-8']
      },
      {
        workId: 'seq-09-laboratory',
        name: '9. Лабораторные исследования',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Определение свойств грунтов в лаборатории',
        priority: selectedVariant.priority,
        dependencies: ['seq-06-field-tests'],
        tags: ['последовательность', 'шаг-9']
      }
    ];
    
    return works;
  }
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
          unit: '',
          explanation: 'Обязательный элемент изысканий'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    return [
      {
        workId: 'archive-materials-collection',
        name: 'Сбор и обработка архивных материалов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплект',
        normativeBase: 'Правила осуществления ИГИ РК, п. 18',
        description: 'Сбор всех доступных материалов изысканий прошлых лет, карт, отчётов',
        priority: 'ВЫСШИЙ',
        tags: ['архив', 'обязательный']
      },
      {
        workId: 'archive-analysis',
        name: 'Анализ архивных материалов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'отчет',
        normativeBase: 'Правила осуществления ИГИ РК, п. 18',
        description: 'Составление обзора изученности территории',
        priority: 'ВЫСШИЙ',
        dependencies: ['archive-materials-collection'],
        tags: ['анализ', 'архив']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 4.4: НЕОБХОДИМОСТЬ ИНЖЕНЕРНО-ГЕОЛОГИЧЕСКОЙ СЪЁМКИ
// ============================================================================

/**
 * Блок 4.4: Инженерно-геологическая съёмка
 */
export const block_04_04_geological_survey: InstructionBlock = {
  id: 'block-04-04-geological-survey',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Необходимость инженерно-геологической съёмки',
  description: 'Определение необходимости выполнения инженерно-геологической съёмки',
  priority: 33,
  tags: ['съемка', 'условно-обязательный', 'геология'],
  
  condition: (input: GeologicalInput) => {
    // Съёмка нужна для сложных условий или больших площадей
    return (
      input.geotechnicalCategory === 'III' ||
      (input.areaSize && input.areaSize > 10) ||
      input.isUnexplored === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-survey',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 5.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Выполнить инженерно-геологическую съёмку масштаба 1:1000-1:5000',
      applicableWhen: (input) => input.geotechnicalCategory === 'III'
    },
    {
      id: 'variant-reference-large-area',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 5.2',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Рекомендуется съёмка для площадей более 10 га',
      applicableWhen: (input) => input.areaSize && input.areaSize > 10
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const area = input.areaSize || 1;
    const scale = area > 50 ? '1:5000' : '1:2000';
    
    return [
      {
        workId: 'geological-survey',
        name: `Инженерно-геологическая съёмка М ${scale}`,
        category: 'mandatory',
        module: 'geological',
        quantity: area,
        unit: 'га',
        normativeBase: 'СП РК 1.02-105-2014, п. 5.1',
        description: `Детальная съёмка территории площадью ${area} га`,
        priority: selectedVariant.priority,
        tags: ['съемка', 'геология']
      },
      {
        workId: 'survey-map',
        name: 'Составление инженерно-геологической карты',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'карта',
        normativeBase: 'СП РК 1.02-105-2014, п. 5.1',
        description: `Карта масштаба ${scale} с характеристикой условий`,
        priority: selectedVariant.priority,
        dependencies: ['geological-survey'],
        tags: ['карта', 'съемка']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 4.5: НЕОБХОДИМОСТЬ ГИДРОГЕОЛОГИЧЕСКИХ ИЗЫСКАНИЙ
// ============================================================================

/**
 * Блок 4.5: Гидрогеологические изыскания
 */
export const block_04_05_hydrogeology: InstructionBlock = {
  id: 'block-04-05-hydrogeology',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Необходимость гидрогеологических изысканий',
  description: 'Определение необходимости специальных гидрогеологических работ',
  priority: 34,
  tags: ['гидрогеология', 'условно-обязательный', 'подземные-воды'],
  
  condition: (input: GeologicalInput) => {
    // Гидрогеология нужна при наличии подземных вод или заглублении
    return (
      input.hasGroundwater === true ||
      (input.foundationDepth && input.foundationDepth > 5) ||
      input.hasBasement === true ||
      input.requiresDewatering === true
    );
  },
  
  variants: [
    {
      id: 'variant-highest-rules-hydro',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'п. 22',
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Выполнить гидрогеологические исследования при наличии подземных вод',
      applicableWhen: (input) => input.hasGroundwater === true
    },
    {
      id: 'variant-mandatory-sp-basement',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 7.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Обязательны гидрогеологические работы при подземном строительстве',
      applicableWhen: (input) => input.hasBasement === true
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const works: WorkItem[] = [];
    
    if (input.hasGroundwater) {
      works.push({
        workId: 'hydro-mapping',
        name: 'Гидрогеологическое картирование',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Изучение режима и химического состава подземных вод',
        priority: selectedVariant.priority,
        tags: ['гидрогеология', 'картирование']
      });
      
      works.push({
        workId: 'water-sampling',
        name: 'Отбор проб воды',
        category: 'mandatory',
        module: 'geological',
        quantity: 3,
        unit: 'проб',
        normativeBase: 'ГОСТ 31861-2012',
        description: 'Отбор проб для определения агрессивности к бетону',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['гидрогеология', 'пробы']
      });
    }
    
    if (input.requiresDewatering) {
      works.push({
        workId: 'pumping-tests',
        name: 'Откачки из скважин',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'откачка',
        normativeBase: 'СП РК 1.02-105-2014, п. 7.3',
        description: 'Определение фильтрационных характеристик',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['откачки', 'фильтрация']
      });
    }
    
    return works;
  }
};

// ============================================================================
// РАЗДЕЛ 4.6: НЕОБХОДИМОСТЬ СТАЦИОНАРНЫХ НАБЛЮДЕНИЙ
// ============================================================================

/**
 * Блок 4.6: Стационарные наблюдения (мониторинг)
 */
export const block_04_06_monitoring: InstructionBlock = {
  id: 'block-04-06-monitoring',
  section: 'Раздел 4: Порядок выполнения работ',
  title: 'Необходимость стационарных наблюдений',
  description: 'Определение необходимости организации мониторинга опасных процессов',
  priority: 35,
  tags: ['мониторинг', 'условно-обязательный', 'опасные-процессы'],
  
  condition: (input: GeologicalInput) => {
    // Мониторинг нужен при опасных процессах или ответственных объектах
    return (
      (input.hazards && input.hazards.length > 0) ||
      input.responsibilityLevel === 'I' ||
      input.requiresMonitoring === true
    );
  },
  
  variants: [
    {
      id: 'variant-highest-hazards',
      priority: 'ВЫСШИЙ',
      normative: {
        document: 'Правила осуществления ИГИ РК',
        section: 'п. 28',
        priority: 'ВЫСШИЙ'
      },
      recommendation: 'Организовать стационарные наблюдения за опасными геологическими процессами',
      applicableWhen: (input) => input.hazards && input.hazards.length > 0
    },
    {
      id: 'variant-mandatory-responsibility',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-105-2014',
        section: 'п. 8.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Мониторинг обязателен для объектов I уровня ответственности',
      applicableWhen: (input) => input.responsibilityLevel === 'I'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const works: WorkItem[] = [];
    const monitoringPeriod = input.constructionDuration || 24; // месяцы
    
    // Базовая сеть наблюдений
    works.push({
      workId: 'monitoring-network',
      name: 'Организация сети мониторинга',
      category: 'mandatory',
      module: 'geological',
      quantity: 1,
      unit: 'сеть',
      normativeBase: selectedVariant.normative.document,
      description: 'Установка реперов и наблюдательных скважин',
      priority: selectedVariant.priority,
      tags: ['мониторинг', 'сеть']
    });
    
    // Периодические наблюдения
    works.push({
      workId: 'periodic-observations',
      name: 'Периодические наблюдения',
      category: 'mandatory',
      module: 'geological',
      quantity: monitoringPeriod,
      unit: 'месяцев',
      normativeBase: selectedVariant.normative.document,
      description: `Ежемесячные замеры в течение ${monitoringPeriod} месяцев`,
      priority: selectedVariant.priority,
      dependencies: ['monitoring-network'],
      tags: ['мониторинг', 'наблюдения']
    });
    
    // Специфические наблюдения для опасных процессов
    if (input.hazards) {
      input.hazards.forEach((hazard) => {
        works.push({
          workId: `monitoring-${hazard}`,
          name: `Мониторинг процесса: ${hazard}`,
          category: 'mandatory',
          module: 'geological',
          quantity: monitoringPeriod,
          unit: 'месяцев',
          normativeBase: 'СП РК 1.02-105-2014, п. 8.2',
          description: `Специальные наблюдения за ${hazard}`,
          priority: 'ОБЯЗАТЕЛЬНЫЙ',
          dependencies: ['monitoring-network'],
          tags: ['мониторинг', hazard]
        });
      });
    }
    
    return works;
  }
};

// ============================================================================
// ЭКСПОРТ ВСЕХ БЛОКОВ РАЗДЕЛА 4
// ============================================================================

export const section04Blocks: InstructionBlock[] = [
  block_04_01_stages,
  block_04_02_sequence,
  block_04_03_archive,
  block_04_04_geological_survey,
  block_04_05_hydrogeology,
  block_04_06_monitoring
];

export default section04Blocks;