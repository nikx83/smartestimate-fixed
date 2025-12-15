/**
 * Файл: section38-special-parameters.ts  
 * Назначение: Специальные лабораторные параметры
 */

import type { InstructionBlock, GeologicalInput, WorkItem } from './types';

export const block_38_01_special: InstructionBlock = {
  id: 'block-38-01-special',
  section: 'Раздел 38: Специальные параметры',
  title: 'Определение специальных физико-механических параметров',
  description: 'Дополнительные лабораторные испытания для особых условий',
  priority: 51,
  tags: ['лабораторные', 'специальные', 'дополнительные'],
  
  condition: (input: GeologicalInput) => {
    return input.geotechnicalCategory === 'III' ||
           input.numberOfFloors >= 16;
  },
  
  variants: [{
    id: 'variant-special-params',
    priority: 'ОПЦИОНАЛЬНЫЙ',
    normative: {
      document: 'ГОСТ 12248-2010',
      section: 'Дополнительные испытания',
      priority: 'ОПЦИОНАЛЬНЫЙ'
    },
    recommendation:
      '**СПЕЦИАЛЬНЫЕ ПАРАМЕТРЫ:**\n\n' +
      '**1. Модуль сдвига G**\n' +
      '**2. Динамический модуль Ed**\n' +
      '**3. Коэффициент бокового давления K₀**\n' +
      '**4. Сопротивление при циклических нагрузках**\n' +
      '**5. Параметры ползучести**\n' +
      '**6. Остаточная прочность**\n\n' +
      'Для особо ответственных объектов и сложных условий.'
  }],
  
  calculateValues: (input: GeologicalInput) => {
    const ige = input.expectedIGE || 3;
    return {
      specialTests: {
        value: ige * 2,
        unit: 'испытаний',
        explanation: 'Специальные параметры',
        confidence: 70
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_38_01_special.calculateValues!(input);
    const qty = typeof values.specialTests.value === 'number'
      ? values.specialTests.value : parseInt(String(values.specialTests.value));
    
    works.push({
      workId: 'LAB-SPEC-01',
      name: 'Определение специальных параметров грунтов',
      description: 'Модуль сдвига, K₀, циклическая прочность',
      unit: 'испытание',
      quantity: qty,
      category: 'optional',
      module: 'geological',
      priority: 'ОПЦИОНАЛЬНЫЙ',
      normativeBase: 'ГОСТ 12248-2010',
      tags: ['лабораторные', 'специальные'],
      priceTableCode: '1602-0721'
    });
    
    return works;
  }
};

export const section38_blocks: InstructionBlock[] = [block_38_01_special];
export default section38_blocks;
