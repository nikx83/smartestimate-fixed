/**
 * Файл: section02-reconnaissance.ts
 * Назначение: Рекогносцировочное обследование и маршрутные наблюдения
 * 
 * Описание:
 * Реализация Части II инструкции РК - предварительное изучение территории
 * перед началом буровых работ
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

// ============================================================================
// РАЗДЕЛ 2.1: РЕКОГНОСЦИРОВОЧНОЕ ОБСЛЕДОВАНИЕ
// ============================================================================

/**
 * Блок 2.1: Рекогносцировка площадки
 */
export const block_02_01_reconnaissance: InstructionBlock = {
  id: 'block-02-01-reconnaissance-survey',
  section: 'Раздел 2: Рекогносцировка',
  title: 'Рекогносцировочное обследование площадки',
  description: 'Предварительный осмотр и изучение территории',
  priority: 5,
  tags: ['рекогносцировка', 'предполевые', 'обязательный'],
  
  condition: (input: GeologicalInput) => {
    // Требуется для всех новых объектов без фондовых материалов
    return input.existingData === false || !input.existingData;
  },
  
  variants: [
    {
      id: 'variant-full-reconnaissance',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.2',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**РЕКОГНОСЦИРОВОЧНОЕ ОБСЛЕДОВАНИЕ:**\n\n' +
        
        '**1. ОСМОТР ТЕРРИТОРИИ:**\n' +
        '- Визуальная оценка рельефа\n' +
        '- Выявление форм рельефа\n' +
        '- Обнаружение опасных процессов\n' +
        '- Оценка доступности участка\n\n' +
        
        '**2. ИЗУЧЕНИЕ ОБНАЖЕНИЙ:**\n' +
        '- Естественные обнажения (берега рек, оврагов)\n' +
        '- Искусственные обнажения (карьеры, траншеи)\n' +
        '- Фотодокументирование\n' +
        '- Зарисовка геологического строения\n\n' +
        
        '**3. ГИДРОГЕОЛОГИЯ:**\n' +
        '- Выявление источников, родников\n' +
        '- Наблюдение в колодцах\n' +
        '- Опрос местных жителей\n\n' +
        
        '**4. ОПАСНЫЕ ПРОЦЕССЫ:**\n' +
        '- Оползни\n' +
        '- Карст, суффозия\n' +
        '- Эрозия\n' +
        '- Подтопление\n\n' +
        
        '**5. ИНЖЕНЕРНАЯ ОБСТАНОВКА:**\n' +
        '- Существующая застройка\n' +
        '- Подземные коммуникации\n' +
        '- Дороги\n' +
        '- Ограничения для производства работ\n\n' +
        
        '**РЕЗУЛЬТАТ:**\n' +
        'Отчёт о рекогносцировке с фотоматериалами, схемой расположения точек наблюдений',
      
      note: 'Выполняется до начала буровых работ, 1-2 дня'
    }
  ],
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    
    works.push({
      workId: 'RECON-001',
      name: 'Рекогносцировочное обследование территории',
      description: 
        'Предварительный осмотр площадки, изучение обнажений, ' +
        'гидрогеологические наблюдения, опрос населения, оценка ОГП',
      unit: 'объект',
      quantity: 1,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'СП РК 1.02-102-2014, п. 5.2',
      tags: ['рекогносцировка', 'предполевые']
    });
    
    return works;
  }
};

// ============================================================================
// РАЗДЕЛ 2.2: МАРШРУТНЫЕ НАБЛЮДЕНИЯ
// ============================================================================

/**
 * Блок 2.2: Маршрутные наблюдения с составлением карт
 */
export const block_02_02_route_observations: InstructionBlock = {
  id: 'block-02-02-route-observations',
  section: 'Раздел 2: Рекогносцировка',
  title: 'Маршрутные наблюдения',
  description: 'Проходка маршрутов для детального изучения территории',
  priority: 6,
  tags: ['маршруты', 'рекогносцировка', 'карты'],
  
  condition: (input: GeologicalInput) => {
    // Требуется для крупных площадок (>5 га) или линейных (>5 км)
    return (
      (input.buildingArea && input.buildingArea > 50000) || 
      (input.linearLength && input.linearLength > 5)
    );
  },
  
  variants: [
    {
      id: 'variant-with-mapping',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      condition: (input) => !input.existingData,
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'п. 5.3',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation:
        '**МАРШРУТНЫЕ НАБЛЮДЕНИЯ:**\n\n' +
        
        '**1. ЦЕЛЬ:**\n' +
        '- Составление ИГ карты М 1:10000 - 1:25000\n' +
        '- Детальное изучение геоморфологии\n' +
        '- Выявление литологии и стратиграфии\n' +
        '- Изучение опасных процессов\n\n' +
        
        '**2. СОДЕРЖАНИЕ:**\n' +
        '- Описание точек наблюдений:\n' +
        '  * GPS координаты\n' +
        '  * Абсолютные отметки\n' +
        '  * Геоморфология\n' +
        '  * Геологическое строение\n' +
        '  * Фотофиксация\n\n' +
        
        '**3. ОТБОР ОБРАЗЦОВ:**\n' +
        '- Из обнажений\n' +
        '- Для лабораторных испытаний:\n' +
        '  * Гранулометрия\n' +
        '  * Пластичность\n' +
        '  * Плотность\n\n' +
        
        '**4. РЕЗУЛЬТАТ:**\n' +
        '- Инженерно-геологическая карта\n' +
        '- Схема геоморфологии\n' +
        '- Карта опасных процессов\n' +
        '- Отчёт о маршрутных наблюдениях',
      
      note: 'Выполняется параллельно с бурением или до начала буровых работ'
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    let routesLength = 0;
    
    if (input.buildingArea && typeof input.buildingArea === 'number') {
      // Для площадных: 2% от площади (в км)
      const areaKm2 = input.buildingArea / 1_000_000;
      routesLength = areaKm2 * 20; // 20 км на 1 км²
    }
    
    if (input.linearLength && typeof input.linearLength === 'number') {
      // Для линейных: вся длина + 20% на боковые маршруты
      routesLength = input.linearLength * 1.2;
    }
    
    const observationPoints = Math.ceil(routesLength * 4); // 4 точки на км
    const samplingPoints = Math.ceil(observationPoints * 0.3); // 30% точек с отбором
    
    return {
      routesLength: {
        value: Math.round(routesLength * 10) / 10,
        unit: 'км',
        explanation: 'Общая протяжённость маршрутов',
        confidence: 85
      },
      observationPoints: {
        value: observationPoints,
        unit: 'точек',
        explanation: 'Количество точек наблюдений',
        confidence: 80
      },
      samplingPoints: {
        value: samplingPoints,
        unit: 'точек',
        explanation: 'Точки отбора образцов',
        confidence: 75
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_02_02_route_observations.calculateValues!(input);
    
    const routesLengthValue = typeof values.routesLength.value === 'number' 
      ? values.routesLength.value 
      : parseFloat(String(values.routesLength.value));
    
    if (routesLengthValue > 0) {
      works.push({
        workId: 'ROUTE-001',
        name: 'Маршрутные наблюдения с составлением инженерно-геологической карты',
        description: 
          'Проходка маршрутов, описание обнажений и точек наблюдений, ' +
          'отбор образцов, фотодокументирование, составление карт',
        unit: 'км маршрутов',
        quantity: routesLengthValue,
        category: 'recommended',
        module: 'geological',
        priority: 'РЕКОМЕНДУЕМЫЙ',
        normativeBase: 'СП РК 1.02-102-2014, п. 5.3',
        tags: ['маршруты', 'рекогносцировка', 'картирование']
      });
    }
    
    return works;
  }
};

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export const section02_blocks: InstructionBlock[] = [
  block_02_01_reconnaissance,
  block_02_02_route_observations
];

export default section02_blocks;
