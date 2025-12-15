/**
 * Файл: /modules/geological/section09-specific-soils.ts
 * Назначение: Блоки инструкции для специальных исследований специфических грунтов
 * 
 * ПРИМЕЧАНИЕ: Это Раздел 12 инструкции, но файл называется section09
 * (Разделы 6-8 были созданы позже, поэтому нумерация файлов не совпадает)
 * 
 * Описание:
 * Реализация требований к исследованиям специфических грунтов - просадочных,
 * набухающих, засоленных, заторфованных, мерзлых согласно СП РК 1.02-102-2014, раздел 9
 * 
 * Содержит 5 блоков:
 * - 12.1: Просадочные грунты
 * - 12.2: Набухающие грунты
 * - 12.3: Засоленные грунты
 * - 12.4: Заторфованные грунты
 * - 12.5: Мерзлые грунты
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 12.1: ПРОСАДОЧНЫЕ ГРУНТЫ
// ============================================================================

/**
 * Блок 12.1: Исследования просадочных (лессовых) грунтов
 */
export const block_12_01_collapsible_soils: InstructionBlock = {
  id: 'block-12-01-collapsible-soils-investigation',
  section: 'Раздел 12: Специфические грунты',
  title: 'Исследования просадочных грунтов',
  description: 'Комплекс лабораторных и полевых испытаний просадочных (лессовых) грунтов',
  priority: 120,
  tags: ['специфические-грунты', 'просадочные', 'лессовые'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils &&
      input.specialSoils.some(soil => 
        soil.toLowerCase().includes('просадочн') || 
        soil.toLowerCase().includes('лессов')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 9.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для просадочных (лессовых) грунтов обязательно включить:\n' +
        '**Лабораторные испытания:**\n' +
        '- Испытания на просадочность (компрессионно-фильтрационные приборы)\n' +
        '- Определение относительной просадочности εsl\n' +
        '- Определение начального просадочного давления Psl\n' +
        '- Коэффициент относительной просадочности δsl\n' +
        '**Полевые испытания:**\n' +
        '- Испытания замачиванием в котлованах на опытных площадках\n' +
        '- Размер котлована не менее 10×10 м\n' +
        '- Контроль осадок штампами',
      recommendedValues: {
        labTests: {
          value: ['εsl', 'Psl', 'δsl'],
          unit: 'виды',
          explanation: 'Обязательные определения'
        },
        fieldTestPitSize: {
          value: 10,
          min: 10,
          unit: 'м',
          explanation: 'Размер котлована для замачивания'
        }
      },
      warnings: [
        'Просадочные грунты относятся к особо опасным',
        'При просадочности I типа (от собственного веса) требуются особые мероприятия',
        'Обязательны как лабораторные, так и полевые испытания'
      ]
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [
      {
        workId: 'collapsible-lab-tests',
        name: 'Лабораторные испытания просадочных грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.1',
        description: 'Определение εsl, Psl, δsl на компрессионно-фильтрационных приборах',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['просадочные', 'лаборатория']
      }
    ];
    
    // Полевые испытания для II-III категории
    if (input.geotechnicalCategory === 'II' || input.geotechnicalCategory === 'III') {
      works.push({
        workId: 'collapsible-field-tests',
        name: 'Полевые испытания просадочных грунтов замачиванием',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'площадка',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.1',
        description: 'Испытания в котловане 10×10 м с контролем осадок',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['просадочные', 'полевые', 'замачивание']
      });
    }
    
    return works;
  }
};

// ============================================================================
// РАЗДЕЛ 12.2: НАБУХАЮЩИЕ ГРУНТЫ
// ============================================================================

/**
 * Блок 12.2: Исследования набухающих грунтов
 */
export const block_12_02_swelling_soils: InstructionBlock = {
  id: 'block-12-02-swelling-soils-investigation',
  section: 'Раздел 12: Специфические грунты',
  title: 'Исследования набухающих грунтов',
  description: 'Определение параметров набухания глинистых грунтов',
  priority: 121,
  tags: ['специфические-грунты', 'набухающие'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils &&
      input.specialSoils.some(soil => soil.toLowerCase().includes('набухающ'))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 9.2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для набухающих грунтов обязательно включить:\n' +
        '- Определение давления набухания Psw (максимальное давление при набухании)\n' +
        '- Определение относительного набухания εsw\n' +
        '- Определение влажности набухания Wsw\n' +
        '- Влажность на границе набухания\n' +
        '- Испытания при различных уплотняющих нагрузках (0,05; 0,1; 0,2; 0,3 МПа)\n' +
        '- Построение кривой εsw = f(P)',
      recommendedValues: {
        parameters: {
          value: ['Psw', 'εsw', 'Wsw'],
          unit: 'виды',
          explanation: 'Обязательные определения'
        },
        loadSteps: {
          value: [0.05, 0.1, 0.2, 0.3],
          unit: 'МПа',
          explanation: 'Ступени нагружения'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'swelling-lab-tests',
        name: 'Лабораторные испытания набухающих грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.2',
        description: 'Определение Psw, εsw, Wsw при разных нагрузках',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['набухающие', 'лаборатория']
      },
      {
        workId: 'swelling-curve',
        name: 'Построение кривой набухания εsw = f(P)',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.2',
        description: 'Испытания при 4-5 ступенях нагрузки',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['набухающие', 'кривая']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 12.3: ЗАСОЛЕННЫЕ ГРУНТЫ
// ============================================================================

/**
 * Блок 12.3: Исследования засоленных грунтов
 */
export const block_12_03_saline_soils: InstructionBlock = {
  id: 'block-12-03-saline-soils-investigation',
  section: 'Раздел 12: Специфические грунты',
  title: 'Исследования засоленных грунтов',
  description: 'Химический анализ и определение типа засоления',
  priority: 122,
  tags: ['специфические-грунты', 'засоленные'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils &&
      input.specialSoils.some(soil => soil.toLowerCase().includes('засолен'))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 9.6',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для засоленных грунтов обязательно включить:\n' +
        '- Химический анализ водных вытяжек (содержание солей)\n' +
        '- Определение типа засоления:\n' +
        '  • Хлоридное (NaCl преобладает)\n' +
        '  • Сульфатное (Na₂SO₄ преобладает)\n' +
        '  • Содовое (Na₂CO₃ преобладает)\n' +
        '- Определение степени засоленности (слабо-, средне-, сильнозасоленные)\n' +
        '- Коррозионная активность к бетону и металлам\n' +
        '- Влияние на фильтрационные свойства',
      recommendedValues: {
        analyses: {
          value: ['химанализ', 'тип_засоления', 'степень', 'коррозия'],
          unit: 'виды',
          explanation: 'Обязательные определения'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'saline-chemical-analysis',
        name: 'Химический анализ засоленных грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.6',
        description: 'Водные вытяжки, тип и степень засоления',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['засоленные', 'химанализ']
      },
      {
        workId: 'saline-corrosion',
        name: 'Оценка коррозионной активности засоленных грунтов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.6',
        description: 'Агрессивность к бетону и металлам',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['засоленные', 'коррозия']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 12.4: ЗАТОРФОВАННЫЕ ГРУНТЫ
// ============================================================================

/**
 * Блок 12.4: Исследования заторфованных грунтов и торфов
 */
export const block_12_04_peat_soils: InstructionBlock = {
  id: 'block-12-04-peat-soils-investigation',
  section: 'Раздел 12: Специфические грунты',
  title: 'Исследования заторфованных грунтов и торфов',
  description: 'Специальные определения для органических грунтов',
  priority: 123,
  tags: ['специфические-грунты', 'заторфованные', 'торфы'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils &&
      input.specialSoils.some(soil => {
        const s = soil.toLowerCase();
        return (
          s.includes('заторфован') ||
          s.includes('органо-минеральн') ||
          s.includes('торф')
        );
      })
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Т',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для заторфованных грунтов и торфов обязательно включить:\n' +
        '- Определение степени разложения торфа R (%)\n' +
        '- Определение зольности Ad (%)\n' +
        '- Определение естественной влажности W (часто > 200%)\n' +
        '- Ботанический состав торфа (вид растений)\n' +
        '- Компрессионные испытания с длительной консолидацией (до 30 суток)\n' +
        '- Исследования усадки при высыхании\n' +
        '- Исследования ползучести под нагрузкой',
      recommendedValues: {
        parameters: {
          value: ['R', 'Ad', 'W', 'ботаника', 'компрессия'],
          unit: 'виды',
          explanation: 'Обязательные определения'
        },
        consolidationTime: {
          value: 30,
          unit: 'суток',
          explanation: 'Длительность консолидации'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'peat-basic-tests',
        name: 'Основные характеристики торфов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Т',
        description: 'Степень разложения R, зольность Ad, влажность W, ботанический состав',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['торфы', 'основные']
      },
      {
        workId: 'peat-compression-tests',
        name: 'Компрессионные испытания торфов с длительной консолидацией',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Т',
        description: 'Длительность до 30 суток, определение модуля деформации',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['торфы', 'компрессия']
      },
      {
        workId: 'peat-creep-tests',
        name: 'Исследования усадки и ползучести торфов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Т',
        description: 'Усадка при высыхании, ползучесть под нагрузкой',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['торфы', 'ползучесть']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 12.5: МЕРЗЛЫЕ ГРУНТЫ
// ============================================================================

/**
 * Блок 12.5: Исследования мерзлых и вечномерзлых грунтов
 */
export const block_12_05_frozen_soils: InstructionBlock = {
  id: 'block-12-05-frozen-soils-investigation',
  section: 'Раздел 12: Специфические грунты',
  title: 'Исследования мерзлых и вечномерзлых грунтов',
  description: 'Криогенные характеристики и теплотехнические расчеты',
  priority: 124,
  tags: ['специфические-грунты', 'мерзлые', 'вечномерзлые'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.specialSoils &&
      input.specialSoils.some(soil => 
        soil.toLowerCase().includes('мерзл') || 
        soil.toLowerCase().includes('вечномерзл')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'раздел 9.4',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для мерзлых и вечномерзлых грунтов обязательно включить:\n' +
        '**Температурный режим:**\n' +
        '- Определение температуры грунтов (круглогодичные наблюдения)\n' +
        '- Глубина сезонного промерзания/протаивания\n' +
        '**Криогенные характеристики:**\n' +
        '- Льдистость (суммарная влажность за счет льда)\n' +
        '- Криогенное строение (текстура льда)\n' +
        '- Засоленность мерзлых грунтов\n' +
        '**Деформационные свойства:**\n' +
        '- Сжимаемость при оттаивании\n' +
        '- Теплофизические свойства\n' +
        '**Прогнозы:**\n' +
        '- Теплотехнические расчеты\n' +
        '- Прогноз изменения температурного режима',
      recommendedValues: {
        parameters: {
          value: ['температура', 'льдистость', 'сжимаемость', 'теплофизика'],
          unit: 'виды',
          explanation: 'Обязательные определения'
        }
      }
    },
    {
      id: 'variant-hydro-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 1.1',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов в условиях мерзлоты дополнительно:\n' +
        '- Многолетние температурные наблюдения\n' +
        '- Прогноз развития криогенных процессов (термокарст, пучение)\n' +
        '- Влияние водохранилища на мерзлотную обстановку',
      note: 'Применяется для ГЭС в криолитозоне'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const works: WorkItem[] = [
      {
        workId: 'frozen-temperature',
        name: 'Температурные наблюдения в мерзлых грунтах',
        category: 'mandatory',
        module: 'geological',
        quantity: 12,
        unit: 'месяцев',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.4',
        description: 'Круглогодичные наблюдения температуры грунтов',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мерзлые', 'температура']
      },
      {
        workId: 'frozen-cryogenic',
        name: 'Определение криогенных характеристик',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.4',
        description: 'Льдистость, криогенное строение, засоленность',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мерзлые', 'криогенные']
      },
      {
        workId: 'frozen-deformation',
        name: 'Испытания на сжимаемость при оттаивании',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.4',
        description: 'Определение осадок при оттаивании мерзлых грунтов',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мерзлые', 'деформации']
      },
      {
        workId: 'frozen-thermal',
        name: 'Теплотехнические расчеты и прогнозы',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'расчет',
        normativeBase: 'СП РК 1.02-102-2014, раздел 9.4',
        description: 'Прогноз изменения температурного режима и мерзлотной обстановки',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мерзлые', 'прогноз']
      }
    ];
    
    // Дополнительно для гидроэнергетики
    if (selectedVariant.id === 'variant-hydro-vsn') {
      works.push({
        workId: 'frozen-reservoir-impact',
        name: 'Прогноз влияния водохранилища на мерзлоту',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'прогноз',
        normativeBase: 'ВСН 34.2-88, п. 1.1',
        description: 'Влияние водохранилища на температуру и глубину протаивания',
        priority: 'СПРАВОЧНЫЙ',
        tags: ['мерзлые', 'водохранилище']
      });
    }
    
    return works;
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 12 (файл section09)
// ============================================================================

export const section09Blocks: InstructionBlock[] = [
  block_12_01_collapsible_soils,   // Просадочные
  block_12_02_swelling_soils,      // Набухающие
  block_12_03_saline_soils,        // Засоленные
  block_12_04_peat_soils,          // Заторфованные
  block_12_05_frozen_soils         // Мерзлые
];

export default section09Blocks;
