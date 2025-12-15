/**
 * Файл: section40-subsidence-soils.ts
 * Назначение: Исследование просадочных грунтов
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 40.1: Выявление просадочных грунтов
 */
export const block_40_01_subsidence_identification: InstructionBlock = {
  id: 'block-40-01-subsidence-id',
  section: 'Раздел 40: Просадочные грунты',
  title: 'Выявление и исследование просадочных грунтов',
  description: 'Определение просадочности лессовых грунтов',
  priority: 26,
  tags: ['специфические', 'просадочные', 'лессовые'],
  
  condition: (input: GeologicalInput) => {
    return input.soilTypes?.includes('лессовые') ||
           input.soilTypes?.includes('просадочные') ||
           input.region === 'Южный Казахстан' ||
           input.region === 'Алматинская область';
  },
  
  variants: [
    {
      id: 'variant-subsidence-full',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normative: {
        document: 'СП РК 5.01-103-2013',
        section: 'Проектирование оснований зданий на просадочных грунтах',
        priority: 'ОБЯЗАТЕЛЬНЫЙ'
      },
      recommendation:
        '**ИССЛЕДОВАНИЕ ПРОСАДОЧНЫХ ГРУНТОВ:**\n\n' +
        
        '**1. ПРИЗНАКИ ПРОСАДОЧНОСТИ:**\n' +
        '- Лессовые грунты (желтовато-палевый цвет)\n' +
        '- Пористость e > 0.7\n' +
        '- Степень влажности Sr < 0.8\n' +
        '- Макропористая структура\n' +
        '- Карбонатные включения\n\n' +
        
        '**2. ЛАБОРАТОРНЫЕ ИСПЫТАНИЯ:**\n\n' +
        
        '**А. Компрессионно-просадочные испытания:**\n' +
        '- Образцы ненарушенного сложения\n' +
        '- Два режима:\n' +
        '  * При природной влажности Wn\n' +
        '  * При полном водонасыщении Wsat\n' +
        '- Ступени нагрузки: 0.1, 0.2, 0.3 МПа\n' +
        '- Определение относительной просадочности εsl\n\n' +
        
        '**Б. Расчёт просадочности:**\n' +
        '```\n' +
        'εsl = (hsat - hn) / h₀\n' +
        '\n' +
        'где:\n' +
        'hsat - высота образца после замачивания под нагрузкой\n' +
        'hn - высота образца при природной влажности\n' +
        'h₀ - начальная высота образца\n' +
        '```\n\n' +
        
        '**3. КЛАССИФИКАЦИЯ ПО ПРОСАДОЧНОСТИ:**\n' +
        '- Непросадочные: εsl < 0.01\n' +
        '- Слабопросадочные: 0.01 ≤ εsl < 0.03\n' +
        '- Среднепросадочные: 0.03 ≤ εsl < 0.07\n' +
        '- Сильнопросадочные: εsl ≥ 0.07\n\n' +
        
        '**4. ОПРЕДЕЛЕНИЕ МОЩНОСТИ ПРОСАДОЧНОЙ ТОЛЩИ:**\n' +
        '```\n' +
        'Hsl = Σ(hi × εsli)\n' +
        '\n' +
        'где:\n' +
        'hi - мощность i-го слоя\n' +
        'εsli - относительная просадочность i-го слоя\n' +
        '```\n\n' +
        
        '**5. ТИПЫ ГРУНТОВЫХ УСЛОВИЙ:**\n\n' +
        
        '**I тип:** Hsl ≤ 5 см\n' +
        '- Возможно строительство без спецмероприятий\n\n' +
        
        '**II тип:** Hsl > 5 см\n' +
        '- Обязательны противопросадочные мероприятия:\n' +
        '  * Уплотнение грунтов (трамбование, виброуплотнение)\n' +
        '  * Замачивание с последующей нагрузкой\n' +
        '  * Закрепление грунтов (силикатизация, цементация)\n' +
        '  * Устройство свайных фундаментов ниже просадочной толщи\n' +
        '  * Гидроизоляция и отвод поверхностных вод\n\n' +
        
        '**6. ПОЛЕВЫЕ ИСПЫТАНИЯ:**\n' +
        '- Штампы с замачиванием (площадь 5000 см²)\n' +
        '- Статическое зондирование до и после замачивания\n' +
        '- Опытные замачивания площадок\n\n' +
        
        '**7. КОЛИЧЕСТВО ИСПЫТАНИЙ:**\n' +
        '- Лабораторных: 6-12 на каждый просадочный слой\n' +
        '- Полевых штамповых: 2-3 на объект\n' +
        '- Зондирование: каждая скважина\n\n' +
        
        '**ВАЖНО:** Просадочность должна исследоваться на всю глубину сжимаемой толщи',
      
      recommendedValues: {
        labTestsPerLayer: {
          value: 6,
          unit: 'испытаний',
          explanation: 'На каждый просадочный слой'
        },
        fieldTests: {
          value: 2,
          unit: 'штампа',
          explanation: 'Штамповые испытания с замачиванием'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const subsidentLayers = input.expectedIGE || 2;
    const labTests = subsidentLayers * 6;
    const fieldTests = 2;
    
    return {
      laboratoryTests: {
        value: labTests,
        unit: 'испытаний',
        explanation: 'Компрессионно-просадочные испытания',
        confidence: 90
      },
      stampTests: {
        value: fieldTests,
        unit: 'испытаний',
        explanation: 'Штамповые испытания с замачиванием',
        confidence: 85
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_40_01_subsidence_identification.calculateValues!(input);
    
    const labQty = typeof values.laboratoryTests.value === 'number'
      ? values.laboratoryTests.value
      : parseInt(String(values.laboratoryTests.value));
    
    const fieldQty = typeof values.stampTests.value === 'number'
      ? values.stampTests.value
      : parseInt(String(values.stampTests.value));
    
    works.push({
      workId: 'SPEC-SUBSID-01',
      name: 'Компрессионно-просадочные испытания грунтов',
      description: 
        'Определение относительной просадочности εsl лабораторным методом. ' +
        'Испытания при природной влажности и после замачивания',
      unit: 'испытание',
      quantity: labQty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'СП РК 5.01-103-2013, ГОСТ 12248-2010',
      tags: ['специфические', 'просадочные', 'лаборатория'],
      priceTableCode: '1602-0708'
    });
    
    works.push({
      workId: 'SPEC-SUBSID-02',
      name: 'Штамповые испытания просадочных грунтов с замачиванием',
      description: 
        'Полевые штамповые испытания для определения просадочности in situ',
      unit: 'испытание',
      quantity: fieldQty,
      category: 'mandatory',
      module: 'geological',
      priority: 'ОБЯЗАТЕЛЬНЫЙ',
      normativeBase: 'ГОСТ 20276-2012',
      tags: ['специфические', 'просадочные', 'штампы'],
      priceTableCode: '1602-0403'
    });
    
    return works;
  }
};

export const section40_blocks: InstructionBlock[] = [
  block_40_01_subsidence_identification
];

export default section40_blocks;
