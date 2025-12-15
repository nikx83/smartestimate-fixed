/**
 * Файл: section17-filtration-tests.ts
 * Назначение: Опытно-фильтрационные работы для определения гидрогеологических параметров
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 17.1: Опытные откачки из скважин
 */
export const block_17_01_pumping_tests: InstructionBlock = {
  id: 'block-17-01-pumping-tests',
  section: 'Раздел 17: Опытно-фильтрационные работы',
  title: 'Опытные откачки из скважин',
  description: 'Определение коэффициента фильтрации и водопритоков',
  priority: 23,
  tags: ['гидрогеология', 'откачки', 'фильтрация'],
  
  condition: (input: GeologicalInput) => {
    return input.hasGroundwater === true && 
           (input.hasBasement === true || 
            input.foundationType === 'свайный' ||
            input.requiresDewatering === true);
  },
  
  variants: [
    {
      id: 'variant-single-well-test',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Раздел 8. Гидрогеологические работы',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ОПЫТНЫЕ ОТКАЧКИ:**\n\n' +
        
        '**1. ЦЕЛЬ ОТКАЧЕК:**\n' +
        '- Определение коэффициента фильтрации Kф (м/сут)\n' +
        '- Оценка водопритоков Q (м³/сут)\n' +
        '- Радиус влияния R (м)\n' +
        '- Параметры водоносного горизонта (проводимость T, уровнепроводность a)\n' +
        '- Прогноз понижения УГВ при строительстве\n\n' +
        
        '**2. СХЕМЫ ОТКАЧЕК:**\n\n' +
        
        '**А. Одиночная скважина:**\n' +
        '- Центральная откачная скважина\n' +
        '- 3-4 наблюдательные скважины\n' +
        '- Расстояния: 10, 25, 50, 100 м от откачной\n' +
        '- Применение: локальные участки, первая оценка\n\n' +
        
        '**Б. Кустовая откачка (≥2 скважин):**\n' +
        '- 2-3 откачные скважины\n' +
        '- 4-6 наблюдательных\n' +
        '- Применение: крупные объекты, сложная гидрогеология\n\n' +
        
        '**3. МЕТОДИКА ПРОВЕДЕНИЯ:**\n\n' +
        
        '**Подготовительный этап:**\n' +
        '- Замер статического уровня (48 часов наблюдений)\n' +
        '- Проверка оборудования (насос, расходомер, уровнемеры)\n' +
        '- Обустройство водосброса\n\n' +
        
        '**Основная откачка:**\n' +
        '- Постоянный расход Q = const\n' +
        '- Продолжительность: минимум 72 часа\n' +
        '- Измерения уровней:\n' +
        '  * Первый час: каждые 5-10 мин\n' +
        '  * 2-6 часы: каждые 30 мин\n' +
        '  * 6-24 часа: каждые 2 часа\n' +
        '  * Далее: 2 раза в сутки\n' +
        '- Критерий стабилизации: ΔS < 1 см за 8 часов\n\n' +
        
        '**Восстановление уровня:**\n' +
        '- После прекращения откачки\n' +
        '- Продолжительность: 50% времени откачки\n' +
        '- Замеры по той же схеме\n\n' +
        
        '**4. РАСЧЁТНЫЕ ФОРМУЛЫ:**\n\n' +
        
        '**Безнапорный горизонт (формула Дюпюи):**\n' +
        '```\n' +
        'Kф = Q × ln(R/r) / (π × (H² - h²))\n' +
        '\n' +
        'где:\n' +
        'Q - расход откачки, м³/сут\n' +
        'R - радиус влияния, м\n' +
        'r - радиус скважины, м\n' +
        'H - мощность водоносного горизонта, м\n' +
        'h - высота столба воды в скважине, м\n' +
        '```\n\n' +
        
        '**Напорный горизонт (формула Тейса-Жакоба):**\n' +
        '```\n' +
        'Kф = Q × ln(R/r) / (2π × m × S)\n' +
        '\n' +
        'где:\n' +
        'm - мощность водоносного горизонта, м\n' +
        'S - понижение уровня, м\n' +
        '```\n\n' +
        
        '**5. ИНТЕРПРЕТАЦИЯ:**\n' +
        '- График S = f(lg t) - определение параметров\n' +
        '- График восстановления уровня\n' +
        '- Оценка граничных условий (подпитка, барражный эффект)\n\n' +
        
        '**6. ТРЕБУЕМОЕ КОЛИЧЕСТВО:**\n' +
        '- Простые условия: 1 откачка\n' +
        '- Сложные условия: 2-3 откачки\n' +
        '- Несколько водоносных горизонтов: по 1 откачке на каждый\n\n' +
        
        '**ПРОДОЛЖИТЕЛЬНОСТЬ:** 5-7 суток на 1 откачку (включая подготовку и восстановление)',
      
      recommendedValues: {
        numberOfTests: {
          value: 1,
          unit: 'откачка',
          explanation: 'Минимум для типовых объектов'
        },
        duration: {
          value: 72,
          unit: 'часов',
          explanation: 'Продолжительность основной откачки'
        },
        observationWells: {
          value: 3,
          unit: 'скважин',
          explanation: 'Наблюдательные скважины'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const aquifers = input.numberOfAquifers || 1;
    let testsPerAquifer = 1;
    
    // Увеличить для сложных условий
    if (input.geotechnicalCategory === 'III' || input.buildingArea > 10000) {
      testsPerAquifer = 2;
    }
    
    const totalTests = aquifers * testsPerAquifer;
    const observationWells = totalTests * 3;
    
    return {
      pumpingTests: {
        value: totalTests,
        unit: 'откачек',
        explanation: 'Опытные откачки',
        confidence: 90
      },
      observationPoints: {
        value: observationWells,
        unit: 'скважин',
        explanation: 'Наблюдательные скважины',
        confidence: 85
      },
      estimatedDuration: {
        value: totalTests * 7,
        unit: 'суток',
        explanation: 'Общая продолжительность работ',
        confidence: 80
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_17_01_pumping_tests.calculateValues!(input);
    
    const qty = typeof values.pumpingTests.value === 'number'
      ? values.pumpingTests.value
      : parseInt(String(values.pumpingTests.value));
    
    works.push({
      workId: 'HYDRO-PUMP-01',
      name: 'Опытные откачки из скважин',
      description: 
        'Определение коэффициента фильтрации, водопритоков, радиуса влияния. ' +
        'Включает бурение откачной и наблюдательных скважин, насосное оборудование, ' +
        'замеры уровней, камеральная обработка',
      unit: 'откачка',
      quantity: qty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'СП РК 1.02-102-2014, п. 8.4',
      tags: ['гидрогеология', 'откачки'],
      priceTableCode: '1602-0501'
    });
    
    return works;
  }
};

/**
 * Блок 17.2: Наливы в шурфы
 */
export const block_17_02_infiltration_tests: InstructionBlock = {
  id: 'block-17-02-infiltration',
  section: 'Раздел 17: Опытно-фильтрационные работы',
  title: 'Наливы воды в шурфы (инфильтрация)',
  description: 'Определение коэффициента фильтрации грунтов зоны аэрации',
  priority: 24,
  tags: ['гидрогеология', 'фильтрация', 'наливы'],
  
  condition: (input: GeologicalInput) => {
    return input.hasGroundwater === true && 
           input.groundwaterDepth !== undefined &&
           input.groundwaterDepth > 3;
  },
  
  variants: [
    {
      id: 'variant-pit-infiltration',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'ГОСТ 25584-2016',
        section: 'Метод налива в шурф',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation:
        '**НАЛИВЫ В ШУРФЫ:**\n\n' +
        
        '**1. НАЗНАЧЕНИЕ:**\n' +
        '- Определение Kф грунтов зоны аэрации\n' +
        '- Оценка скорости инфильтрации дождевых вод\n' +
        '- Проектирование дренажных систем\n' +
        '- Расчёт ливневой канализации\n\n' +
        
        '**2. УСЛОВИЯ ПРИМЕНЕНИЯ:**\n' +
        '- УГВ > 3 м от поверхности\n' +
        '- Глубина шурфа: 1.5-3.0 м\n' +
        '- До кровли водоносного горизонта должно оставаться >1 м\n\n' +
        
        '**3. МЕТОДИКА:**\n\n' +
        
        '**Подготовка:**\n' +
        '- Шурф размером 1.0×1.0 м, глубиной 2.0 м\n' +
        '- Зачистка дна\n' +
        '- Установка измерительного устройства (поплавок, рейка)\n\n' +
        
        '**Проведение налива:**\n' +
        '- Заполнение шурфа водой (слой 0.8-1.0 м)\n' +
        '- Поддержание постоянного напора H = const\n' +
        '- Измерение расхода воды Q через фиксированные интервалы\n' +
        '- Продолжительность: до стабилизации расхода (обычно 4-8 часов)\n\n' +
        
        '**Стабилизация:**\n' +
        '- Критерий: изменение Q < 5% за 1 час\n\n' +
        
        '**4. РАСЧЁТ Kф:**\n\n' +
        '**Метод постоянного напора:**\n' +
        '```\n' +
        'Kф = Q / (F × I)\n' +
        '\n' +
        'где:\n' +
        'Q - расход воды в стабилизированном режиме, м³/сут\n' +
        'F - площадь дна шурфа, м²\n' +
        'I - гидравлический градиент (I ≈ 1 при H >> глубины впитывания)\n' +
        '```\n\n' +
        
        '**С учётом формы шурфа:**\n' +
        '```\n' +
        'Kф = Q / (π × r² + 2π × r × H)\n' +
        '\n' +
        'где:\n' +
        'r - радиус дна шурфа, м\n' +
        'H - высота столба воды, м\n' +
        '```\n\n' +
        
        '**5. КОЛИЧЕСТВО НАЛИВОВ:**\n' +
        '- 2-3 шурфа на объект\n' +
        '- По одному в характерных точках\n' +
        '- Дополнительно при неоднородности грунтов\n\n' +
        
        '**6. ТИПИЧНЫЕ ЗНАЧЕНИЯ Kф:**\n' +
        '- Пески гравелистые: 50-100 м/сут\n' +
        '- Пески крупные: 20-50 м/сут\n' +
        '- Пески средние: 5-20 м/сут\n' +
        '- Пески мелкие: 1-5 м/сут\n' +
        '- Супеси: 0.1-1.0 м/сут\n' +
        '- Суглинки: 0.01-0.1 м/сут\n\n' +
        
        '**ВАЖНО:** Метод применим только для водопроницаемых грунтов (Kф > 0.1 м/сут)',
      
      recommendedValues: {
        numberOfTests: {
          value: 2,
          unit: 'налива',
          explanation: 'Минимум на объект'
        },
        duration: {
          value: 6,
          unit: 'часов',
          explanation: 'Средняя продолжительность одного налива'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    let numberOfTests = 2;
    
    // Увеличить для крупных участков
    if (input.buildingArea > 5000) {
      numberOfTests = 3;
    }
    
    return {
      infiltrationTests: {
        value: numberOfTests,
        unit: 'наливов',
        explanation: 'Наливы в шурфы',
        confidence: 85
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_17_02_infiltration_tests.calculateValues!(input);
    
    const qty = typeof values.infiltrationTests.value === 'number'
      ? values.infiltrationTests.value
      : parseInt(String(values.infiltrationTests.value));
    
    works.push({
      workId: 'HYDRO-INFILT-01',
      name: 'Наливы воды в шурфы (инфильтрация)',
      description: 
        'Определение коэффициента фильтрации грунтов зоны аэрации методом налива. ' +
        'Включает отрывку шурфа, налив воды, замеры расхода, камеральную обработку',
      unit: 'налив',
      quantity: qty,
      category: 'recommended',
      module: 'geological',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normativeBase: 'ГОСТ 25584-2016',
      tags: ['гидрогеология', 'фильтрация'],
      priceTableCode: '1602-0502'
    });
    
    return works;
  }
};

/**
 * Блок 17.3: Экспресс-методы (наливы в скважины)
 */
export const block_17_03_borehole_tests: InstructionBlock = {
  id: 'block-17-03-borehole-infiltration',
  section: 'Раздел 17: Опытно-фильтрационные работы',
  title: 'Наливы и откачки в одиночных скважинах',
  description: 'Экспресс-методы определения фильтрационных свойств',
  priority: 25,
  tags: ['гидрогеология', 'фильтрация', 'экспресс'],
  
  condition: (input: GeologicalInput) => {
    return input.hasGroundwater === true && 
           input.geotechnicalCategory !== 'III';
  },
  
  variants: [
    {
      id: 'variant-single-borehole',
      priority: 'СПРАВОЧНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Раздел 8.4',
        priority: 'СПРАВОЧНЫЙ'
      },
      recommendation:
        '**ЭКСПРЕСС-МЕТОДЫ В СКВАЖИНАХ:**\n\n' +
        
        '**1. МЕТОДЫ:**\n\n' +
        
        '**А. Налив в одиночную скважину:**\n' +
        '- Быстрый метод для предварительной оценки\n' +
        '- Заполнение скважины водой выше статического уровня\n' +
        '- Замер скорости впитывания\n' +
        '- Продолжительность: 2-4 часа\n' +
        '- Точность: ±50%\n\n' +
        
        '**Б. Откачка из одиночной скважины (без наблюдательных):**\n' +
        '- Краткосрочная откачка (4-6 часов)\n' +
        '- Замер понижения в откачной скважине\n' +
        '- Приближённая оценка Kф\n' +
        '- Точность: ±40%\n\n' +
        
        '**В. Метод "мгновенной" откачки (slug test):**\n' +
        '- Извлечение вытеснителя из скважины\n' +
        '- Замер восстановления уровня\n' +
        '- Обработка по методу Бауэра-Райса\n' +
        '- Продолжительность: 30-60 минут\n\n' +
        
        '**2. ПРИМЕНЕНИЕ:**\n' +
        '- Предварительные изыскания\n' +
        '- Объекты I-II категории сложности\n' +
        '- Дополнение к полноценным откачкам\n' +
        '- Контроль однородности водоносного горизонта\n\n' +
        
        '**3. ОГРАНИЧЕНИЯ:**\n' +
        '- Не применять для ответственных объектов (III категория)\n' +
        '- Результаты носят оценочный характер\n' +
        '- Требуют подтверждения полноценными откачками\n\n' +
        
        '**4. ПРЕИМУЩЕСТВА:**\n' +
        '- Быстрота (несколько часов вместо недели)\n' +
        '- Низкая стоимость\n' +
        '- Не требуют наблюдательных скважин\n' +
        '- Возможность массовых определений\n\n' +
        
        '**КОЛИЧЕСТВО:** 3-5 определений на объект',
      
      recommendedValues: {
        numberOfTests: {
          value: 3,
          unit: 'определений',
          explanation: 'Экспресс-тесты'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const numberOfWells = input.numberOfWells || 3;
    
    return {
      expressTests: {
        value: numberOfWells,
        unit: 'определений',
        explanation: 'Экспресс-определения Kф в скважинах',
        confidence: 70
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_17_03_borehole_tests.calculateValues!(input);
    
    const qty = typeof values.expressTests.value === 'number'
      ? values.expressTests.value
      : parseInt(String(values.expressTests.value));
    
    works.push({
      workId: 'HYDRO-EXPRESS-01',
      name: 'Экспресс-определение фильтрационных свойств в скважинах',
      description: 
        'Наливы/откачки в одиночных скважинах, экспресс-оценка коэффициента фильтрации',
      unit: 'определение',
      quantity: qty,
      category: 'optional',
      module: 'geological',
      priority: 'СПРАВОЧНЫЙ',
      normativeBase: 'СП РК 1.02-102-2014',
      tags: ['гидрогеология', 'экспресс'],
      priceTableCode: '1602-0503'
    });
    
    return works;
  }
};

export const section17_blocks: InstructionBlock[] = [
  block_17_01_pumping_tests,
  block_17_02_infiltration_tests,
  block_17_03_borehole_tests
];

export default section17_blocks;
