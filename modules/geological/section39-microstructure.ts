/**
 * Файл: section39-microstructure.ts
 * Назначение: Микроструктурные исследования
 */

import type { InstructionBlock, GeologicalInput, WorkItem } from './types';

export const block_39_01_microstructure: InstructionBlock = {
  id: 'block-39-01-microstructure',
  section: 'Раздел 39: Микроструктура',
  title: 'Микроструктурные и минералогические исследования',
  description: 'Изучение структуры и минерального состава грунтов',
  priority: 52,
  tags: ['лабораторные', 'микроструктура', 'минералогия'],
  
  condition: (input: GeologicalInput) => {
    return input.requiresDetailedAnalysis === true ||
           input.geotechnicalCategory === 'III';
  },
  
  variants: [{
    id: 'variant-microstructure',
    priority: 'ОПЦИОНАЛЬНЫЙ',
    normative: {
      document: 'ГОСТ 25100-2020',
      section: 'Микроструктурные исследования',
      priority: 'ОПЦИОНАЛЬНЫЙ'
    },
    recommendation:
      '**МИКРОСТРУКТУРНЫЕ ИССЛЕДОВАНИЯ:**\n\n' +
      '**1. Микроскопия:**\n' +
      '- Оптическая микроскопия\n' +
      '- Электронная микроскопия (SEM)\n' +
      '- Изучение структуры грунта\n\n' +
      '**2. Рентгеноструктурный анализ:**\n' +
      '- Минеральный состав глин\n' +
      '- Идентификация минералов\n\n' +
      '**3. Дифференциально-термический анализ (ДТА)**\n\n' +
      '**4. Гранулометрия лазерная (для тонких фракций)**\n\n' +
      'Для научных исследований и особо сложных грунтов.'
  }],
  
  calculateValues: (input: GeologicalInput) => {
    const ige = input.expectedIGE || 3;
    return {
      microTests: {
        value: ige,
        unit: 'образцов',
        explanation: 'Микроструктурные исследования',
        confidence: 60
      }
    };
  },
  
  generateWorks: (input: GeologicalInput) => {
    const works: WorkItem[] = [];
    const values = block_39_01_microstructure.calculateValues!(input);
    const qty = typeof values.microTests.value === 'number'
      ? values.microTests.value : parseInt(String(values.microTests.value));
    
    works.push({
      workId: 'LAB-MICRO-01',
      name: 'Микроструктурные исследования грунтов',
      description: 'Микроскопия, рентгеноструктурный анализ, ДТА',
      unit: 'образец',
      quantity: qty,
      category: 'optional',
      module: 'geological',
      priority: 'ОПЦИОНАЛЬНЫЙ',
      normativeBase: 'ГОСТ 25100-2020',
      tags: ['лабораторные', 'микроструктура'],
      priceTableCode: '1602-0722'
    });
    
    return works;
  }
};

export const section39_blocks: InstructionBlock[] = [block_39_01_microstructure];
export default section39_blocks;
