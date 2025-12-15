/**
 * Файл: /modules/geological/section12-construction.ts
 * Назначение: Блоки инструкции для изысканий в период строительства и эксплуатации
 * 
 * ПРИМЕЧАНИЕ: Это Раздел 15 инструкции, но файл называется section12
 * 
 * Описание:
 * Реализация требований к изысканиям при строительстве и эксплуатации объектов
 * согласно СП РК 1.02-102-2014, п. 8.5-8.6, Правила осуществления ИГИ
 * 
 * Содержит 2 подраздела:
 * - 15.1: Изыскания при строительстве (2 блока)
 * - 15.2: Изыскания при эксплуатации (3 блока)
 */

import type { InstructionBlock, GeologicalInput, InstructionVariant, WorkItem } from '../rules-engine/types';

// ============================================================================
// РАЗДЕЛ 15.1: ИЗЫСКАНИЯ ПРИ СТРОИТЕЛЬСТВЕ
// ============================================================================

/**
 * Блок 15.1.1: Геотехнический контроль при строительстве
 */
export const block_15_01_construction_control: InstructionBlock = {
  id: 'block-15-01-construction-control',
  section: 'Раздел 15: Строительство и эксплуатация',
  title: 'Геотехнический контроль при строительстве',
  description: 'Контроль соответствия фактических условий проектным',
  priority: 150,
  tags: ['строительство', 'контроль', 'авторский-надзор'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.constructionPhase === 'строительство' ||
      input.geotechnicalCategory === 'III'
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 8.5',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для объектов III геотехнической категории обязательно включить:\n' +
        '**Геологическая документация:**\n' +
        '- Ведение геологической документации котлованов, траншей, выемок\n' +
        '- Фиксация фактического строения и состояния грунтов\n' +
        '**Геотехнический контроль:**\n' +
        '- Контроль земляных работ\n' +
        '- Контроль соответствия фактических условий проектным\n' +
        '- Контроль глубины заложения фундаментов\n' +
        '- Контроль несущей способности оснований\n' +
        '**Авторский надзор:**\n' +
        '- Авторский надзор изыскательской организации\n' +
        '- Консультации по возникающим вопросам\n' +
        '- Корректировка проектных решений при необходимости',
      recommendedValues: {
        documentationFrequency: {
          value: 'постоянно',
          unit: 'режим',
          explanation: 'Документация всех вскрытых выемок'
        }
      },
      warnings: [
        'Обязательно для III геотехнической категории',
        'Без авторского надзора возможны отклонения от проекта',
        'Фиксация всех несоответствий проекту'
      ]
    },
    {
      id: 'variant-rules',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 25',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Согласно Правилам РК геотехнический контроль должен включать:\n' +
        '- Участие изыскателей в приёмке котлованов\n' +
        '- Проверку соответствия грунтов инженерно-геологическому прогнозу\n' +
        '- Оперативное решение вопросов при отклонениях от проекта',
      note: 'Дополняет требования СП РК'
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'construction-documentation',
        name: 'Геологическая документация котлованов и выемок',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'период стройки',
        normativeBase: 'СП РК 1.02-102-2014, п. 8.5',
        description: 'Фиксация фактического строения грунтов во вскрытых выемках',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['строительство', 'документация']
      },
      {
        workId: 'construction-control',
        name: 'Геотехнический контроль земляных работ',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'период стройки',
        normativeBase: 'СП РК 1.02-102-2014, п. 8.5',
        description: 'Контроль соответствия фактических условий проектным',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['строительство', 'контроль']
      },
      {
        workId: 'construction-supervision',
        name: 'Авторский надзор изыскательской организации',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'период стройки',
        normativeBase: 'СП РК 1.02-102-2014, п. 8.5; Правила, п. 25',
        description: 'Консультации и оперативное решение вопросов',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['строительство', 'авторский-надзор']
      }
    ];
  }
};

/**
 * Блок 15.1.2: Документация строительных выемок
 */
export const block_15_02_excavation_documentation: InstructionBlock = {
  id: 'block-15-02-excavation-documentation',
  section: 'Раздел 15: Строительство и эксплуатация',
  title: 'Документация строительных выемок',
  description: 'Детальное изучение вскрытых котлованов и траншей',
  priority: 151,
  tags: ['строительство', 'документация', 'котлованы'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.constructionPhase === 'строительство' &&
      input.excavationDocumentation === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-rules',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 27',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'При вскрытии котлованов, траншей, тоннелей обязательно документировать:\n' +
        '**Характер напластования:**\n' +
        '- Слоистость, линзы, прослои\n' +
        '- Выдержанность слоёв\n' +
        '- Контакты между слоями\n' +
        '**Состав грунтов:**\n' +
        '- Уточнение литологии по натурным наблюдениям\n' +
        '- Отбор образцов при выявлении новых разностей\n' +
        '**Высачивания подземных вод:**\n' +
        '- Зоны высачивания\n' +
        '- Обводнённые слои\n' +
        '- Напорность вод\n' +
        '**Состояние и свойства грунтов:**\n' +
        '- Трещиноватость\n' +
        '- Прочность\n' +
        '- Деформированность',
      recommendedValues: {
        documentation: {
          value: ['напластование', 'состав', 'воды', 'состояние'],
          unit: 'аспекты',
          explanation: 'Обязательные аспекты документации'
        }
      }
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'excavation-field-documentation',
        name: 'Полевая документация котлованов и траншей',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'объект',
        normativeBase: 'Правила ИГИ, п. 27',
        description: 'Напластование, состав, высачивания вод, состояние грунтов',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['документация', 'котлованы']
      },
      {
        workId: 'excavation-sampling',
        name: 'Отбор дополнительных образцов из выемок',
        category: 'recommended',
        module: 'geological',
        quantity: 5,
        unit: 'образцов',
        normativeBase: 'Правила ИГИ, п. 27',
        description: 'При выявлении новых разностей грунтов',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['отбор', 'образцы']
      },
      {
        workId: 'excavation-photo',
        name: 'Фотофиксация строительных выемок',
        category: 'recommended',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'Правила ИГИ, п. 27',
        description: 'Фотографии стенок котлованов, характерных особенностей',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        tags: ['фото', 'документация']
      }
    ];
  }
};

// ============================================================================
// РАЗДЕЛ 15.2: ИЗЫСКАНИЯ ПРИ ЭКСПЛУАТАЦИИ
// ============================================================================

/**
 * Блок 15.2.1: Изыскания для реконструкции
 */
export const block_15_03_reconstruction: InstructionBlock = {
  id: 'block-15-03-reconstruction-surveys',
  section: 'Раздел 15: Строительство и эксплуатация',
  title: 'Изыскания для реконструкции',
  description: 'Обоснование увеличенных нагрузок при реконструкции',
  priority: 152,
  tags: ['реконструкция', 'эксплуатация'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.constructionPhase === 'реконструкция' ||
      input.loadIncrease === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-rules',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 28',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'При реконструкции с увеличением нагрузок обязательно выполнить изыскания для обоснования:\n' +
        '**Увеличенных нагрузок на основания:**\n' +
        '- Оценка дополнительной осадки от новых нагрузок\n' +
        '- Проверка несущей способности\n' +
        '**Новых конструктивных решений:**\n' +
        '- Надстройка этажей\n' +
        '- Пристройка к существующему зданию\n' +
        '**Усиления существующих фундаментов:**\n' +
        '- Оценка состояния существующих фундаментов\n' +
        '- Расчёт необходимого усиления\n' +
        '- Выбор технологии усиления',
      recommendedValues: {
        investigations: {
          value: ['нагрузки', 'осадки', 'усиление'],
          unit: 'аспекты',
          explanation: 'Обязательные направления изысканий'
        }
      }
    },
    {
      id: 'variant-st-rk',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'СТ РК 1399-2005',
        section: 'раздел 6',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Согласно СТ РК 1399-2005 дополнительно учесть:\n' +
        '- Влияние реконструкции на соседние здания\n' +
        '- Мероприятия по охране существующих конструкций',
      note: 'Дополнительные требования стандарта'
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'reconstruction-foundation-inspection',
        name: 'Обследование состояния существующих фундаментов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'объект',
        normativeBase: 'Правила ИГИ, п. 28',
        description: 'Оценка несущей способности и деформированности',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['реконструкция', 'фундаменты']
      },
      {
        workId: 'reconstruction-load-calculations',
        name: 'Расчёты дополнительных осадок от новых нагрузок',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'расчёт',
        normativeBase: 'Правила ИГИ, п. 28; СТ РК 1399-2005',
        description: 'Прогноз осадок при увеличении нагрузок',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['реконструкция', 'расчёт']
      },
      {
        workId: 'reconstruction-reinforcement',
        name: 'Проектирование усиления фундаментов',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'проект',
        normativeBase: 'Правила ИГИ, п. 28',
        description: 'Выбор технологии и расчёт усиления',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['реконструкция', 'усиление']
      }
    ];
  }
};

/**
 * Блок 15.2.2: Аварийные изыскания
 */
export const block_15_04_emergency: InstructionBlock = {
  id: 'block-15-04-emergency-surveys',
  section: 'Раздел 15: Строительство и эксплуатация',
  title: 'Аварийные изыскания',
  description: 'Изыскания при деформациях и аварийных ситуациях',
  priority: 153,
  tags: ['авария', 'деформации', 'эксплуатация'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.emergencySituation === true ||
      input.structuralDeformations === true
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-rules',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'Правила осуществления инженерно-геологических изысканий',
        section: 'п. 28',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'При предаварийной ситуации или деформациях сооружений выполнить изыскания для:\n' +
        '**Выявление причин деформаций:**\n' +
        '- Инженерно-геологические причины (осадка, оползень, подтопление)\n' +
        '- Изменение характеристик грунтов\n' +
        '- Внешние воздействия\n' +
        '**Укрепление оснований:**\n' +
        '- Оценка текущего состояния оснований\n' +
        '- Расчёт мероприятий по стабилизации\n' +
        '- Технология укрепления (цементация, силикатизация, грунтовые анкеры)\n' +
        '**Усиление фундаментов:**\n' +
        '- Срочное усиление конструкций\n' +
        '- Разгрузка оснований\n' +
        '**Инженерная защита:**\n' +
        '- Водопонижение\n' +
        '- Противооползневые мероприятия\n' +
        '- Дренаж',
      recommendedValues: {
        urgency: {
          value: 'срочно',
          unit: 'режим',
          explanation: 'Аварийный режим работ'
        }
      },
      warnings: [
        'Работы в аварийном режиме',
        'Требуется оперативность',
        'Безопасность персонала превыше всего'
      ]
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    return [
      {
        workId: 'emergency-inspection',
        name: 'Срочное инженерно-геологическое обследование',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'объект',
        normativeBase: 'Правила ИГИ, п. 28',
        description: 'Выявление причин деформаций, оценка опасности',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['авария', 'обследование']
      },
      {
        workId: 'emergency-measures',
        name: 'Разработка мероприятий инженерной защиты',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'проект',
        normativeBase: 'Правила ИГИ, п. 28',
        description: 'Срочные мероприятия по стабилизации ситуации',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['авария', 'мероприятия']
      },
      {
        workId: 'emergency-monitoring',
        name: 'Оперативный мониторинг развития деформаций',
        category: 'mandatory',
        module: 'geological',
        quantity: 1,
        unit: 'комплекс',
        normativeBase: 'Правила ИГИ, п. 28',
        description: 'Ежедневный контроль изменений',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['авария', 'мониторинг']
      }
    ];
  }
};

/**
 * Блок 15.2.3: Мониторинг при эксплуатации
 */
export const block_15_05_operation_monitoring: InstructionBlock = {
  id: 'block-15-05-operation-monitoring',
  section: 'Раздел 15: Строительство и эксплуатация',
  title: 'Мониторинг при эксплуатации',
  description: 'Режимные наблюдения за состоянием оснований и сооружений',
  priority: 154,
  tags: ['мониторинг', 'эксплуатация'],
  
  condition: (input: GeologicalInput) => {
    return (
      input.constructionPhase === 'эксплуатация' &&
      (
        input.responsibilityLevel === 'повышенная' ||
        input.geotechnicalCategory === 'III' ||
        (input.hazards && input.hazards.length > 0)
      )
    );
  },
  
  variants: [
    {
      id: 'variant-mandatory-sp-rk-102',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 8.6',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation: 'Для объектов повышенной ответственности и сложных условий обязательно организовать мониторинг:\n' +
        '**Деформации оснований и фундаментов:**\n' +
        '- Геодезические марки на сооружении\n' +
        '- Периодические измерения осадок\n' +
        '- Крены и горизонтальные смещения\n' +
        '**Уровень подземных вод:**\n' +
        '- Наблюдательные скважины\n' +
        '- Ежемесячные замеры УГВ\n' +
        '**Развитие опасных процессов:**\n' +
        '- Оползневые подвижки\n' +
        '- Карстовые провалы\n' +
        '- Суффозионные деформации\n' +
        '**Состояние инженерных сооружений:**\n' +
        '- Подпорные стены\n' +
        '- Дренажные системы\n' +
        '- Системы водопонижения',
      recommendedValues: {
        frequency: {
          value: 'ежемесячно',
          unit: 'режим',
          explanation: 'Минимальная частота наблюдений'
        }
      }
    },
    {
      id: 'variant-hydro-vsn',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'ВСН 34.2-88',
        section: 'п. 10.2',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation: 'Для гидроэнергетических объектов дополнительно:\n' +
        '- Мониторинг деформаций плотины\n' +
        '- Контроль фильтрации через тело и основание плотины\n' +
        '- Пьезометрические наблюдения',
      note: 'Для ГЭС и плотин'
    }
  ],
  
  generateWorks: (input: GeologicalInput, selectedVariant: InstructionVariant) => {
    const works: WorkItem[] = [
      {
        workId: 'monitoring-deformations',
        name: 'Мониторинг деформаций оснований и фундаментов',
        category: 'mandatory',
        module: 'geological',
        quantity: 12,
        unit: 'месяцев',
        normativeBase: 'СП РК 1.02-102-2014, п. 8.6',
        description: 'Геодезические измерения осадок, кренов',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мониторинг', 'деформации']
      },
      {
        workId: 'monitoring-ugv',
        name: 'Режимные наблюдения за уровнем подземных вод',
        category: 'mandatory',
        module: 'geological',
        quantity: 12,
        unit: 'месяцев',
        normativeBase: 'СП РК 1.02-102-2014, п. 8.6',
        description: 'Ежемесячные замеры в наблюдательных скважинах',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мониторинг', 'УГВ']
      }
    ];
    
    // Если есть опасные процессы
    if (input.hazards && input.hazards.length > 0) {
      works.push({
        workId: 'monitoring-hazards',
        name: 'Мониторинг развития опасных геологических процессов',
        category: 'mandatory',
        module: 'geological',
        quantity: 12,
        unit: 'месяцев',
        normativeBase: 'СП РК 1.02-102-2014, п. 8.6',
        description: 'Контроль оползней, карста, подтопления',
        priority: 'ОБЯЗАТЕЛЬНЫЙ',
        tags: ['мониторинг', 'опасные-процессы']
      });
    }
    
    // Дополнительно для гидроэнергетики
    if (selectedVariant.id === 'variant-hydro-vsn') {
      works.push({
        workId: 'monitoring-dam',
        name: 'Специальный мониторинг плотины и водохранилища',
        category: 'mandatory',
        module: 'geological',
        quantity: 12,
        unit: 'месяцев',
        normativeBase: 'ВСН 34.2-88, п. 10.2',
        description: 'Деформации, фильтрация, пьезометрия',
        priority: 'СПРАВОЧНЫЙ',
        tags: ['мониторинг', 'плотина']
      });
    }
    
    return works;
  }
};

// ============================================================================
// ЭКСПОРТ БЛОКОВ РАЗДЕЛА 15 (файл section12)
// ============================================================================

export const section12Blocks: InstructionBlock[] = [
  block_15_01_construction_control,    // Геотехнический контроль
  block_15_02_excavation_documentation, // Документация выемок
  block_15_03_reconstruction,          // Реконструкция
  block_15_04_emergency,               // Аварийные изыскания
  block_15_05_operation_monitoring     // Мониторинг
];

export default section12Blocks;
