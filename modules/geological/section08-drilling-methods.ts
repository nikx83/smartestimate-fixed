/**
 * Файл: /modules/geological/section08-drilling-methods.ts
 * Назначение: Блоки инструкции для выбора способов бурения и типов горных выработок
 * 
 * Описание:
 * Реализация требований к выбору технологии бурения в зависимости от типа грунтов,
 * а также определение типов горных выработок согласно СП РК 1.02-102-2014, Приложения В и Б
 * 
 * Содержит 10 блоков:
 * - 8.1: Способы бурения (5 блоков)
 * - 8.2: Типы горных выработок (5 блоков)
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 8.1: СПОСОБЫ БУРЕНИЯ
// ============================================================================

/**
 * Блок 8.1.1: Колонковое бурение с промывкой водой
 */
export const block_08_01_drilling_water: InstructionBlock = {
  id: 'block-08-01-drilling-water-flush',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Колонковое бурение с промывкой водой',
  description: 'Для скальных невыветрелых и слабовыветрелых грунтов',
  priority: 80,
  tags: ['бурение', 'колонковое', 'скальные'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.soilTypes &&
      input.soilTypes.some(soil => 
        soil.toLowerCase().includes('скальн') &&
        (soil.toLowerCase().includes('невыветр') || soil.toLowerCase().includes('слабовыветр'))
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение В, Таблица В.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Колонковое бурение с промывкой водой для скальных невыветрелых и слабовыветрелых трещиноватых грунтов, диаметр коронки 34-146 мм',
      recommendedValues: {
        method: {
          value: 'Колонковое с промывкой водой',
          unit: 'способ',
          explanation: 'Основной метод для скальных пород'
        },
        diameter: {
          value: 89,
          min: 34,
          max: 146,
          unit: 'мм',
          explanation: 'Диаметр коронки'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'drilling-method-water',
        name: 'Колонковое бурение с промывкой водой',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'метод',
        normativeBase: 'СП РК 1.02-102-2014, Приложение В',
        description: 'Для скальных грунтов, диаметр 89 мм (стандарт)',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['бурение', 'колонковое', 'вода']
      }
    ];
  }
};

/**
 * Блок 8.1.2: Колонковое бурение с промывкой глинистым раствором
 */
export const block_08_02_drilling_mud: InstructionBlock = {
  id: 'block-08-02-drilling-mud-flush',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Колонковое бурение с промывкой глинистым раствором',
  description: 'Для выветрелых скальных, обломочных, песчаных и глинистых грунтов',
  priority: 81,
  tags: ['бурение', 'колонковое', 'глинистый-раствор'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.soilTypes &&
      input.soilTypes.some(soil => {
        const s = soil.toLowerCase();
        return (
          (s.includes('скальн') && s.includes('выветр')) ||
          s.includes('крупнообломочн') ||
          s.includes('песч') ||
          s.includes('глинист')
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
        section: 'Приложение В, Таблица В.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Колонковое бурение с промывкой глинистым раствором для:\n' +
        '- Скальных выветрелых грунтов\n' +
        '- Крупнообломочных грунтов\n' +
        '- Песчаных грунтов\n' +
        '- Глинистых грунтов\n' +
        'Диаметр коронки 73-146 мм',
      recommendedValues: {
        method: {
          value: 'Колонковое с глинистым раствором',
          unit: 'способ',
          explanation: 'Универсальный метод'
        },
        diameter: {
          value: 108,
          min: 73,
          max: 146,
          unit: 'мм',
          explanation: 'Диаметр коронки'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'drilling-method-mud',
        name: 'Колонковое бурение с промывкой глинистым раствором',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'метод',
        normativeBase: 'СП РК 1.02-102-2014, Приложение В',
        description: 'Для обломочных, песчаных и глинистых грунтов, диаметр 108 мм',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['бурение', 'колонковое', 'глинистый-раствор']
      }
    ];
  }
};

/**
 * Блок 8.1.3: Колонковое бурение всухую
 */
export const block_08_03_drilling_dry: InstructionBlock = {
  id: 'block-08-03-drilling-dry-method',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Колонковое бурение всухую',
  description: 'Для необводненных и мерзлых грунтов',
  priority: 82,
  tags: ['бурение', 'колонковое', 'всухую'],
  
  condition: (input: GeologicalInput) => {
    return (
      (input.soilTypes &&
        input.soilTypes.some(soil => {
          const s = soil.toLowerCase();
          return (
            (s.includes('выветр') && s.includes('скальн')) ||
            (s.includes('песч') && s.includes('необводн')) ||
            (s.includes('глинист') && s.includes('необводн'))
          );
        })
      ) ||
      (input.specialSoils && input.specialSoils.some(s => s.toLowerCase().includes('мерзл')))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение В, Таблица В.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Колонковое бурение всухую для:\n' +
        '- Скальных выветрелых грунтов\n' +
        '- Песчаных необводненных грунтов\n' +
        '- Глинистых необводненных грунтов\n' +
        '- Мерзлых грунтов\n' +
        'Диаметр коронки 89-219 мм',
      recommendedValues: {
        method: {
          value: 'Колонковое всухую',
          unit: 'способ',
          explanation: 'Для необводненных и мерзлых грунтов'
        },
        diameter: {
          value: 146,
          min: 89,
          max: 219,
          unit: 'мм',
          explanation: 'Увеличенный диаметр'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'drilling-method-dry',
        name: 'Колонковое бурение всухую',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'метод',
        normativeBase: 'СП РК 1.02-102-2014, Приложение В',
        description: 'Для необводненных и мерзлых грунтов, диаметр 146 мм',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['бурение', 'колонковое', 'всухую', 'мерзлые']
      }
    ];
  }
};

/**
 * Блок 8.1.4: Ударно-канатное бурение
 */
export const block_08_04_drilling_percussion: InstructionBlock = {
  id: 'block-08-04-drilling-percussion-cable',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Ударно-канатное бурение',
  description: 'Для обводненных крупнообломочных и песчаных грунтов',
  priority: 83,
  tags: ['бурение', 'ударно-канатное', 'обводненные'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.soilTypes &&
      input.soilTypes.some(soil => {
        const s = soil.toLowerCase();
        return (
          s.includes('крупнообломочн') ||
          (s.includes('песч') && s.includes('обводн')) ||
          (s.includes('глинист') && s.includes('плотн'))
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
        section: 'Приложение В, Таблица В.1',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Ударно-канатное бурение с применением долот и желонок для:\n' +
        '- Крупнообломочных грунтов\n' +
        '- Песчаных обводненных грунтов\n' +
        '- Глинистых плотных грунтов\n' +
        'Диаметр 108-325 мм',
      recommendedValues: {
        method: {
          value: 'Ударно-канатное',
          unit: 'способ',
          explanation: 'Для обводненных грунтов'
        },
        diameter: {
          value: 219,
          min: 108,
          max: 325,
          unit: 'мм',
          explanation: 'Большой диаметр'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'drilling-method-percussion',
        name: 'Ударно-канатное бурение',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'метод',
        normativeBase: 'СП РК 1.02-102-2014, Приложение В',
        description: 'Для обводненных крупнообломочных и песчаных грунтов, диаметр 219 мм',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['бурение', 'ударно-канатное', 'обводненные']
      }
    ];
  }
};

/**
 * Блок 8.1.5: Шнековое бурение с обоснованием
 */
export const block_08_05_drilling_auger: InstructionBlock = {
  id: 'block-08-05-drilling-auger-method',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Шнековое бурение с обоснованием',
  description: 'Для песчаных и глинистых грунтов при обосновании точности',
  priority: 84,
  tags: ['бурение', 'шнековое', 'обоснование'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.soilTypes &&
      input.soilTypes.some(soil => {
        const s = soil.toLowerCase();
        return s.includes('песч') || s.includes('глинист');
      })
    );
  },
  
  variants: [
    {
      id: 'variant-acceptable-sp-rk-102',
      priority: 'ДОПУСТИМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.8',
        priority: 'ДОПУСТИМЫЙ'
      },
      recommendation: 'Шнековое бурение (рейсовое или поточное) для песчаных и глинистых грунтов, диаметр 108-273 мм.\n' +
        '⚠️ ВАЖНО: Обосновать в программе изысканий точность фиксации контактов слоев (обычно 0,50-0,75 м)\n' +
        'Применяется при простых геологических условиях и не требовании отбора монолитов',
      recommendedValues: {
        method: {
          value: 'Шнековое',
          unit: 'способ',
          explanation: 'Требует обоснования'
        },
        diameter: {
          value: 146,
          min: 108,
          max: 273,
          unit: 'мм',
          explanation: 'Диаметр шнека'
        },
        accuracy: {
          value: 0.6,
          min: 0.5,
          max: 0.75,
          unit: 'м',
          explanation: 'Точность определения контактов'
        }
      },
      warnings: [
        'Требуется обоснование в программе изысканий',
        'Не подходит для отбора монолитов ненарушенного сложения',
        'Точность определения границ слоёв ниже, чем при колонковом бурении'
      ]
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'drilling-method-auger',
        name: 'Шнековое бурение с обоснованием точности',
        category: 'optional',
        module: 'geological',
        quantity: 1,
        unit: 'метод',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.8',
        description: 'Для песчаных и глинистых грунтов, требует обоснования в программе',
        priority: 'ДОПУСТИМЫЙ',
        tags: ['бурение', 'шнековое'],
        notes: [
          'Точность фиксации контактов: 0,5-0,75 м',
          'Обосновать в программе изысканий'
        ]
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 8.2: ТИПЫ ГОРНЫХ ВЫРАБОТОК
// ============================================================================

/**
 * Блок 8.2.1: Поверхностные выработки - закопушки
 */
export const block_08_06_excavation_pits: InstructionBlock = {
  id: 'block-08-06-excavation-shallow-pits',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Закопушки',
  description: 'Неглубокие выработки до 0,6 м',
  priority: 85,
  tags: ['выработки', 'закопушки', 'поверхностные'],
  
  condition: (input: GeologicalInput) => {
    // Применимо почти всегда для рекогносцировки
    return true;
  },
  
  variants: [
    {
      id: 'variant-recommended-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Б',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Закопушки глубиной до 0,6 м для изучения поверхностных отложений мощностью ≤ 0,5 м',
      recommendedValues: {
        type: {
          value: 'Закопушки',
          unit: 'тип',
          explanation: 'Самые неглубокие выработки'
        },
        maxDepth: {
          value: 0.6,
          unit: 'м',
          explanation: 'Максимальная глубина'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'excavation-pits',
        name: 'Закопушки для изучения поверхностных отложений',
        category: 'recommended',
        module: 'geological',
        quantity: 5,
        unit: 'шт',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Б',
        description: 'Глубиной до 0,6 м для рекогносцировки',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['выработки', 'закопушки']
      }
    ];
  }
};

/**
 * Блок 8.2.2: Расчистки на склонах
 */
export const block_08_07_excavation_clearings: InstructionBlock = {
  id: 'block-08-07-excavation-slope-clearings',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Расчистки на склонах',
  description: 'Выработки на склонах глубиной до 1,5 м',
  priority: 86,
  tags: ['выработки', 'расчистки', 'склоны'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.hazards &&
      input.hazards.some(h => 
        h.toLowerCase().includes('склон') || 
        h.toLowerCase().includes('оползн')
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Б',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расчистки глубиной до 1,5 м на склонах для изучения отложений мощностью ≤ 1 м',
      recommendedValues: {
        type: {
          value: 'Расчистки',
          unit: 'тип',
          explanation: 'Для склонов'
        },
        maxDepth: {
          value: 1.5,
          unit: 'м',
          explanation: 'Максимальная глубина'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'excavation-clearings',
        name: 'Расчистки на склонах',
        category: 'mandatory',
        module: 'geological',
        quantity: 3,
        unit: 'шт',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Б',
        description: 'Глубиной до 1,5 м для изучения склоновых отложений',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['выработки', 'расчистки', 'склоны']
      }
    ];
  }
};

/**
 * Блок 8.2.3: Канавы и траншеи
 */
export const block_08_08_excavation_trenches: InstructionBlock = {
  id: 'block-08-08-excavation-trenches',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Канавы и траншеи',
  description: 'Глубокие линейные выработки до 6 м',
  priority: 87,
  tags: ['выработки', 'канавы', 'траншеи'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' ||
      (input.soilTypes && input.soilTypes.some(s => s.toLowerCase().includes('крутопадающ')))
    );
  },
  
  variants: [
    {
      id: 'variant-recommended-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Б',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Для крутопадающих слоев и мощности перекрывающих отложений ≤ 2,5 м:\n' +
        '- Канавы глубиной до 3,0 м\n' +
        '- Траншеи глубиной до 6,0 м',
      recommendedValues: {
        ditchDepth: {
          value: 3.0,
          unit: 'м',
          explanation: 'Глубина канавы'
        },
        trenchDepth: {
          value: 6.0,
          unit: 'м',
          explanation: 'Глубина траншеи'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'excavation-trenches',
        name: 'Канавы и траншеи',
        category: 'recommended',
        module: 'geological',
        quantity: 2,
        unit: 'шт',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Б',
        description: 'Канавы до 3 м или траншеи до 6 м для крутопадающих слоёв',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['выработки', 'канавы', 'траншеи']
      }
    ];
  }
};

/**
 * Блок 8.2.4: Шурфы и дудки
 */
export const block_08_09_excavation_shafts: InstructionBlock = {
  id: 'block-08-09-excavation-test-shafts',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Шурфы и дудки',
  description: 'Вертикальные выработки глубиной до 20 м',
  priority: 88,
  tags: ['выработки', 'шурфы', 'дудки'],
  
  condition: (input: GeologicalInput) => {
    // Применяется часто для детального изучения
    return (
      input.geotechnicalCategory === 'II' ||
      input.geotechnicalCategory === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-recommended-sp-rk-102',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Приложение Б',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation: 'Шурфы и дудки глубиной до 20 м для горизонтального залегания грунтов:\n' +
        '- Отбор монолитов ненарушенного сложения\n' +
        '- Визуальное изучение разреза\n' +
        '- Полевые испытания грунтов',
      recommendedValues: {
        type: {
          value: 'Шурфы',
          unit: 'тип',
          explanation: 'Вертикальные выработки'
        },
        maxDepth: {
          value: 20,
          unit: 'м',
          explanation: 'Максимальная глубина'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const shaftsCount = input.geotechnicalCategory === 'III' ? 3 : 2;
    
    return [
      {
        workId: 'excavation-shafts',
        name: 'Шурфы и дудки',
        category: 'recommended',
        module: 'geological',
        quantity: shaftsCount,
        unit: 'шт',
        normativeBase: 'СП РК 1.02-102-2014, Приложение Б',
        description: `${shaftsCount} шурфа глубиной до 20 м для отбора монолитов и визуального изучения`,
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['выработки', 'шурфы']
      }
    ];
  }
};

/**
 * Блок 8.2.5: Шахты и штольни
 */
export const block_08_10_excavation_underground: InstructionBlock = {
  id: 'block-08-10-excavation-underground-works',
  section: 'Раздел 8: Способы бурения и типы выработок',
  title: 'Шахты и штольни',
  description: 'Подземные горные выработки для особо ответственных объектов',
  priority: 89,
  tags: ['выработки', 'шахты', 'штольни', 'подземные'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.responsibilityLevel === 'I' ||
      input.objectType === 'гидроэнергетический' ||
      (input.objectType === 'линейный' && input.linearType === 'туннель')
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Шахты и штольни с обоснованием в программе изысканий для:\n' +
        '- Особо ответственных объектов\n' +
        '- Сложных инженерно-геологических условий\n' +
        '- Подземных сооружений (туннели, метро)\n' +
        'Изучать: условия залегания, обводнённость, температурные особенности, геологические структуры',
      note: 'Требуется специальное обоснование в программе изысканий'
    },
    {
      id: 'variant-hydro-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 4.11',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов шахты и штольни:\n' +
        '- На участках плотин и водосбросов\n' +
        '- Для изучения трасс туннелей\n' +
        '- В местах подземных машинных залов\n' +
        '- Глубиной до 100 м и более',
      note: 'Применяется для крупных гидротехнических сооружений'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    return [
      {
        workId: 'excavation-underground',
        name: 'Шахты и штольни',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: selectedVariant.normative.document,
        description: 'Подземные горные выработки с обоснованием в программе',
        priority: selectedVariant.priority,
        tags: ['выработки', 'шахты', 'штольни', 'подземные'],
        notes: [
          'Требуется обоснование в программе изысканий',
          'Изучение обводнённости, температурного режима, геологических структур'
        ]
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 8
// ============================================================================

export const section08Blocks: InstructionBlock[] = [
  // Способы бурения
  block_08_01_drilling_water,
  block_08_02_drilling_mud,
  block_08_03_drilling_dry,
  block_08_04_drilling_percussion,
  block_08_05_drilling_auger,
  
  // Типы горных выработок
  block_08_06_excavation_pits,
  block_08_07_excavation_clearings,
  block_08_08_excavation_trenches,
  block_08_09_excavation_shafts,
  block_08_10_excavation_underground
];

export default section08Blocks;
