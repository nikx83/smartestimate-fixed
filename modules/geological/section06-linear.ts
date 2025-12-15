/**
 * Файл: /modules/geological/section06-linear.ts
 * Назначение: Блоки инструкции для определения объёмов буровых работ на ЛИНЕЙНЫХ объектах
 * 
 * Описание:
 * Реализация требований к изысканиям линейных сооружений - автодороги, туннели,
 * трубопроводы, каналы, плотины, ГЭС согласно СП РК 1.02-102-2014, СТ РК 1399-2005, ВСН 34.2-88
 * 
 * Содержит 10 блоков:
 * - 6.1: Автомобильные дороги (3 блока по категориям)
 * - 6.2: Туннели (1 блок с 3 вариантами)
 * - 6.3: Гидроэнергетические объекты (3 блока)
 * - 6.4: Трубопроводы и каналы (3 блока)
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 6.1: АВТОМОБИЛЬНЫЕ ДОРОГИ
// ============================================================================

/**
 * Блок 6.1.1: Автодороги категория сложности I
 */
export const block_06_01_roads_cat1: InstructionBlock = {
  id: 'block-06-01-roads-category-i',
  section: 'Раздел 6: Линейные объекты',
  title: 'Автомобильные дороги категория сложности I',
  description: 'Расстояние между выработками для простых условий',
  priority: 60,
  tags: ['линейные', 'автодороги', 'категория-I'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      input.linearType === 'автодорога' &&
      input.complexityCategory === 'I'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками не более 500 м (общие требования для всех линейных объектов)',
      recommendedValues: {
        spacing: {
          value: 500,
          max: 500,
          unit: 'м',
          explanation: 'Максимальное расстояние между скважинами'
        }
      }
    },
    {
      id: 'variant-specialized-st-rk-1399',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'Приложение Е',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками: 1000-500 м в зависимости от стадии проектирования (специализированные требования для автодорог)',
      recommendedValues: {
        spacingTEO: {
          value: 1000,
          unit: 'м',
          explanation: 'На стадии ТЭО'
        },
        spacingProject: {
          value: 500,
          unit: 'м',
          explanation: 'На стадии Проект'
        }
      },
      note: 'Для автомобильных дорог рекомендуется применять СТ РК 1399-2005 как специализированный документ'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const length = input.linearLength || 10; // км
    let spacing: number;
    
    if (selectedVariant.id === 'variant-specialized-st-rk-1399') {
      // Определить по стадии
      spacing = input.stage === 'ТЭО' ? 1000 : 500;
    } else {
      spacing = 500;
    }
    
    const wellsCount = Math.ceil((length * 1000) / spacing);
    
    return [
      {
        workId: 'linear-roads-cat1-wells',
        name: 'Буровые скважины вдоль трассы автодороги (категория I)',
        category: 'mandatory',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скважин',
        normativeBase: selectedVariant.normative.document,
        description: `${wellsCount} скважин с шагом ${spacing} м на ${length} км трассы`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['линейные', 'автодороги', 'категория-I'],
        notes: [
          `Длина трассы: ${length} км`,
          `Шаг между скважинами: ${spacing} м`
        ]
      }
    ];
  }
};

/**
 * Блок 6.1.2: Автодороги категория сложности II
 */
export const block_06_02_roads_cat2: InstructionBlock = {
  id: 'block-06-02-roads-category-ii',
  section: 'Раздел 6: Линейные объекты',
  title: 'Автомобильные дороги категория сложности II',
  description: 'Расстояние между выработками для средних условий',
  priority: 61,
  tags: ['линейные', 'автодороги', 'категория-II'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      input.linearType === 'автодорога' &&
      input.complexityCategory === 'II'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками не более 250 м',
      recommendedValues: {
        spacing: {
          value: 250,
          max: 250,
          unit: 'м',
          explanation: 'Максимальное расстояние'
        }
      }
    },
    {
      id: 'variant-specialized-st-rk-1399',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'Приложение Е',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками: 500-250 м в зависимости от стадии',
      recommendedValues: {
        spacingTEO: {
          value: 500,
          unit: 'м',
          explanation: 'На стадии ТЭО'
        },
        spacingProject: {
          value: 250,
          unit: 'м',
          explanation: 'На стадии Проект'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const length = input.linearLength || 10;
    let spacing: number;
    
    if (selectedVariant.id === 'variant-specialized-st-rk-1399') {
      spacing = input.stage === 'ТЭО' ? 500 : 250;
    } else {
      spacing = 250;
    }
    
    const wellsCount = Math.ceil((length * 1000) / spacing);
    
    return [
      {
        workId: 'linear-roads-cat2-wells',
        name: 'Буровые скважины вдоль трассы автодороги (категория II)',
        category: 'mandatory',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скважин',
        normativeBase: selectedVariant.normative.document,
        description: `${wellsCount} скважин с шагом ${spacing} м`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['линейные', 'автодороги', 'категория-II']
      }
    ];
  }
};

/**
 * Блок 6.1.3: Автодороги категория сложности III
 */
export const block_06_03_roads_cat3: InstructionBlock = {
  id: 'block-06-03-roads-category-iii',
  section: 'Раздел 6: Линейные объекты',
  title: 'Автомобильные дороги категория сложности III',
  description: 'Расстояние между выработками для сложных условий',
  priority: 62,
  tags: ['линейные', 'автодороги', 'категория-III'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      input.linearType === 'автодорога' &&
      input.complexityCategory === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками не более 150 м',
      recommendedValues: {
        spacing: {
          value: 150,
          max: 150,
          unit: 'м',
          explanation: 'Максимальное расстояние'
        }
      }
    },
    {
      id: 'variant-specialized-st-rk-1399',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'Приложение Е',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Расстояние между выработками: 250-100 м в зависимости от стадии',
      recommendedValues: {
        spacingTEO: {
          value: 250,
          unit: 'м',
          explanation: 'На стадии ТЭО'
        },
        spacingProject: {
          value: 100,
          unit: 'м',
          explanation: 'На стадии Проект'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const length = input.linearLength || 10;
    let spacing: number;
    
    if (selectedVariant.id === 'variant-specialized-st-rk-1399') {
      spacing = input.stage === 'ТЭО' ? 250 : 100;
    } else {
      spacing = 150;
    }
    
    const wellsCount = Math.ceil((length * 1000) / spacing);
    
    return [
      {
        workId: 'linear-roads-cat3-wells',
        name: 'Буровые скважины вдоль трассы автодороги (категория III)',
        category: 'mandatory',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скважин',
        normativeBase: selectedVariant.normative.document,
        description: `${wellsCount} скважин с шагом ${spacing} м`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['линейные', 'автодороги', 'категория-III']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 6.2: ТУННЕЛИ И ПОДЗЕМНЫЕ СООРУЖЕНИЯ
// ============================================================================

/**
 * Блок 6.2.1: Туннели (3 варианта: общий, автодорожный, гидротехнический)
 */
export const block_06_04_tunnels: InstructionBlock = {
  id: 'block-06-04-tunnels-investigation',
  section: 'Раздел 6: Линейные объекты',
  title: 'Изыскания для туннелей',
  description: 'Требования к объёмам работ в зависимости от типа туннеля',
  priority: 63,
  tags: ['линейные', 'туннели', 'подземные'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      input.linearType === 'туннель'
    );
  },
  
  variants: [
    {
      id: 'variant-general-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.8',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Шахты и штольни при обосновании в программе изысканий для особо ответственных объектов',
      note: 'Общие требования для всех типов туннелей'
    },
    {
      id: 'variant-road-tunnels-st-rk',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'Приложение Е',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для автодорожных туннелей применить требования для автодорожной инфраструктуры с учетом подземного расположения (увеличенная детальность)',
      note: 'Используется если туннель является частью автомобильной дороги'
    },
    {
      id: 'variant-hydro-tunnels-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 4.10',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидротехнических туннелей:\n' +
        '- Расстояние между выработками по трассе: 200-1000 м\n' +
        '- На портальных участках: 20-50 м\n' +
        '- Глубина скважин: на 10-15 м ниже отметки заложения, но не глубже 300 м\n' +
        '- В местах шахт и подземных залов: 1-3 скважины на 15-20 м ниже подошвы',
      recommendedValues: {
        spacingMain: {
          value: 500,
          min: 200,
          max: 1000,
          unit: 'м',
          explanation: 'По основной трассе'
        },
        spacingPortal: {
          value: 35,
          min: 20,
          max: 50,
          unit: 'м',
          explanation: 'На порталах'
        },
        depthBelow: {
          value: 12,
          min: 10,
          max: 15,
          unit: 'м',
          explanation: 'Ниже отметки заложения'
        }
      },
      note: 'Применяется для туннелей гидроэнергетических объектов'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const length = input.linearLength || 5; // км
    const works: WorkItem[] = [];
    
    if (selectedVariant.id === 'variant-hydro-tunnels-vsn') {
      // Гидротехнический туннель
      const mainWells = Math.ceil((length * 1000) / 500);
      const portalWells = 10; // По 5 на каждый портал
      
      works.push(
        {
          workId: 'tunnel-main-wells',
          name: 'Скважины по трассе туннеля',
          category: 'mandatory',
          module: 'geological',
          quantity: mainWells,
          unit: 'скважин',
          normativeBase: 'ВСН 34.2-88, п. 4.10',
          description: `${mainWells} скважин с шагом 500 м`,
          priority: 'СПРАВОЧНЫЙ',
          tags: ['туннель', 'гидротехнический']
        },
        {
          workId: 'tunnel-portal-wells',
          name: 'Скважины на портальных участках',
          category: 'mandatory',
          module: 'geological',
          quantity: portalWells,
          unit: 'скважин',
          normativeBase: 'ВСН 34.2-88, п. 4.10',
          description: 'Детальная разведка порталов с шагом 20-50 м',
          priority: 'СПРАВОЧНЫЙ',
          tags: ['туннель', 'портал']
        }
      );
    } else {
      // Общий случай или автодорожный
      works.push({
        workId: 'tunnel-general-requirement',
        name: 'Требования к изысканиям для туннеля',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'требование',
        normativeBase: selectedVariant.normative.document,
        description: selectedVariant.recommendation,
        priority: selectedVariant.priority,
        tags: ['туннель']
      });
    }
    
    return works;
  }
};

// ============================================================================
// РАЗДЕЛ 6.3: ГИДРОЭНЕРГЕТИЧЕСКИЕ ОБЪЕКТЫ
// ============================================================================

/**
 * Блок 6.3.1: Плотины стадия ТЭО
 */
export const block_06_05_dam_teo: InstructionBlock = {
  id: 'block-06-05-dam-teo-stage',
  section: 'Раздел 6: Линейные объекты',
  title: 'Плотины стадия ТЭО',
  description: 'Объёмы изысканий на предпроектной стадии',
  priority: 64,
  tags: ['линейные', 'гидроэнергетика', 'плотины', 'ТЭО'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'гидроэнергетический' &&
      input.stage === 'ТЭО'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 3.16',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для стадии ТЭО плотины:\n' +
        '- По оси плотины: выработки через 25-50 м\n' +
        '- По примыканиям: выработки через 50-100 м\n' +
        '- Глубина: на 1.5H ниже подошвы плотины (H - высота плотины)',
      recommendedValues: {
        spacingAxis: {
          value: 37,
          min: 25,
          max: 50,
          unit: 'м',
          explanation: 'По оси плотины'
        },
        spacingAbutment: {
          value: 75,
          min: 50,
          max: 100,
          unit: 'м',
          explanation: 'По примыканиям'
        },
        depthCoefficient: {
          value: 1.5,
          unit: 'H',
          explanation: 'Коэффициент к высоте плотины'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const damLength = input.linearLength || 0.5; // км
    const damHeight = input.buildingHeight || 50; // м
    
    const axisWells = Math.ceil((damLength * 1000) / 37);
    const depth = Math.ceil(damHeight * 1.5);
    
    return [
      {
        workId: 'dam-teo-axis-wells',
        name: 'Скважины по оси плотины (ТЭО)',
        category: 'recommended',
        module: 'geological',
        quantity: axisWells,
        unit: 'скважин',
        normativeBase: 'ВСН 34.2-88, п. 3.16',
        description: `${axisWells} скважин с шагом 25-50 м, глубиной ${depth} м`,
        priority: 'СПРАВОЧНЫЙ',
        tags: ['плотина', 'ТЭО'],
        notes: [
          `Высота плотины: ${damHeight} м`,
          `Глубина бурения: 1.5H = ${depth} м`
        ]
      }
    ];
  }
};

/**
 * Блок 6.3.2: Плотины стадия Проект
 */
export const block_06_06_dam_project: InstructionBlock = {
  id: 'block-06-06-dam-project-stage',
  section: 'Раздел 6: Линейные объекты',
  title: 'Плотины стадия Проект',
  description: 'Детальные изыскания для проектирования',
  priority: 65,
  tags: ['линейные', 'гидроэнергетика', 'плотины', 'проект'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'гидроэнергетический' &&
      input.stage === 'Проект'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 4.5',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для стадии Проект:\n' +
        '- По оси плотины: выработки через 15-25 м\n' +
        '- Поперечники через 50-100 м\n' +
        '- Глубина разведки: на 2H ниже подошвы плотины',
      recommendedValues: {
        spacingAxis: {
          value: 20,
          min: 15,
          max: 25,
          unit: 'м',
          explanation: 'По оси'
        },
        spacingCross: {
          value: 75,
          min: 50,
          max: 100,
          unit: 'м',
          explanation: 'Поперечники'
        },
        depthCoefficient: {
          value: 2,
          unit: 'H',
          explanation: 'Удвоенная высота'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const damLength = input.linearLength || 0.5;
    const damHeight = input.buildingHeight || 50;
    
    const axisWells = Math.ceil((damLength * 1000) / 20);
    const depth = damHeight * 2;
    
    return [
      {
        workId: 'dam-project-axis-wells',
        name: 'Скважины по оси плотины (Проект)',
        category: 'recommended',
        module: 'geological',
        quantity: axisWells,
        unit: 'скважин',
        normativeBase: 'ВСН 34.2-88, п. 4.5',
        description: `${axisWells} скважин с шагом 15-25 м, глубиной ${depth} м`,
        priority: 'СПРАВОЧНЫЙ',
        tags: ['плотина', 'проект'],
        notes: [`Глубина: 2H = ${depth} м`]
      }
    ];
  }
};

/**
 * Блок 6.3.3: ГЭС и машинные залы
 */
export const block_06_07_powerhouse: InstructionBlock = {
  id: 'block-06-07-powerhouse-halls',
  section: 'Раздел 6: Линейные объекты',
  title: 'ГЭС и машинные залы',
  description: 'Требования к изысканиям под гидроагрегаты',
  priority: 66,
  tags: ['линейные', 'гидроэнергетика', 'ГЭС'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'гидроэнергетический' &&
      (input.linearType === 'ГЭС' || input.linearType === 'машинный зал')
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 3.17',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для ГЭС и машинных залов:\n' +
        '- Выработки под каждым агрегатом\n' +
        '- Глубина скважин: на 15-20 м ниже подошвы фундамента\n' +
        '- Для подземных залов: штольни и шахты большого диаметра',
      recommendedValues: {
        wellsPerUnit: {
          value: 1,
          min: 1,
          unit: 'скважин/агрегат',
          explanation: 'Под каждым агрегатом'
        },
        depthBelow: {
          value: 17,
          min: 15,
          max: 20,
          unit: 'м',
          explanation: 'Ниже подошвы'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const units = 4; // Примерное количество агрегатов
    
    return [
      {
        workId: 'powerhouse-wells',
        name: 'Скважины под гидроагрегаты ГЭС',
        category: 'recommended',
        module: 'geological',
        quantity: units,
        unit: 'скважин',
        normativeBase: 'ВСН 34.2-88, п. 3.17',
        description: `${units} скважин (по одной под каждым агрегатом), глубина 15-20 м ниже подошвы`,
        priority: 'СПРАВОЧНЫЙ',
        tags: ['ГЭС', 'агрегаты']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 6.4: ТРУБОПРОВОДЫ И КАНАЛЫ (дополнительные блоки)
// ============================================================================

/**
 * Блок 6.4.1: Трубопроводы общие требования
 */
export const block_06_08_pipelines: InstructionBlock = {
  id: 'block-06-08-pipelines-general',
  section: 'Раздел 6: Линейные объекты',
  title: 'Трубопроводы - общие требования',
  description: 'Расстояние между выработками для трубопроводов',
  priority: 67,
  tags: ['линейные', 'трубопроводы'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      input.linearType === 'трубопровод'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для трубопроводов применяются те же требования, что и для линейных объектов:\n' +
        '- Категория I: не более 500 м\n' +
        '- Категория II: не более 250 м\n' +
        '- Категория III: не более 150 м',
      recommendedValues: {
        spacingCat1: {
          value: 500,
          unit: 'м',
          explanation: 'Категория I'
        },
        spacingCat2: {
          value: 250,
          unit: 'м',
          explanation: 'Категория II'
        },
        spacingCat3: {
          value: 150,
          unit: 'м',
          explanation: 'Категория III'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const length = input.linearLength || 10;
    let spacing = 250; // По умолчанию категория II
    
    if (input.complexityCategory === 'I') spacing = 500;
    if (input.complexityCategory === 'III') spacing = 150;
    
    const wellsCount = Math.ceil((length * 1000) / spacing);
    
    return [
      {
        workId: 'pipeline-wells',
        name: 'Скважины вдоль трассы трубопровода',
        category: 'mandatory',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скважин',
        normativeBase: 'СП РК 1.02-102-2014, п. 7.5',
        description: `${wellsCount} скважин с шагом ${spacing} м`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['трубопровод']
      }
    ];
  }
};

/**
 * Блок 6.4.2: Каналы и водоводы
 */
export const block_06_09_canals: InstructionBlock = {
  id: 'block-06-09-canals-waterways',
  section: 'Раздел 6: Линейные объекты',
  title: 'Каналы и водоводы',
  description: 'Требования для открытых водопроводящих сооружений',
  priority: 68,
  tags: ['линейные', 'каналы', 'гидротехника'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      (input.linearType === 'канал' || input.linearType === 'водовод')
    );
  },
  
  variants: [
    {
      id: 'variant-general-sp-rk',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для каналов применяются требования линейных объектов с учетом фильтрационных свойств грунтов',
      recommendedValues: {
        spacing: {
          value: 250,
          unit: 'м',
          explanation: 'Среднее значение'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const length = input.linearLength || 10;
    const spacing = 250;
    const wellsCount = Math.ceil((length * 1000) / spacing);
    
    return [
      {
        workId: 'canal-wells',
        name: 'Скважины вдоль трассы канала',
        category: 'mandatory',
        module: 'geological',
        quantity: wellsCount,
        unit: 'скважин',
        normativeBase: 'СП РК 1.02-102-2014, п. 7.5',
        description: `${wellsCount} скважин с шагом ${spacing} м, с учетом фильтрации`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['канал', 'гидротехника']
      }
    ];
  }
};

/**
 * Блок 6.4.3: Переходы через препятствия
 */
export const block_06_10_crossings: InstructionBlock = {
  id: 'block-06-10-obstacle-crossings',
  section: 'Раздел 6: Линейные объекты',
  title: 'Переходы через препятствия',
  description: 'Дополнительные изыскания на переходах',
  priority: 69,
  tags: ['линейные', 'переходы'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.objectType === 'линейный' &&
      (input.hazards && input.hazards.some(h => 
        h.toLowerCase().includes('река') || 
        h.toLowerCase().includes('овраг') ||
        h.toLowerCase().includes('переход')
      ))
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 7.6',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'На переходах через препятствия (реки, овраги, дороги) выполнять дополнительные выработки:\n' +
        '- Минимум 3 выработки на каждый переход\n' +
        '- Поперечники через основное русло\n' +
        '- Детальная разведка опор мостов',
      recommendedValues: {
        wellsPerCrossing: {
          value: 3,
          min: 3,
          unit: 'скважин',
          explanation: 'На каждый переход'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const crossingsCount = 2; // Примерно
    const wellsPerCrossing = 3;
    
    return [
      {
        workId: 'crossing-wells',
        name: 'Дополнительные скважины на переходах через препятствия',
        category: 'mandatory',
        module: 'geological',
        quantity: crossingsCount * wellsPerCrossing,
        unit: 'скважин',
        normativeBase: 'СП РК 1.02-102-2014, п. 7.6',
        description: `${crossingsCount} перехода × ${wellsPerCrossing} скважины = ${crossingsCount * wellsPerCrossing} скважин`,
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['переходы', 'мосты']
      }
    ];
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 6
// ============================================================================

export const section06Blocks: InstructionBlock[] = [
  // Автомобильные дороги
  block_06_01_roads_cat1,
  block_06_02_roads_cat2,
  block_06_03_roads_cat3,
  
  // Туннели
  block_06_04_tunnels,
  
  // Гидроэнергетические объекты
  block_06_05_dam_teo,
  block_06_06_dam_project,
  block_06_07_powerhouse,
  
  // Трубопроводы и каналы
  block_06_08_pipelines,
  block_06_09_canals,
  block_06_10_crossings
];

export default section06Blocks;
