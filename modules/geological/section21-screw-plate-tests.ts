/**
 * Файл: section21-screw-plate-tests.ts
 * Назначение: Испытания винтовым штампом
 */

import type { 
  InstructionBlock, 
  GeologicalInput, 
  WorkItem 
} from './types';

/**
 * Блок 21.1: Испытания винтовым штампом
 */
export const block_21_01_screw_plate: InstructionBlock = {
  id: 'block-21-01-screw-plate',
  section: 'Раздел 21: Винтовой штамп',
  title: 'Испытания грунтов винтовым штампом',
  description: 'Определение E на глубине без отрывки шурфа',
  priority: 37,
  tags: ['полевые', 'винтовой-штамп', 'глубинные'],
  
  condition: (input: GeologicalInput) => {
    return input.foundationDepth !== undefined && 
           input.foundationDepth > 3 &&
           input.geotechnicalCategory !== 'I';
  },
  
  variants: [
    {
      id: 'variant-screw-standard',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'ГОСТ 20276-2012',
        section: 'Винтовой штамп',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation:
        '**ИСПЫТАНИЯ ВИНТОВЫМ ШТАМПОМ:**\n\n' +
        
        '**1. КОНСТРУКЦИЯ:**\n' +
        '- Стержень с винтовой лопастью\n' +
        '- Диаметр лопасти: 40-60 см\n' +
        '- Площадь: 1000-3000 см²\n' +
        '- Лопасть складывается при погружении\n' +
        '- Раскрывается на заданной глубине\n\n' +
        
        '**2. ПРЕИМУЩЕСТВА:**\n' +
        '- Испытания на глубине до 15-20 м\n' +
        '- Не требуется отрывка глубоких шурфов\n' +
        '- Ненарушенный массив грунта\n' +
        '- Производительность выше обычных штампов\n\n' +
        
        '**3. МЕТОДИКА:**\n' +
        '- Ввинчивание до заданной глубины\n' +
        '- Раскрытие лопастей\n' +
        '- Нагружение аналогично обычному штампу\n' +
        '- Ступени: 0.05-0.1 МПа\n' +
        '- Стабилизация осадок\n\n' +
        
        '**4. РАСЧЁТ E:**\n' +
        '```\n' +
        'E = k × d × (ΔP / Δs)\n' +
        '\n' +
        'где k - коэффициент (зависит от ν и формы)\n' +
        '```\n\n' +
        
        '**5. ПРИМЕНЕНИЕ:**\n' +
        '- Свайные фундаменты (испытания на уровне острия)\n' +
        '- Глубокие котлованы\n' +
        '- Слоистые толщи\n\n' +
        
        '**КОЛИЧЕСТВО:** 2-4 испытания на объект',
      
      recommendedValues: {
        testsCount: {
          value: 2,
          unit: 'испытаний',
          explanation: 'Минимум на объект'
        }
      }
    }
  ],
  
  calculateValues: (input: GeologicalInput) => {
    const depth = input.foundationDepth || 3;
    
    // Винтовой штамп целесообразен при глубине > 3м
    if (depth <= 3) {
      return {
        screwPlateTests: {
          value: 0,
          unit: 'испытаний',
          explanation: 'Не требуется (малая глубина)',
          confidence: 100
        }
      };
    }
    
    return {
      screwPlateTests: {
        value: 2,
        unit: 'испытаний',
        explanation: 'Винтовой штамп на глубине',
        confidence: 80
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_21_01_screw_plate.calculateValues!(input);
    
    if (values.screwPlateTests.value === 0) {
      return works;
    }
    
    const qty = typeof values.screwPlateTests.value === 'number'
      ? values.screwPlateTests.value
      : parseInt(String(values.screwPlateTests.value));
    
    works.push({
      workId: 'FIELD-SCREW-01',
      name: 'Испытания грунтов винтовым штампом',
      description: 
        'Ввинчивание штампа на заданную глубину, раскрытие лопастей, ' +
        'нагружение. Определение модуля деформации E',
      unit: 'испытание',
      quantity: qty,
      category: 'recommended',
      module: 'geological',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normativeBase: 'ГОСТ 20276-2012',
      tags: ['полевые', 'винтовой-штамп'],
      priceTableCode: '1602-0402'
    });
    
    return works;
  }
};

export const section21_blocks: InstructionBlock[] = [
  block_21_01_screw_plate
];

export default section21_blocks;
