/**
 * Файл: /modules/geological/section11-geophysics.ts
 * Назначение: Блоки инструкции для геофизических исследований
 * 
 * ПРИМЕЧАНИЕ: Это Раздел 14 инструкции, но файл называется section11
 * 
 * Описание:
 * Реализация требований к геофизическим исследованиям - выбор методов и объёмов
 * работ согласно СП РК 1.02-102-2014, Приложение Г
 * 
 * Содержит 2 подраздела:
 * - 14.1: Выбор геофизических методов (3 блока)
 * - 14.2: Плотность геофизических наблюдений (1 блок)
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 14.1: ВЫБОР ГЕОФИЗИЧЕСКИХ МЕТОДОВ
// ============================================================================

/**
 * Блок 14.1.1: Электроразведка ВЭЗ
 */
export const block_14_01_electrical: InstructionBlock = {
  id: 'block-14-01-electrical-survey',
  section: 'Раздел 14: Геофизические исследования',
  title: 'Электроразведка (ВЭЗ)',
  description: 'Вертикальные электрические зондирования для литологии и УГВ',
  priority: 140,
  tags: ['геофизика', 'ВЭЗ', 'электроразведка'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geophysicsMethods &&
      input.geophysicsMethods.some(method => 
        method.toLowerCase().includes('вэз') || 
        method.toLowerCase().includes('электр')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Г',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Электроразведочные работы рекомендуются для решения задач:\n' +
        '**Литологическое расчленение разреза:**\n' +
        '- Выделение слоёв с разным электрическим сопротивлением\n' +
        '- Определение границ литологических комплексов\n' +
        '**Определение УГВ:**\n' +
        '- Картирование уровня грунтовых вод\n' +
        '- Выявление обводнённых зон\n' +
        '**Мощность рыхлых отложений:**\n' +
        '- Определение глубины залегания скальных грунтов\n' +
        '- Оценка мощности четвертичных отложений\n\n' +
        '**Методы:**\n' +
        '- Вертикальные электрические зондирования (ВЭЗ)\n' +
        '- Электропрофилирование',
      recommendedValues: {
        methods: {
          value: ['ВЭЗ', 'электропрофилирование'],
          unit: 'методы',
          explanation: 'Основные методы электроразведки'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    // Плотность точек зависит от категории сложности (будет в следующем блоке)
    const category = input.geotechnicalCategory || 'II';
    let pointsPerKm2 = 6;
    
    if (category === 'I') pointsPerKm2 = 5;
    if (category === 'II') pointsPerKm2 = 7;
    if (category === 'III') pointsPerKm2 = 12;
    
    return [
      {
        workId: 'geophysics-vez',
        name: 'Вертикальные электрические зондирования (ВЭЗ)',
        category: 'recommended',
        module: 'geological',
        quantity: pointsPerKm2,
        unit: 'точек на км²',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Г',
        description: 'Литологическое расчленение, определение УГВ',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['геофизика', 'ВЭЗ']
      },
      {
        workId: 'geophysics-profiling',
        name: 'Электропрофилирование',
        category: 'recommended',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Г',
        description: 'Картирование литологических границ',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['геофизика', 'профилирование']
      }
    ];
  }
};

/**
 * Блок 14.1.2: Сейсморазведка
 */
export const block_14_02_seismic_survey: InstructionBlock = {
  id: 'block-14-02-seismic-survey',
  section: 'Раздел 14: Геофизические исследования',
  title: 'Сейсморазведка',
  description: 'Сейсморазведка для определения глубины скальных грунтов',
  priority: 141,
  tags: ['геофизика', 'сейсморазведка'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geophysicsMethods &&
      input.geophysicsMethods.some(method => 
        method.toLowerCase().includes('сейсм') || 
        method.toLowerCase().includes('каротаж')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Г',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Сейсморазведочные работы рекомендуются для:\n' +
        '**Определение глубины скальных грунтов:**\n' +
        '- Граница рыхлых и скальных пород по контрасту скоростей\n' +
        '**Выявление тектонических нарушений:**\n' +
        '- Разломы, зоны трещиноватости\n' +
        '**Сейсмическое микрорайонирование:**\n' +
        '- Скорости распространения сейсмических волн Vp, Vs\n' +
        '- Динамические характеристики грунтов\n\n' +
        '**Методы:**\n' +
        '- Сейсморазведка методом преломленных волн (МПВ)\n' +
        '- Сейсмокаротаж в скважинах',
      recommendedValues: {
        methods: {
          value: ['МПВ', 'сейсмокаротаж'],
          unit: 'методы',
          explanation: 'Основные методы сейсморазведки'
        }
      }
    },
    {
      id: 'variant-hydro-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 8.4',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов дополнительно:\n' +
        '- Сейсморазведка для изучения геологического строения створа ГЭС\n' +
        '- Выявление зон повышенной трещиноватости в основании плотины\n' +
        '- Сейсмоакустическое профилирование в акватории водохранилища',
      note: 'Для ГЭС и плотин'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const works: WorkItem[] = [
      {
        workId: 'geophysics-seismic-refraction',
        name: 'Сейсморазведка методом преломленных волн (МПВ)',
        category: 'recommended',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Г',
        description: 'Определение глубины скальных грунтов',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['геофизика', 'сейсморазведка', 'МПВ']
      },
      {
        workId: 'geophysics-seismic-logging',
        name: 'Сейсмокаротаж в скважинах',
        category: 'recommended',
        module: 'geological',
        quantity: 3,
        unit: 'скважин',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Г',
        description: 'Определение скоростей Vp, Vs для сейсмического микрорайонирования',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['геофизика', 'каротаж']
      }
    ];
    
    // Дополнительно для гидроэнергетики
    if (selectedVariant.id === 'variant-hydro-vsn') {
      works.push({
        workId: 'geophysics-dam-seismic',
        name: 'Сейсморазведка створа плотины',
        category: 'recommended',
        module: 'geological',
        quantity: 1,
        unit: 'створ',
        normativeBase: 'ВСН 34.2-88, п. 8.4',
        description: 'Изучение зон трещиноватости в основании плотины',
        priority: 'СПРАВОЧНЫЙ',
        tags: ['геофизика', 'плотина']
      });
    }
    
    return works;
  }
};

/**
 * Блок 14.1.3: Георадиолокация
 */
export const block_14_03_georadar: InstructionBlock = {
  id: 'block-14-03-georadar-survey',
  section: 'Раздел 14: Геофизические исследования',
  title: 'Георадиолокация (георадар)',
  description: 'Георадарное профилирование для малых глубин',
  priority: 142,
  tags: ['геофизика', 'георадар', 'GPR'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geophysicsMethods &&
      input.geophysicsMethods.some(method => 
        method.toLowerCase().includes('георадар') || 
        method.toLowerCase().includes('gpr')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Г',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Георадиолокация рекомендуется для:\n' +
        '**Застроенные территории:**\n' +
        '- Изучение разреза без бурения скважин\n' +
        '- Работы в стеснённых условиях\n' +
        '**Поиск коммуникаций:**\n' +
        '- Трассировка подземных коммуникаций\n' +
        '- Выявление пустот и неоднородностей\n' +
        '**Малые глубины исследований:**\n' +
        '- Изучение верхней части разреза до 10-15 м\n' +
        '- Детальное расчленение приповерхностных слоёв\n\n' +
        '**Преимущества:**\n' +
        '- Высокая детальность\n' +
        '- Неразрушающий метод\n' +
        '- Быстрота работ',
      recommendedValues: {
        depth: {
          value: 12,
          min: 10,
          max: 15,
          unit: 'м',
          explanation: 'Глубина исследований георадаром'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'geophysics-georadar',
        name: 'Георадарное профилирование',
        category: 'recommended',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Г',
        description: 'Изучение верхней части разреза до 10-15 м, поиск коммуникаций',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['геофизика', 'георадар']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 14.2: ПЛОТНОСТЬ ГЕОФИЗИЧЕСКИХ НАБЛЮДЕНИЙ
// ============================================================================

/**
 * Блок 14.2: Плотность геофизических наблюдений по категориям сложности
 */
export const block_14_04_density: InstructionBlock = {
  id: 'block-14-04-geophysics-density',
  section: 'Раздел 14: Геофизические исследования',
  title: 'Плотность геофизических наблюдений',
  description: 'Количество точек геофизических наблюдений по категориям сложности',
  priority: 143,
  tags: ['геофизика', 'плотность', 'объёмы'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.geophysicsMethods !== undefined &&
      input.geophysicsMethods.length > 0 &&
      input.geotechnicalCategory !== undefined
    );
  },
  
  variants: [
    {
      id: 'variant-category-I',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Г',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      condition: (input: GeologicalInput) => input.geotechnicalCategory === 'I',
      recommendation: 'Для I категории сложности рекомендуется:\n' +
        '**Плотность ВЭЗ:** 4-6 точек на 1 км²\n' +
        'Простые геологические условия, выдержанное строение',
      recommendedValues: {
        vezDensity: {
          value: 5,
          min: 4,
          max: 6,
          unit: 'точек/км²',
          explanation: 'Для I категории'
        }
      }
    },
    {
      id: 'variant-category-II',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Г',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      condition: (input: GeologicalInput) => input.geotechnicalCategory === 'II',
      recommendation: 'Для II категории сложности рекомендуется:\n' +
        '**Плотность ВЭЗ:** 6-9 точек на 1 км²\n' +
        'Средней сложности геологические условия, умеренная изменчивость',
      recommendedValues: {
        vezDensity: {
          value: 7,
          min: 6,
          max: 9,
          unit: 'точек/км²',
          explanation: 'Для II категории'
        }
      }
    },
    {
      id: 'variant-category-III',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Г',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      condition: (input: GeologicalInput) => input.geotechnicalCategory === 'III',
      recommendation: 'Для III категории сложности рекомендуется:\n' +
        '**Плотность ВЭЗ:** 9-16 точек на 1 км²\n' +
        'Сложные геологические условия, высокая изменчивость, специфические грунты',
      recommendedValues: {
        vezDensity: {
          value: 12,
          min: 9,
          max: 16,
          unit: 'точек/км²',
          explanation: 'Для III категории'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const density = selectedVariant.recommendedValues?.vezDensity?.value || 7;
    
    return [
      {
        workId: 'geophysics-vez-density',
        name: `Вертикальные электрические зондирования (${input.geotechnicalCategory} категория)`,
        category: 'recommended',
        module: 'geological',
        quantity: density,
        unit: 'точек/км²',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Г',
        description: `Плотность точек ВЭЗ для ${input.geotechnicalCategory} категории сложности`,
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['геофизика', 'ВЭЗ', 'плотность']
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 14 (файл section11)
// ============================================================================

export const section11Blocks: InstructionBlock[] = [
  block_14_01_electrical,    // Электроразведка ВЭЗ
  block_14_02_seismic_survey, // Сейсморазведка
  block_14_03_georadar,      // Георадиолокация
  block_14_04_density        // Плотность наблюдений
];

export default section11Blocks;
